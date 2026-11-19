import { Router } from "express";
import mongoose from "mongoose";
import { Course, Lecture, Section } from "../models/Course.js";
import { Enrollment } from "../models/Learning.js";
import { CourseQuestion } from "../models/System.js";
import { optionalAuth, requireAuth, requireRole } from "../middleware/auth.js";
import { ApiError, asyncHandler } from "../utils/http.js";
import { courseJSON, reviewJSON, sectionJSON } from "../utils/serializers.js";
import { hasCourseAccess } from "../services/learning.js";
import { saveCourseReview } from "../services/commerce.js";
import {
  canManageCourse,
  createCourseDoc,
  deleteCourseCascade,
  updateCourseDoc,
} from "../services/courses.js";

const router = Router();

function objectId(value, label) {
  if (!mongoose.isValidObjectId(value)) throw new ApiError(404, `${label} not found.`);
  return value;
}

async function loadCourse(courseId) {
  const course = await Course.findById(objectId(courseId, "Course"));
  if (!course) throw new ApiError(404, "Course not found.");
  return course;
}

async function sectionsWithLectures(courseId) {
  const [sections, lectures] = await Promise.all([
    Section.find({ courseId }).sort({ order: 1, createdAt: 1 }),
    Lecture.find({ courseId }).sort({ order: 1, createdAt: 1 }),
  ]);
  const grouped = new Map(sections.map((section) => [String(section._id), []]));
  for (const lecture of lectures) {
    grouped.get(String(lecture.sectionId))?.push(lecture);
  }
  return sections.map((section) =>
    sectionJSON(section, grouped.get(String(section._id)) || []),
  );
}

function hideLockedVideos(sections) {
  return sections.map((section) => ({
    ...section,
    lectures: (section.lectures || []).map((lecture) =>
      lecture.isPreview ? lecture : { ...lecture, videoUrl: "", video: "" },
    ),
  }));
}

async function enrollmentOr403(user, course) {
  const enrollment = await Enrollment.findOne({ user: user._id, course: course._id });
  if (!enrollment) {
    throw new ApiError(403, "Enroll in this course to access its lessons.");
  }
  return enrollment;
}

router.get(
  "/get-course/:courseId",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const course = await loadCourse(req.params.courseId);
    const canView =
      course.status === "PUBLISHED" || (await hasCourseAccess(req.user, course));
    if (!canView) throw new ApiError(404, "Course not found.");
    res.json({ success: true, course: courseJSON(course) });
  }),
);

router.get(
  "/get-course-content/:courseId",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const course = await loadCourse(req.params.courseId);
    const access = await hasCourseAccess(req.user, course);
    if (course.status !== "PUBLISHED" && !access) {
      throw new ApiError(404, "Course not found.");
    }

    const sections = await sectionsWithLectures(course._id);
    const visibleSections = access ? sections : hideLockedVideos(sections);

    res.json({
      success: true,
      course: courseJSON(course),
      courseData: { ...courseJSON(course), sections: visibleSections },
      curriculum: visibleSections,
      sections: visibleSections,
      hasAccess: access,
    });
  }),
);

router.post(
  "/create-course",
  requireRole("admin", "instructor"),
  asyncHandler(async (req, res) => {
    const course = await createCourseDoc({
      body: req.body,
      user: req.user,
      status: req.user.role === "admin" ? "PUBLISHED" : "DRAFT",
    });
    res.status(201).json({ success: true, message: "Course created.", course: courseJSON(course) });
  }),
);

router.put(
  "/edit-course/:courseId",
  requireRole("admin", "instructor"),
  asyncHandler(async (req, res) => {
    const course = await loadCourse(req.params.courseId);
    if (!canManageCourse(course, req.user)) {
      throw new ApiError(403, "You do not have access to this course.");
    }
    await updateCourseDoc(course, req.body);
    res.json({ success: true, message: "Course updated.", course: courseJSON(course) });
  }),
);

router.delete(
  "/delete-course/:courseId",
  requireRole("admin", "instructor"),
  asyncHandler(async (req, res) => {
    const course = await loadCourse(req.params.courseId);
    if (!canManageCourse(course, req.user)) {
      throw new ApiError(403, "You do not have access to this course.");
    }
    await deleteCourseCascade(course._id);
    res.json({ success: true, message: "Course deleted." });
  }),
);

router.get(
  "/get-all-course-dashboard",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ success: true, courses: courses.map(courseJSON), total: courses.length });
  }),
);

router.put(
  "/add-review/:courseId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const course = await loadCourse(req.params.courseId);
    if (req.user.role === "user") {
      await enrollmentOr403(req.user, course);
    }

    const rating = Number(req.body?.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5.");
    }

    const review = await saveCourseReview({
      user: req.user,
      course,
      rating,
      comment: String(req.body?.review ?? req.body?.comment ?? "").slice(0, 2000),
    });

    res.status(201).json({ success: true, review: reviewJSON(review), message: "Review saved." });
  }),
);

router.put(
  "/add-question",
  requireAuth,
  asyncHandler(async (req, res) => {
    const course = await loadCourse(req.body?.courseId ?? req.body?.course);
    if (req.user.role === "user") {
      await enrollmentOr403(req.user, course);
    }

    const question = String(
      req.body?.question ?? req.body?.content ?? req.body?.title ?? "",
    ).trim();
    if (!question) throw new ApiError(400, "Question text is required.");

    const created = await CourseQuestion.create({
      course: course._id,
      user: req.user._id,
      title: String(req.body?.title ?? "").slice(0, 200),
      question: question.slice(0, 5000),
    });

    res.status(201).json({ success: true, question: created });
  }),
);

router.put(
  "/add-answer",
  requireRole("admin", "instructor"),
  asyncHandler(async (req, res) => {
    const question = await CourseQuestion.findById(
      objectId(req.body?.questionId, "Question"),
    );
    if (!question) throw new ApiError(404, "Question not found.");

    const course = await loadCourse(question.course);
    if (!canManageCourse(course, req.user)) {
      throw new ApiError(403, "You do not have access to this course.");
    }

    const answer = String(req.body?.answer ?? req.body?.content ?? "").trim();
    if (!answer) throw new ApiError(400, "Answer text is required.");

    question.answers.push({ user: req.user._id, answer: answer.slice(0, 5000) });
    await question.save();

    res.json({ success: true, question });
  }),
);

router.put(
  "/add-replay",
  requireAuth,
  asyncHandler(async (req, res) => {
    const answerId = req.body?.answerId;
    if (!answerId) throw new ApiError(400, "Answer id is required.");

    const question = req.body?.questionId
      ? await CourseQuestion.findById(objectId(req.body.questionId, "Question"))
      : await CourseQuestion.findOne({ "answers._id": answerId });
    if (!question) throw new ApiError(404, "Question not found.");

    const answer = question.answers.id(answerId);
    if (!answer) throw new ApiError(404, "Answer not found.");

    if (req.user.role === "user") {
      const course = await loadCourse(question.course);
      await enrollmentOr403(req.user, course);
    }

    const reply = String(req.body?.reply ?? req.body?.content ?? "").trim();
    if (!reply) throw new ApiError(400, "Reply text is required.");

    answer.replies.push({ user: req.user._id, reply: reply.slice(0, 5000) });
    await question.save();

    res.json({ success: true, question });
  }),
);

export default router;
