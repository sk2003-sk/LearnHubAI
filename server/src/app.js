import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config.js";
import authRoutes from "./routes/auth.routes.js";
import lmsRoutes from "./routes/lms.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import legacyCourseRoutes from "./routes/legacyCourse.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import layoutRoutes from "./routes/layout.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import orderRoutes from "./routes/order.routes.js";
import systemRoutes from "./routes/system.routes.js";
import { errorHandler, notFound } from "./middleware/error.js";

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

const localhostOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
const vercelOrigin = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (config.clientOrigins.includes(origin)) return callback(null, true);
      if (!config.isProduction && localhostOrigin.test(origin)) return callback(null, true);
      if (vercelOrigin.test(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "6mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/lms/instructor", instructorRoutes);
app.use("/api/v1/lms/admin", adminRoutes);
app.use("/api/v1/lms", lmsRoutes);
app.use("/api/v1/course", legacyCourseRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/layout", layoutRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1", systemRoutes);
app.use("/", systemRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
