import mongoose from "mongoose";

const layoutSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      enum: ["banner", "faq", "categories"],
      index: true,
    },
    title: { type: String, default: "" },
    subTitle: { type: String, default: "" },
    image: { type: String, default: "" },
    faq: [{ question: { type: String, default: "" }, answer: { type: String, default: "" } }],
    categories: [{ title: { type: String, default: "" } }],
  },
  { timestamps: true },
);

export const Layout = mongoose.models.Layout || mongoose.model("Layout", layoutSchema);

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, default: "" },
    status: { type: String, enum: ["unread", "read"], default: "unread", index: true },
    kind: { type: String, default: "system" },
  },
  { timestamps: true },
);

notificationSchema.index({ createdAt: -1 });

export const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reply: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const answerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answer: { type: String, required: true, trim: true },
    replies: { type: [replySchema], default: [] },
  },
  { timestamps: true },
);

const questionSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "" },
    question: { type: String, required: true, trim: true },
    answers: { type: [answerSchema], default: [] },
  },
  { timestamps: true },
);

export const CourseQuestion =
  mongoose.models.CourseQuestion || mongoose.model("CourseQuestion", questionSchema);
