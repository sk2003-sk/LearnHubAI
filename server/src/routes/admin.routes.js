import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import { COURSE_STATUSES, Course } from "../models/Course.js";
import { Enrollment } from "../models/Learning.js";
import { Order } from "../models/Commerce.js";
import { requireRole } from "../middleware/auth.js";
import { ApiError, asyncHandler, parseIntParam } from "../utils/http.js";
import { courseJSON, orderJSON, userJSON } from "../utils/serializers.js";

const router = Router();

router.use(requireRole("admin"));

function adminOrderJSON(order) {
  const base = orderJSON(order);
  const user = order.user && typeof order.user === "object" ? order.user : null;
  return {
    ...base,
    orderId: base._id,
    userId: user
      ? { _id: user._id, name: user.name, email: user.email }
      : order.user,
    user: user ? { _id: user._id, name: user.name, email: user.email } : order.user,
    payment_info: base.paymentInfo,
    paymentStatus: base.paymentInfo?.status || base.status,
  };
}

router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const limit = parseIntParam(req.query.limit, 100);
    const courses = await Course.find().sort({ createdAt: -1 }).limit(limit);
    res.json({ success: true, courses: courses.map(courseJSON), total: courses.length });
  }),
);

router.put(
  "/courses/:courseId/status",
  asyncHandler(async (req, res) => {
    const status = String(req.body?.status ?? "").toUpperCase();
    if (!COURSE_STATUSES.includes(status)) {
      throw new ApiError(400, "Invalid course status.");
    }
    if (!mongoose.isValidObjectId(req.params.courseId)) {
      throw new ApiError(404, "Course not found.");
    }

    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { status },
      { new: true },
    );
    if (!course) throw new ApiError(404, "Course not found.");

    res.json({ success: true, message: `Course status updated to ${status}.`, course: courseJSON(course) });
  }),
);

router.get(
  "/instructors",
  asyncHandler(async (req, res) => {
    const limit = parseIntParam(req.query.limit, 100);
    const [instructors, admins] = await Promise.all([
      User.find({ role: "instructor" }).sort({ createdAt: -1 }).limit(limit),
      User.find({ role: "admin" }).sort({ createdAt: -1 }).limit(limit),
    ]);

    res.json({
      success: true,
      instructors: instructors.map(userJSON),
      admins: admins.map(userJSON),
      total: instructors.length,
    });
  }),
);

router.get(
  "/orders",
  asyncHandler(async (req, res) => {
    const limit = parseIntParam(req.query.limit, 100);
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("course", "name thumbnail")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ success: true, orders: orders.map(adminOrderJSON), total: orders.length });
  }),
);

router.get(
  "/enrollments/export",
  asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find()
      .populate("user", "name email")
      .populate("course", "name")
      .sort({ createdAt: -1 });

    const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = [
      ["Enrollment ID", "Student", "Email", "Course", "Progress", "Completed", "Enrolled At"],
      ...enrollments.map((enrollment) => [
        enrollment._id,
        enrollment.user?.name || "",
        enrollment.user?.email || "",
        enrollment.course?.name || "",
        Number(enrollment.progress ?? 0),
        enrollment.isCompleted ? "yes" : "no",
        enrollment.createdAt?.toISOString?.() || "",
      ]),
    ];

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="learnhub-enrollments.csv"');
    res.send(rows.map((row) => row.map(escape).join(",")).join("\n"));
  }),
);

router.get(
  "/enrollments",
  asyncHandler(async (req, res) => {
    const limit = parseIntParam(req.query.limit, 100);
    const enrollments = await Enrollment.find()
      .populate("user", "name email")
      .populate("course", "name thumbnail")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      enrollments: enrollments.map((enrollment) => ({
        _id: enrollment._id,
        id: enrollment._id,
        user: enrollment.user,
        userId: enrollment.user?._id ?? enrollment.user,
        course: enrollment.course,
        courseId: enrollment.course?._id ?? enrollment.course,
        courseName: enrollment.course?.name || "",
        progress: Number(enrollment.progress ?? 0),
        completed: Boolean(enrollment.isCompleted),
        enrolledAt: enrollment.createdAt,
        createdAt: enrollment.createdAt,
      })),
      total: enrollments.length,
    });
  }),
);

router.get(
  "/analytics",
  asyncHandler(async (req, res) => {
    const [
      users,
      students,
      instructors,
      admins,
      courses,
      publishedCourses,
      orders,
      paidOrders,
      refundedOrders,
      enrollments,
      completedEnrollments,
      revenueRows,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "instructor" }),
      User.countDocuments({ role: "admin" }),
      Course.countDocuments(),
      Course.countDocuments({ status: "PUBLISHED" }),
      Order.countDocuments(),
      Order.countDocuments({ status: "paid" }),
      Order.countDocuments({ status: "refunded" }),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ isCompleted: true }),
      Order.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    res.json({
      success: true,
      users,
      students,
      instructors,
      admins,
      courses,
      publishedCourses,
      orders,
      paidOrders,
      refundedOrders,
      enrollments,
      completedEnrollments,
      revenue: Number(revenueRows[0]?.total ?? 0),
    });
  }),
);

export default router;
