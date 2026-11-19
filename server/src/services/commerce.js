import { Coupon, Order, Review } from "../models/Commerce.js";
import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Learning.js";
import { ApiError } from "../utils/http.js";

export function priceCoupon(coupon, price) {
  if (!coupon) return { discount: 0, payable: price };
  let discount =
    coupon.discountType === "fixed"
      ? coupon.discountValue
      : Math.round((price * coupon.discountValue) / 100);
  if (coupon.maxDiscount > 0) {
    discount = Math.min(discount, coupon.maxDiscount);
  }
  const bounded = Math.min(Math.max(discount, 0), price);
  return {
    discount: bounded,
    payable: Math.max(price - bounded, 0),
  };
}

export async function saveCourseReview({ user, course, rating, comment }) {
  const review = await Review.findOneAndUpdate(
    { user: user._id, course: course._id },
    { $set: { rating, comment } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).populate("user", "name avatar");

  const stats = await Review.aggregate([
    { $match: { course: course._id } },
    { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  course.rating = Number((stats[0]?.average || 0).toFixed(1));
  course.reviewCount = stats[0]?.count || 0;
  await course.save();

  return review;
}

export async function findValidCoupon({ code, courseId }) {
  if (!code) return null;

  const coupon = await Coupon.findOne({ code: String(code).toUpperCase().trim() });
  if (!coupon || !coupon.active) {
    throw new ApiError(400, "That coupon is invalid or has expired.");
  }
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    throw new ApiError(400, "That coupon has expired.");
  }
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    throw new ApiError(400, "That coupon has reached its usage limit.");
  }
  if (coupon.courses?.length && !coupon.courses.some((id) => String(id) === String(courseId))) {
    throw new ApiError(400, "That coupon does not apply to this course.");
  }

  return coupon;
}

export function quoteForCourse(course, coupon) {
  const price = Number(course.price ?? 0);
  if (coupon && price < Number(coupon.minAmount ?? 0)) {
    throw new ApiError(400, "The course total does not meet this coupon's minimum.");
  }
  return { price, ...priceCoupon(coupon, price) };
}

export async function getCourseForPurchase(courseId) {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found.");
  if (course.status && course.status !== "PUBLISHED") {
    throw new ApiError(404, "This course is not available for purchase.");
  }
  return course;
}

export async function completePurchase({ user, courseId, paymentInfo, couponCode }) {
  const course = await getCourseForPurchase(courseId);

  const existingEnrollment = await Enrollment.findOne({
    user: user._id,
    course: course._id,
  }).populate("course");

  if (existingEnrollment) {
    const order = await Order.findOne({ user: user._id, course: course._id }).populate(
      "course",
    );
    return { course, enrollment: existingEnrollment, order, alreadyEnrolled: true };
  }

  const coupon = await findValidCoupon({ code: couponCode, courseId: course._id });
  const { payable } = quoteForCourse(course, coupon);

  const order = await Order.create({
    user: user._id,
    course: course._id,
    amount: payable,
    couponCode: coupon?.code || "",
    status: "paid",
    paymentInfo: {
      id: paymentInfo?.id || "",
      status: paymentInfo?.status || "succeeded",
    },
  });

  if (coupon) {
    coupon.usedCount += 1;
    await coupon.save();
  }

  const enrollment = await Enrollment.create({
    user: user._id,
    course: course._id,
    progress: 0,
    isCompleted: false,
    completedLectures: [],
  });

  await Course.updateOne({ _id: course._id }, { $inc: { purchased: 1 } });

  const populatedOrder = await Order.findById(order._id).populate("course");
  const populatedEnrollment = await Enrollment.findById(enrollment._id).populate("course");

  return {
    course,
    enrollment: populatedEnrollment,
    order: populatedOrder,
    alreadyEnrolled: false,
  };
}
