import crypto from "node:crypto";
import { Course, Lecture } from "../models/Course.js";
import { Certificate, Enrollment } from "../models/Learning.js";
import User from "../models/User.js";

export async function recalculateProgress(userId, courseId) {
  const [totalLectures, enrollment] = await Promise.all([
    Lecture.countDocuments({ courseId }),
    Enrollment.findOne({ user: userId, course: courseId }),
  ]);

  if (!enrollment) return null;

  const completed = enrollment.completedLectures?.length || 0;
  const progress = totalLectures === 0 ? 0 : Math.round((completed / totalLectures) * 100);
  enrollment.progress = Math.min(progress, 100);
  enrollment.isCompleted = totalLectures > 0 && completed >= totalLectures;
  await enrollment.save();

  let certificate = null;
  if (enrollment.isCompleted) {
    certificate = await issueCertificate(userId, courseId);
  }

  return { enrollment, certificate, totalLectures, completedLectures: completed };
}

export async function issueCertificate(userId, courseId) {
  const existing = await Certificate.findOne({ user: userId, course: courseId }).populate(
    "course",
  );
  if (existing) return existing;

  const [course, enrollment, user] = await Promise.all([
    Course.findById(courseId),
    Enrollment.findOne({ user: userId, course: courseId }),
    User.findById(userId),
  ]);
  if (!course || !enrollment) return null;

  const certificateId = `LH-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

  try {
    return await Certificate.create({
      user: userId,
      course: courseId,
      certificateId,
      studentName: user?.name || "",
      courseName: course.name,
    });
  } catch {
    return Certificate.findOne({ user: userId, course: courseId });
  }
}

export async function hasCourseAccess(user, course) {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (
    user.role === "instructor" &&
    course.instructor &&
    String(course.instructor) === String(user._id)
  ) {
    return true;
  }
  const enrollment = await Enrollment.exists({ user: user._id, course: course._id });
  return Boolean(enrollment);
}
