import { Router } from "express";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import { Category, Course, Lecture, Section } from "../models/Course.js";
import {
  Certificate,
  Enrollment,
  LectureProgress,
  WishlistItem,
} from "../models/Learning.js";
import { Coupon, Order, Review } from "../models/Commerce.js";
import { optionalAuth, requireAuth, requireRole } from "../middleware/auth.js";
import { ApiError, asyncHandler, parseIntParam } from "../utils/http.js";
import {
  certificateJSON,
  courseJSON,
  enrollmentJSON,
  lectureJSON,
  orderJSON,
  reviewJSON,
  sectionJSON,
} from "../utils/serializers.js";
import { hasCourseAccess, recalculateProgress } from "../services/learning.js";
import {
  completePurchase,
  findValidCoupon,
  quoteForCourse,
  saveCourseReview,
} from "../services/commerce.js";
import { canManageCourse, copyCourse } from "../services/courses.js";
import { randomToken } from "../utils/tokens.js";

const router = Router();

function objectId(value, label = "Resource") {
  if (!mongoose.isValidObjectId(value)) throw new ApiError(404, `${label} not found.`);
  return value;
}

async function loadCourse(courseId) {
  const course = await Course.findById(objectId(courseId, "Course"));
  if (!course) throw new ApiError(404, "Course not found.");
  return course;
}

async function loadSection(sectionId) {
  const section = await Section.findById(objectId(sectionId, "Section"));
  if (!section) throw new ApiError(404, "Section not found.");
  return section;
}

async function loadLecture(lectureId) {
  const lecture = await Lecture.findById(objectId(lectureId, "Lecture"));
  if (!lecture) throw new ApiError(404, "Lecture not found.");
  return lecture;
}

async function sectionsWithLectures(courseId) {
  const [sections, lectures] = await Promise.all([
    Section.find({ courseId }).sort({ order: 1, createdAt: 1 }),
    Lecture.find({ courseId }).sort({ order: 1, createdAt: 1 }),
  ]);
  const grouped = new Map(
    sections.map((section) => [String(section._id), []]),
  );
  for (const lecture of lectures) {
    grouped.get(String(lecture.sectionId))?.push(lecture);
  }
  return sections.map((section) =>
    sectionJSON(section, grouped.get(String(section._id)) || []),
  );
}

async function enrollmentOr403(user, course) {
  const enrollment = await Enrollment.findOne({ user: user._id, course: course._id });
  if (!enrollment) {
    throw new ApiError(403, "Enroll in this course to access its lessons.");
  }
  return enrollment;
}

async function wishlistCourses(userId) {
  const items = await WishlistItem.find({ user: userId }).populate("course");
  return items.map((item) => courseJSON(item.course)).filter(Boolean);
}

router.get(
  "/home",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const [popular, newest, categories] = await Promise.all([
      Course.find({ status: "PUBLISHED" }).sort({ purchased: -1 }).limit(6),
      Course.find({ status: "PUBLISHED" }).sort({ createdAt: -1 }).limit(6),
      Category.find().sort({ name: 1 }),
    ]);

    res.json({
      success: true,
      categories: categories.map((category) => ({
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      })),
      popularCourses: popular.map(courseJSON),
      featuredCourses: newest.map(courseJSON),
      newCourses: newest.map(courseJSON),
    });
  }),
);

router.get(
  "/courses",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const limit = parseIntParam(req.query.limit, 12);
    const page = Math.max(parseIntParam(req.query.page, 1) - 1, 0);
    const filter = { status: "PUBLISHED" };

    if (req.query.category) filter.category = String(req.query.category);
    if (req.query.level) filter.level = String(req.query.level);
    if (req.query.q) filter.$text = { $search: String(req.query.q) };

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort({ purchased: -1, createdAt: -1 })
        .skip(page * limit)
        .limit(limit),
      Course.countDocuments(filter),
    ]);

    res.json({
      success: true,
      courses: courses.map(courseJSON),
      total,
      page: page + 1,
      limit,
    });
  }),
);

