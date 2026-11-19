import { Router } from "express";
import { Order } from "../models/Commerce.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { ApiError, asyncHandler } from "../utils/http.js";
import { enrollmentJSON, orderJSON } from "../utils/serializers.js";
import { completePurchase } from "../services/commerce.js";

const router = Router();

const PAID_STATUSES = new Set(["succeeded", "paid", "complete", "completed"]);

router.post(
  "/create-order",
  requireAuth,
  asyncHandler(async (req, res) => {
    const status = String(req.body?.payment_info?.status || "").toLowerCase();
    if (!PAID_STATUSES.has(status)) {
      throw new ApiError(400, "Payment was not completed.");
    }

    const result = await completePurchase({
      user: req.user,
      courseId: req.body?.courseId,
      couponCode: req.body?.couponCode,
      paymentInfo: req.body?.payment_info,
    });

    res.status(result.alreadyEnrolled ? 200 : 201).json({
      success: true,
      message: result.alreadyEnrolled
        ? "You are already enrolled in this course."
        : "Payment successful. You are now enrolled.",
      order: result.order ? orderJSON(result.order) : null,
      enrollment: result.enrollment ? enrollmentJSON(result.enrollment) : null,
    });
  }),
);

router.get(
  "/get-all-order-dashboard",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const orders = await Order.find().populate("course").sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, orders: orders.map(orderJSON), total: orders.length });
  }),
);

export default router;
