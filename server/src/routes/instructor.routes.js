import { Router } from "express";
import mongoose from "mongoose";
import { Course, Lecture, Section } from "../models/Course.js";
import { Enrollment } from "../models/Learning.js";
import { Order } from "../models/Commerce.js";
import { requireRole } from "../middleware/auth.js";
import { ApiError, asyncHandler } from "../utils/http.js";
import {
  courseJSON,
  lectureJSON,
  sectionJSON,
} from "../utils/serializers.js";
import {
  canManageCourse,
  createCourseDoc,
  updateCourseDoc,
} from "../services/courses.js";

const router = Router();

router.use(requireRole("instructor", "admin"));

function objectId(value, label) {
  if (!mongoose.isValidObjectId(value)) throw new ApiError(404, `${label} not found.`);
  return value;
}

async function ownedCourse(req) {
  const course = await Course.findById(objectId(req.params.courseId, "Course"));
  if (!course) throw new ApiError(404, "Course not found.");
  if (!canManageCourse(course, req.user)) {
    throw new ApiError(403, "You do not have access to this course.");
  }
  return course;
}

router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const filter = req.user.role === "admin" ? {} : { instructor: req.user._id };
    const courses = await Course.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, courses: courses.map(courseJSON) });
  }),
);

router.post(
  "/courses",
  asyncHandler(async (req, res) => {
    const course = await createCourseDoc({
      body: req.body,
      user: req.user,
      status: "DRAFT",
    });
    res.status(201).json({ success: true, course: courseJSON(course) });
  }),
);

router.put(
  "/courses/:courseId",
  asyncHandler(async (req, res) => {
    const course = await ownedCourse(req);
    await updateCourseDoc(course, req.body);
    res.json({ success: true, course: courseJSON(course) });
  }),
);

router.post(
  "/courses/:courseId/submit",
  asyncHandler(async (req, res) => {
    const course = await ownedCourse(req);
    if (!["DRAFT", "UNPUBLISHED", "ARCHIVED"].includes(course.status)) {
      throw new ApiError(400, "This course has already been submitted.");
    }
    course.status = "SUBMITTED";
    await course.save();
    res.json({
      success: true,
      message: "Course submitted for review.",
      course: courseJSON(course),
    });
  }),
);

router.get(
  "/students",
  asyncHandler(async (req, res) => {
    const filter = req.user.role === "admin" ? {} : { instructor: req.user._id };
    const courseIds = await Course.distinct("_id", filter);
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate("user", "name email avatar")
      .populate("course", "name thumbnail")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      students: enrollments.map((enrollment) => ({
        _id: enrollment._id,
        id: enrollment._id,
        user: enrollment.user,
        student: enrollment.user,
        course: enrollment.course,
        courseId: enrollment.course?._id ?? enrollment.course,
        courseName: enrollment.course?.name || "",
        progress: Number(enrollment.progress ?? 0),
        completed: Boolean(enrollment.isCompleted),
        enrolledAt: enrollment.createdAt,
      })),
    });
  }),
);

router.get(
  "/analytics",
  asyncHandler(async (req, res) => {
    const filter = req.user.role === "admin" ? {} : { instructor: req.user._id };
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    const courseIds = courses.map((course) => course._id);

    const [enrollmentRows, orderRows] = await Promise.all([
      Enrollment.aggregate([
        { $match: { course: { $in: courseIds } } },
        {
          $group: {
            _id: "$course",
            enrollments: { $sum: 1 },
            completions: { $sum: { $cond: ["$isCompleted", 1, 0] } },
          },
        },
      ]),
      Order.aggregate([
        { $match: { course: { $in: courseIds }, status: "paid" } },
        { $group: { _id: "$course", revenue: { $sum: "$amount" }, orders: { $sum: 1 } } },
      ]),
    ]);

    const perCourse = courses.map((course) => {
      const stats = enrollmentRows.find((row) => String(row._id) === String(course._id));
      const revenue = orderRows.find((row) => String(row._id) === String(course._id));
      return {
        _id: course._id,
        courseId: course._id,
        name: course.name,
        course: { _id: course._id, name: course.name },
        courseName: course.name,
        purchased: stats?.enrollments || 0,
        enrollments: stats?.enrollments || 0,
        completions: stats?.completions || 0,
        rating: Number(course.rating ?? 0),
        revenue: Number(revenue?.revenue ?? 0),
      };
    });

    const totalEnrollments = perCourse.reduce((sum, row) => sum + row.enrollments, 0);
    const totalCompletions = perCourse.reduce((sum, row) => sum + row.completions, 0);

    res.json({
      success: true,
      totalCourses: courses.length,
      totalEnrollments,
      totalCompletions,
      totalRevenue: perCourse.reduce((sum, row) => sum + row.revenue, 0),
      courses: perCourse,
    });
  }),
);

router.get(
  "/revenue",
  asyncHandler(async (req, res) => {
    const filter = req.user.role === "admin" ? {} : { instructor: req.user._id };
    const courseIds = await Course.distinct("_id", filter);
    const orders = await Order.find({ course: { $in: courseIds }, status: "paid" })
      .populate("course", "name")
      .sort({ createdAt: -1 });

    const byCourseMap = new Map();
    let totalRevenue = 0;

    for (const order of orders) {
      totalRevenue += Number(order.amount ?? 0);
      const key = String(order.course?._id ?? order.course);
      const row = byCourseMap.get(key) || {
        course: order.course
          ? { _id: order.course._id, name: order.course.name }
          : null,
        courseName: order.course?.name || "Course",
        revenue: 0,
        orders: 0,
      };
      row.revenue += Number(order.amount ?? 0);
      row.orders += 1;
      byCourseMap.set(key, row);
    }

    res.json({
      success: true,
      totalRevenue,
      totalEnrollments: orders.length,
      byCourse: [...byCourseMap.values()],
    });
  }),
);

router.post(
  "/courses/:courseId/lectures",
  asyncHandler(async (req, res) => {
    const course = await ownedCourse(req);

    const title = String(req.body?.title ?? "").trim();
    if (!title) throw new ApiError(400, "Lecture title is required.");

    const sectionTitle = String(req.body?.videoSection ?? "").trim() || "Lessons";
    let section = await Section.findOne({
      courseId: course._id,
      title: new RegExp(`^${sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
    });

    if (!section) {
      section = await Section.create({
        courseId: course._id,
        title: sectionTitle,
        order: await Section.countDocuments({ courseId: course._id }),
      });
    }

    const lecture = await Lecture.create({
      courseId: course._id,
      sectionId: section._id,
      title,
      description: String(req.body?.description ?? ""),
      videoUrl: String(req.body?.videoUrl ?? ""),
      videoLength: Math.max(Number(req.body?.videoLength) || 0, 0),
      isPreview: Boolean(req.body?.isPreview),
      order: await Lecture.countDocuments({ sectionId: section._id }),
    });

    res.status(201).json({
      success: true,
      lecture: lectureJSON(lecture),
      section: sectionJSON(section),
    });
  }),
);

export default router;