router.get(
  "/search",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const query = String(req.query.q || "").trim();
    if (!query) {
      return res.json({ success: true, courses: [], total: 0, query });
    }

    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const courses = await Course.find({
      status: "PUBLISHED",
      $or: [{ name: regex }, { description: regex }, { tags: regex }, { category: regex }],
    })
      .sort({ purchased: -1 })
      .limit(50);

    res.json({ success: true, courses: courses.map(courseJSON), total: courses.length, query });
  }),
);

router.get(
  "/categories",
  asyncHandler(async (req, res) => {
    const [categories, grouped] = await Promise.all([
      Category.find().sort({ name: 1 }),
      Course.aggregate([
        { $match: { status: "PUBLISHED", category: { $ne: "" } } },
        { $group: { _id: "$category", courseCount: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const catalog = categories.map((category) => ({
      _id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      courseCount: grouped.find((row) => row._id === category.name)?.courseCount || 0,
    }));

    for (const row of grouped) {
      if (!catalog.some((category) => category.name === row._id)) {
        catalog.push({
          _id: row._id,
          name: row._id,
          slug: row._id.toLowerCase().replace(/\s+/g, "-"),
          description: "",
          courseCount: row.courseCount,
        });
      }
    }

    res.json({ success: true, categories: catalog });
  }),
);

router.get(
  "/categories/all",
  asyncHandler(async (req, res) => {
    const [categories, grouped] = await Promise.all([
      Category.find().sort({ name: 1 }),
      Course.aggregate([
        { $match: { category: { $ne: "" } } },
        { $group: { _id: "$category", courseCount: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      success: true,
      categories: categories.map((category) => ({
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        courseCount:
          grouped.find((row) => row._id === category.name)?.courseCount || 0,
        isActive: true,
      })),
    });
  }),
);

router.post(
  "/categories",
  requireRole("admin", "instructor"),
  asyncHandler(async (req, res) => {
    const name = String(req.body?.name || "").trim();
    if (!name) throw new ApiError(400, "Category name is required.");

    const category = await Category.create({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      description: String(req.body?.description || ""),
    });

    res.status(201).json({ success: true, category });
  }),
);

router.put(
  "/categories/:categoryId",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const category = await Category.findById(
      objectId(req.params.categoryId, "Category"),
    );
    if (!category) throw new ApiError(404, "Category not found.");

    const name = String(req.body?.name ?? category.name).trim();
    if (!name) throw new ApiError(400, "Category name is required.");

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const conflict = await Category.findOne({ _id: { $ne: category._id }, slug });
    if (conflict) throw new ApiError(409, "A category with that name already exists.");

    category.name = name;
    category.slug = slug;
    if (req.body?.description !== undefined) {
      category.description = String(req.body.description ?? "");
    }
    await category.save();

    res.json({ success: true, message: "Category updated.", category });
  }),
);

router.delete(
  "/categories/:categoryId",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(
      objectId(req.params.categoryId, "Category"),
    );
    if (!category) throw new ApiError(404, "Category not found.");

    await Course.updateMany(
      { categoryId: category._id },
      { $unset: { categoryId: 1 } },
    );

    res.json({ success: true, message: "Category deleted." });
  }),
);

router.post(
  "/courses/clone",
  requireRole("admin", "instructor"),
  asyncHandler(async (req, res) => {
    const course = await loadCourse(req.body?.courseId);
    if (!canManageCourse(course, req.user)) {
      throw new ApiError(403, "You do not have access to this course.");
    }
    const clone = await copyCourse(course, req.user);
    res.status(201).json({
      success: true,
      message: "Course cloned as a draft.",
      course: courseJSON(clone),
    });
  }),
);

router.get(
  "/courses/:courseId",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const course = await loadCourse(req.params.courseId);
    const canView =
      course.status === "PUBLISHED" || (await hasCourseAccess(req.user, course));
    if (!canView) throw new ApiError(404, "Course not found.");

    res.json({ success: true, course: courseJSON(course) });
  }),
);

function hideLockedVideos(sections) {
  return sections.map((section) => ({
    ...section,
    lectures: (section.lectures || []).map((lecture) =>
      lecture.isPreview ? lecture : { ...lecture, videoUrl: "", video: "" },
    ),
  }));
}

async function curriculumFor(req) {
  const course = await loadCourse(req.params.courseId);
  const access = await hasCourseAccess(req.user, course);
  if (course.status !== "PUBLISHED" && !access) {
    throw new ApiError(404, "Course not found.");
  }
  const sections = await sectionsWithLectures(course._id);
  return { course, access, sections: access ? sections : hideLockedVideos(sections) };
}

router.get(
  "/courses/:courseId/curriculum",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { course, access, sections } = await curriculumFor(req);
    res.json({
      success: true,
      curriculum: sections,
      course: courseJSON(course),
      hasAccess: access,
    });
  }),
);

router.get(
  "/courses/:courseId/sections",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { access, sections } = await curriculumFor(req);
    res.json({ success: true, sections, hasAccess: access });
  }),
);

