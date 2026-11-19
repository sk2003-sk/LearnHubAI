import { COURSE_STATUSES, Course, Lecture, Section } from "../models/Course.js";
import {
  Certificate,
  Enrollment,
  LectureProgress,
  WishlistItem,
} from "../models/Learning.js";
import { Coupon, Order, Review } from "../models/Commerce.js";
import { ApiError } from "../utils/http.js";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export function thumbnailUrl(value) {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && typeof value.url === "string") {
    return value.url.trim();
  }
  return "";
}

export function parseTags(value) {
  const raw = Array.isArray(value) ? value : String(value ?? "").split(",");
  return raw
    .map((tag) => String(tag).trim())
    .filter(Boolean);
}

function titles(value) {
  const raw = Array.isArray(value)
    ? value
    : String(value ?? "").split("\n");
  return raw
    .map((item) =>
      typeof item === "string"
        ? item.trim()
        : String(item?.title ?? item?.name ?? "").trim(),
    )
    .filter(Boolean)
    .map((title) => ({ title }));
}

export function coursePayload(body = {}, { requireName = false } = {}) {
  const payload = {};

  if (body.name !== undefined || requireName) {
    const name = String(body.name ?? "").trim();
    if (!name) throw new ApiError(400, "Course name is required.");
    payload.name = name;
  }
  if (body.description !== undefined) {
    payload.description = String(body.description ?? "");
  }
  if (body.price !== undefined) {
    payload.price = Math.max(Number(body.price) || 0, 0);
  }
  if (body.estimatedPrice !== undefined) {
    payload.estimatedPrice = Math.max(Number(body.estimatedPrice) || 0, 0);
  }
  if (body.thumbnail !== undefined) {
    payload.thumbnail = thumbnailUrl(body.thumbnail);
  }
  if (body.tags !== undefined) {
    payload.tags = parseTags(body.tags);
  }
  if (body.level !== undefined) {
    if (!LEVELS.includes(body.level)) {
      throw new ApiError(400, "Level must be Beginner, Intermediate or Advanced.");
    }
    payload.level = body.level;
  }
  if (body.benefits !== undefined) {
    payload.benefits = titles(body.benefits);
  }
  if (body.prerequisites !== undefined) {
    payload.prerequisites = titles(body.prerequisites);
  }
  if (body.demoUrl !== undefined) {
    payload.demoUrl = String(body.demoUrl ?? "");
  }
  if (body.category !== undefined) {
    payload.category = String(body.category ?? "").trim();
  }
  if (body.categoryId !== undefined) {
    payload.categoryId = body.categoryId || null;
  }
  if (body.instructorName !== undefined) {
    payload.instructorName = String(body.instructorName ?? "").trim();
  }
  if (body.status !== undefined) {
    const status = String(body.status).toUpperCase();
    if (!COURSE_STATUSES.includes(status)) {
      throw new ApiError(400, "Invalid course status.");
    }
    payload.status = status;
  }

  return payload;
}

export function canManageCourse(course, user) {
  if (!user) return false;
  if (user.role === "admin") return true;
  return Boolean(course.instructor && String(course.instructor) === String(user._id));
}

export async function createCourseDoc({ body, user, status }) {
  const payload = coursePayload(body, { requireName: true });
  const course = await Course.create({
    ...payload,
    status: status || payload.status || (user.role === "admin" ? "PUBLISHED" : "DRAFT"),
    instructor: user._id,
    instructorName: payload.instructorName || user.name,
    purchased: 0,
    rating: 0,
    reviewCount: 0,
  });
  return course;
}

export async function updateCourseDoc(course, body) {
  const payload = coursePayload(body);
  Object.assign(course, payload);
  await course.save();
  return course;
}

export async function copyCourse(course, user) {
  const clone = await Course.create({
    name: `${course.name} (Copy)`,
    description: course.description,
    price: course.price,
    estimatedPrice: course.estimatedPrice,
    thumbnail: course.thumbnail,
    tags: course.tags,
    level: course.level,
    benefits: course.benefits,
    prerequisites: course.prerequisites,
    demoUrl: course.demoUrl,
    category: course.category,
    categoryId: course.categoryId,
    instructor: user._id,
    instructorName: user.name,
    status: "DRAFT",
    purchased: 0,
    rating: 0,
    reviewCount: 0,
  });

  const [sections, lectures] = await Promise.all([
    Section.find({ courseId: course._id }).sort({ order: 1, createdAt: 1 }),
    Lecture.find({ courseId: course._id }).sort({ order: 1, createdAt: 1 }),
  ]);

  const sectionMap = new Map();
  for (const section of sections) {
    const created = await Section.create({
      courseId: clone._id,
      title: section.title,
      order: section.order,
    });
    sectionMap.set(String(section._id), created._id);
  }

  for (const lecture of lectures) {
    await Lecture.create({
      courseId: clone._id,
      sectionId: sectionMap.get(String(lecture.sectionId)),
      title: lecture.title,
      description: lecture.description,
      videoUrl: lecture.videoUrl,
      videoLength: lecture.videoLength,
      isPreview: lecture.isPreview,
      order: lecture.order,
    });
  }

  return clone;
}

export async function deleteCourseCascade(courseId) {
  await Promise.all([
    Section.deleteMany({ courseId }),
    Lecture.deleteMany({ courseId }),
    Enrollment.deleteMany({ course: courseId }),
    LectureProgress.deleteMany({ course: courseId }),
    WishlistItem.deleteMany({ course: courseId }),
    Certificate.deleteMany({ course: courseId }),
    Review.deleteMany({ course: courseId }),
    Order.deleteMany({ course: courseId }),
  ]);
  await Coupon.updateMany({ courses: courseId }, { $pull: { courses: courseId } });
  await Course.findByIdAndDelete(courseId);
}
