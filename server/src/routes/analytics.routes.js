import { Router } from "express";
import User from "../models/User.js";
import { Course } from "../models/Course.js";
import { Order } from "../models/Commerce.js";
import { requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.use(requireRole("admin"));

function monthBuckets(count = 12) {
  const now = new Date();
  const buckets = [];
  for (let index = count - 1; index >= 0; index -= 1) {
    const start = new Date(now.getFullYear(), now.getMonth() - index, 1);
    buckets.push({
      label: `${start.toLocaleString("en-US", { month: "short" })} ${String(start.getFullYear()).slice(2)}`,
      year: start.getFullYear(),
      month: start.getMonth(),
      count: 0,
      revenue: 0,
      start,
    });
  }
  return buckets;
}

async function monthlySeries(Model, filter = {}, { revenue = false } = {}) {
  const buckets = monthBuckets();
  const docs = await Model.find({
    ...filter,
    createdAt: { $gte: buckets[0].start },
  })
    .select(revenue ? "createdAt amount" : "createdAt")
    .lean();

  for (const doc of docs) {
    const created = new Date(doc.createdAt);
    const bucket = buckets.find(
      (row) => row.year === created.getFullYear() && row.month === created.getMonth(),
    );
    if (!bucket) continue;
    bucket.count += 1;
    if (revenue) bucket.revenue += Number(doc.amount ?? 0);
  }

  return buckets.map((bucket) => ({
    month: bucket.label,
    count: bucket.count,
    ...(revenue ? { revenue: bucket.revenue } : {}),
  }));
}

router.get(
  "/get-users-analytics",
  asyncHandler(async (req, res) => {
    res.json({ success: true, users: await monthlySeries(User) });
  }),
);

router.get(
  "/get-course-analytics",
  asyncHandler(async (req, res) => {
    res.json({ success: true, courses: await monthlySeries(Course) });
  }),
);

router.get(
  "/get-order-analytics",
  asyncHandler(async (req, res) => {
    res.json({ success: true, orders: await monthlySeries(Order, {}, { revenue: true }) });
  }),
);

export default router;