const listCourseReviews = asyncHandler(async (req, res) => {
  const course = await loadCourse(req.params.courseId);
  const reviews = await Review.find({ course: course._id })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 });
  res.json({
    success: true,
    reviews: reviews.map(reviewJSON),
    total: reviews.length,
    averageRating: course.rating,
  });
});

router.get("/courses/:courseId/reviews", listCourseReviews);
router.get("/reviews/:courseId", listCourseReviews);

router.get(
  "/sections/:sectionId",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const section = await loadSection(req.params.sectionId);
    const lectures = await Lecture.find({ sectionId: section._id }).sort({
      order: 1,
      createdAt: 1,
    });
    res.json({ success: true, section: sectionJSON(section, lectures) });
  }),
);

router.get(
  "/sections/:sectionId/lectures",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const section = await loadSection(req.params.sectionId);
    const lectures = await Lecture.find({ sectionId: section._id }).sort({
      order: 1,
      createdAt: 1,
    });
    res.json({ success: true, lectures: lectures.map((lecture) => lectureJSON(lecture)) });
  }),
);

router.get(
  "/lectures/:lectureId",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const lecture = await loadLecture(req.params.lectureId);
    const course = await Course.findById(lecture.courseId);
    const access = lecture.isPreview || (await hasCourseAccess(req.user, course));
    const payload = lectureJSON(lecture);
    if (!access) payload.videoUrl = "";
    res.json({ success: true, lecture: payload, hasAccess: access });
  }),
);

router.get(
  "/lectures/:lectureId/access",
  requireAuth,
  asyncHandler(async (req, res) => {
    const lecture = await loadLecture(req.params.lectureId);
    const course = await Course.findById(lecture.courseId);
    const hasAccess = lecture.isPreview || (await hasCourseAccess(req.user, course));
    res.json({ success: true, hasAccess });
  }),
);

router.get(
  "/wishlist",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ success: true, wishlist: await wishlistCourses(req.user._id) });
  }),
);

const toggleWishlist = asyncHandler(async (req, res) => {
  const course = await loadCourse(req.body?.courseId);
  const existing = await WishlistItem.findOne({ user: req.user._id, course: course._id });

  if (existing) {
    await existing.deleteOne();
  } else {
    await WishlistItem.create({ user: req.user._id, course: course._id });
  }

  res.json({
    success: true,
    saved: !existing,
    wishlist: await wishlistCourses(req.user._id),
  });
});

router.post("/wishlist", requireAuth, toggleWishlist);
router.post("/wishlist/toggle", requireAuth, toggleWishlist);

router.get(
  "/my-learning",
  requireAuth,
  asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate("course")
      .sort({ updatedAt: -1 });

    const records = enrollments
      .filter((enrollment) => enrollment.course)
      .map((enrollment) => enrollmentJSON(enrollment));

    res.json({
      success: true,
      continueLearning: records.filter(
        (record) => !record.completed && record.progress > 0,
      ),
      inProgress: records.filter((record) => !record.completed && record.progress === 0),
      completed: records.filter((record) => record.completed),
    });
  }),
);

