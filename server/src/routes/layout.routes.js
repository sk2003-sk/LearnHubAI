import { Router } from "express";
import { Layout } from "../models/System.js";
import { requireRole } from "../middleware/auth.js";
import { ApiError, asyncHandler } from "../utils/http.js";

const router = Router();

const LAYOUT_TYPES = ["banner", "faq", "categories"];

function layoutPayload(body = {}) {
  const type = String(body.type ?? "").toLowerCase();
  if (!LAYOUT_TYPES.includes(type)) {
    throw new ApiError(400, "Layout type must be banner, faq or categories.");
  }

  const payload = { type };

  if (body.title !== undefined) payload.title = String(body.title ?? "");
  if (body.subTitle !== undefined) {
    payload.subTitle = String(body.subTitle ?? "");
  } else if (body.subtitle !== undefined) {
    payload.subTitle = String(body.subtitle ?? "");
  }
  if (body.image !== undefined) payload.image = String(body.image ?? "");

  if (body.faq !== undefined) {
    if (!Array.isArray(body.faq)) throw new ApiError(400, "faq must be an array.");
    payload.faq = body.faq.map((item) => ({
      question: String(item?.question ?? ""),
      answer: String(item?.answer ?? ""),
    }));
  }

  if (body.categories !== undefined) {
    if (!Array.isArray(body.categories)) {
      throw new ApiError(400, "categories must be an array.");
    }
    payload.categories = body.categories.map((item) => ({
      title: String(typeof item === "string" ? item : item?.title ?? ""),
    }));
  }

  return payload;
}

router.get(
  "/get-layout",
  asyncHandler(async (req, res) => {
    const type = String(req.query.type ?? "").toLowerCase();
    if (!type) {
      const layouts = await Layout.find().sort({ type: 1 });
      return res.json({ success: true, layouts });
    }
    if (!LAYOUT_TYPES.includes(type)) {
      throw new ApiError(400, "Layout type must be banner, faq or categories.");
    }

    const layout = await Layout.findOne({ type });
    res.json({ success: true, layout: layout || null });
  }),
);

router.post(
  "/create-layout",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const payload = layoutPayload(req.body);
    const layout = await Layout.findOneAndUpdate(
      { type: payload.type },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    res.status(201).json({ success: true, layout });
  }),
);

router.put(
  "/update-layout",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const payload = layoutPayload(req.body);
    const layout = await Layout.findOneAndUpdate(
      { type: payload.type },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    res.json({ success: true, message: "Layout updated.", layout });
  }),
);

export default router;
