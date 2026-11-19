import { Router } from "express";
import mongoose from "mongoose";
import { Notification } from "../models/System.js";
import { optionalAuth } from "../middleware/auth.js";
import { ApiError, asyncHandler, parseIntParam } from "../utils/http.js";

const router = Router();

router.get(
  "/get-all-notification",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const limit = parseIntParam(req.query.limit, 100);
    const filter =
      req.user?.role === "admin"
        ? {}
        : {
            $or: [
              { user: null },
              ...(req.user ? [{ user: req.user._id }] : []),
            ],
          };

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ success: true, notifications, total: notifications.length });
  }),
);

router.put(
  "/update-notification-status/:id",
  optionalAuth,
  asyncHandler(async (req, res) => {
    if (!req.user) throw new ApiError(401, "Authentication required.");
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(404, "Notification not found.");
    }

    const notification = await Notification.findById(req.params.id);
    if (!notification) throw new ApiError(404, "Notification not found.");
    if (
      req.user.role !== "admin" &&
      notification.user &&
      String(notification.user) !== String(req.user._id)
    ) {
      throw new ApiError(403, "You do not have access to this notification.");
    }

    notification.status = "read";
    await notification.save();

    res.json({ success: true, message: "Notification marked as read.", notification });
  }),
);

export default router;