router.post(
  "/lectures/:lectureId/progress",
  requireAuth,
  asyncHandler(async (req, res) => {
    const lecture = await loadLecture(req.params.lectureId);
    const course = await loadCourse(lecture.courseId);
    const enrollment = await enrollmentOr403(req.user, course);

    const watchedSeconds = Math.max(Number(req.body?.watchedSeconds) || 0, 0);

    await LectureProgress.findOneAndUpdate(
      { user: req.user._id, lecture: lecture._id },
      { $max: { watchedSeconds }, $setOnInsert: { course: course._id, completed: false } },
      { upsert: true, new: true },
    );

    const videoSeconds = Number(lecture.videoLength || 0) * 60;
    if (videoSeconds > 0) {
      const watchedPercent = Math.min(
        Math.floor((watchedSeconds / videoSeconds) * 100),
        99,
      );
      if (watchedPercent > enrollment.progress) {
        enrollment.progress = watchedPercent;
        enrollment.lastLectureId = lecture._id;
        await enrollment.save();
      }
    }

    res.json({ success: true, progress: enrollment.progress });
  }),
);

router.post(
  "/lectures/:lectureId/complete",
  requireAuth,
  asyncHandler(async (req, res) => {
    const lecture = await loadLecture(req.params.lectureId);
    const course = await loadCourse(lecture.courseId);
    const enrollment = await enrollmentOr403(req.user, course);

    await LectureProgress.findOneAndUpdate(
      { user: req.user._id, lecture: lecture._id },
      {
        $set: { completed: true, course: course._id },
        $setOnInsert: { watchedSeconds: 0 },
      },
      { upsert: true, new: true },
    );

    if (!enrollment.completedLectures.some((id) => String(id) === String(lecture._id))) {
      enrollment.completedLectures.push(lecture._id);
      enrollment.lastLectureId = lecture._id;
      await enrollment.save();
    }

    const result = await recalculateProgress(req.user._id, course._id);

    res.json({
      success: true,
      progress: result?.enrollment.progress ?? enrollment.progress,
      completed: Boolean(result?.enrollment.isCompleted),
      certificate: result?.certificate ? certificateJSON(result.certificate) : null,
    });
  }),
);

router.get(
  "/purchases",
  requireAuth,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id, status: "paid" })
      .populate("course")
      .sort({ createdAt: -1 });
    res.json({ success: true, purchases: orders.map(orderJSON) });
  }),
);

router.get(
  "/orders",
  requireAuth,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
      .populate("course")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders: orders.map(orderJSON) });
  }),
);

router.get(
  "/orders/:orderId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(objectId(req.params.orderId, "Order")).populate(
      "course",
    );
    if (!order) throw new ApiError(404, "Order not found.");
    if (String(order.user) !== String(req.user._id) && req.user.role !== "admin") {
      throw new ApiError(403, "You do not have access to this order.");
    }
    res.json({ success: true, order: orderJSON(order) });
  }),
);

router.get(
  "/enrollments",
  requireAuth,
  asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate("course")
      .sort({ createdAt: -1 });
    res.json({ success: true, enrollments: enrollments.map(enrollmentJSON) });
  }),
);

router.get(
  "/enrollments/:enrollmentId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const enrollment = await Enrollment.findById(
      objectId(req.params.enrollmentId, "Enrollment"),
    ).populate("course");
    if (!enrollment) throw new ApiError(404, "Enrollment not found.");
    if (String(enrollment.user) !== String(req.user._id) && req.user.role !== "admin") {
      throw new ApiError(403, "You do not have access to this enrollment.");
    }
    res.json({ success: true, enrollment: enrollmentJSON(enrollment) });
  }),
);

router.post(
  "/reviews/:courseId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const course = await loadCourse(req.params.courseId);
    const enrollment = await Enrollment.exists({
      user: req.user._id,
      course: course._id,
    });
    if (!enrollment && req.user.role === "user") {
      throw new ApiError(403, "You can review a course after enrolling in it.");
    }

    const rating = Number(req.body?.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5.");
    }

    const review = await saveCourseReview({
      user: req.user,
      course,
      rating,
      comment: String(req.body?.comment ?? req.body?.review ?? "").slice(0, 2000),
    });

    res.status(201).json({ success: true, review: reviewJSON(review), message: "Review saved." });
  }),
);

router.post(
  "/coupons/validate",
  requireAuth,
  asyncHandler(async (req, res) => {
    const course = await loadCourse(req.body?.courseId);
    const coupon = await findValidCoupon({
      code: req.body?.code,
      courseId: course._id,
    });
    if (!coupon) throw new ApiError(400, "Enter a coupon code.");

    const { price, discount, payable } = quoteForCourse(course, coupon);

    res.json({
      success: true,
      valid: true,
      code: coupon.code,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      originalAmount: price,
      payable,
      message: `Coupon applied: ${coupon.discountType === "fixed" ? `₹${coupon.discountValue} off` : `${coupon.discountValue}% off`}.`,
    });
  }),
);

router.get(
  "/coupons",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      coupons: coupons.map((coupon) => ({
        ...coupon.toObject(),
        minPurchaseAmount: Number(coupon.minAmount ?? 0),
        maxDiscount: Number(coupon.maxDiscount ?? 0),
        endDate: coupon.expiresAt || null,
        usageLimit: Number(coupon.maxUses ?? 0),
        courseId: coupon.courses?.[0] || "",
      })),
    });
  }),
);

router.post(
  "/coupons",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const code = String(req.body?.code || "").trim().toUpperCase();
    if (!code) throw new ApiError(400, "Coupon code is required.");

    const discountValue = Number(req.body?.discountValue ?? 0);
    if (!(discountValue > 0)) {
      throw new ApiError(400, "Discount value must be greater than zero.");
    }

    const expiresAt = req.body?.expiresAt ?? req.body?.endDate;
    const courses = Array.isArray(req.body?.courses)
      ? req.body.courses
      : req.body?.courseId
        ? [req.body.courseId]
        : [];

    const coupon = await Coupon.create({
      code,
      discountType: req.body?.discountType === "fixed" ? "fixed" : "percentage",
      discountValue,
      maxDiscount: Math.max(Number(req.body?.maxDiscount ?? 0), 0),
      minAmount: Math.max(
        Number(req.body?.minAmount ?? req.body?.minPurchaseAmount ?? 0),
        0,
      ),
      maxUses: Math.max(
        Number(req.body?.maxUses ?? req.body?.usageLimit ?? 0),
        0,
      ),
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      courses,
    });

    res.status(201).json({ success: true, coupon });
  }),
);

router.get(
  "/certificates",
  requireAuth,
  asyncHandler(async (req, res) => {
    const certificates = await Certificate.find({ user: req.user._id })
      .populate("course")
      .sort({ createdAt: -1 });
    res.json({ success: true, certificates: certificates.map(certificateJSON) });
  }),
);

async function findCertificate(req) {
  const value = req.params.certificateId;
  const query = mongoose.isValidObjectId(value)
    ? { $or: [{ _id: value }, { certificateId: value }] }
    : { certificateId: value };

  const certificate = await Certificate.findOne(query).populate("course");
  if (!certificate) throw new ApiError(404, "Certificate not found.");
  if (
    String(certificate.user) !== String(req.user._id) &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You do not have access to this certificate.");
  }
  return certificate;
}

router.get(
  "/certificates/:certificateId/download",
  requireAuth,
  asyncHandler(async (req, res) => {
    const certificate = await findCertificate(req);
    const data = certificateJSON(certificate);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="learnhub-certificate-${certificate.certificateId}.pdf"`,
    );

    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });
    doc.pipe(res);

    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).stroke("#1D4B3C");
    doc.moveDown(4);
    doc.font("Helvetica-Bold").fontSize(30).fillColor("#1D4B3C").text("Certificate of Completion", { align: "center" });
    doc.moveDown(1.5);
    doc.font("Helvetica").fontSize(14).fillColor("#333333").text("This certifies that", { align: "center" });
    doc.moveDown(0.8);
    doc.font("Helvetica-Bold").fontSize(26).fillColor("#14211C").text(data.studentName || "Learner", { align: "center" });
    doc.moveDown(0.8);
    doc.font("Helvetica").fontSize(14).fillColor("#333333").text("has successfully completed", { align: "center" });
    doc.moveDown(0.6);
    doc.font("Helvetica-Bold").fontSize(20).fillColor("#1D4B3C").text(data.courseName, { align: "center" });
    doc.moveDown(2);
    doc.font("Helvetica").fontSize(12).fillColor("#555555").text(
      `Issued on ${new Date(data.issuedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      { align: "center" },
    );
    doc.moveDown(0.4);
    doc.fontSize(10).text(`Certificate ID: ${data.certificateId}`, { align: "center" });
    doc.end();
  }),
);

router.get(
  "/certificates/:certificateId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const certificate = await findCertificate(req);
    res.json({ success: true, certificate: certificateJSON(certificate) });
  }),
);

router.get(
  "/progress-analytics",
  requireAuth,
  asyncHandler(async (req, res) => {
    const [enrollments, lectureCounts] = await Promise.all([
      Enrollment.find({ user: req.user._id }).populate("course"),
      Lecture.aggregate([{ $group: { _id: "$courseId", total: { $sum: 1 } } }]),
    ]);

    const courses = enrollments
      .filter((enrollment) => enrollment.course)
      .map((enrollment) => {
        const totalLectures =
          lectureCounts.find(
            (row) => String(row._id) === String(enrollment.course._id),
          )?.total || 0;
        const completedLectures = enrollment.completedLectures?.length || 0;
        return {
          _id: enrollment._id,
          courseId: enrollment.course._id,
          courseName: enrollment.course.name,
          course: { _id: enrollment.course._id, name: enrollment.course.name },
          progress: Number(enrollment.progress || 0),
          completed: Boolean(enrollment.isCompleted),
          completedLectures,
          totalLectures,
          lastActivity: enrollment.updatedAt,
        };
      });

    res.json({ success: true, courses });
  }),
);

router.post(
  "/payments/create",
  requireAuth,
  asyncHandler(async (req, res) => {
    const course = await loadCourse(req.body?.courseId);

    const existing = await Enrollment.exists({
      user: req.user._id,
      course: course._id,
    });
    if (existing) throw new ApiError(409, "You are already enrolled in this course.");

    const coupon = await findValidCoupon({
      code: req.body?.couponCode,
      courseId: course._id,
    });
    const { price, discount, payable } = quoteForCourse(course, coupon);

    const paymentIntentId = `mock_pi_${randomToken(8)}`;
    const clientSecret = `${paymentIntentId}_secret_${randomToken(8)}`;

    res.json({
      success: true,
      mode: "mock",
      clientSecret,
      paymentIntentId,
      amount: payable,
      originalAmount: price,
      discount,
      couponCode: coupon?.code || "",
      currency: "INR",
    });
  }),
);

router.post(
  "/payments/verify",
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = await completePurchase({
      user: req.user,
      courseId: req.body?.courseId,
      couponCode: req.body?.couponCode,
      paymentInfo: {
        id: req.body?.paymentIntentId || "",
        status: "succeeded",
      },
    });

    res.json({
      success: true,
      message: result.alreadyEnrolled
        ? "You are already enrolled."
        : "Payment verified and enrollment confirmed.",
      order: result.order ? orderJSON(result.order) : null,
      enrollment: result.enrollment ? enrollmentJSON(result.enrollment) : null,
    });
  }),
);

router.post("/payments/webhook", (req, res) => {
  res.json({ received: true, mode: "mock" });
});

router.post(
  "/payments/refund",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const order = await Order.findById(objectId(req.body?.orderId, "Order"));
    if (!order) throw new ApiError(404, "Order not found.");
    if (order.status !== "paid") throw new ApiError(400, "Only paid orders can be refunded.");

    order.status = "refunded";
    await order.save();

    await Promise.all([
      Enrollment.deleteMany({ user: order.user, course: order.course }),
      LectureProgress.deleteMany({ user: order.user, course: order.course }),
      Certificate.deleteMany({ user: order.user, course: order.course }),
    ]);

    res.json({ success: true, message: "Order refunded and enrollment removed.", order: orderJSON(order) });
  }),
);

export default router;
