import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    isCompleted: { type: Boolean, default: false },
    completedLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
    lastLectureId: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
  },
  { timestamps: true },
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const Enrollment =
  mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);

const lectureProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    lecture: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture", required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    watchedSeconds: { type: Number, default: 0, min: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

lectureProgressSchema.index({ user: 1, lecture: 1 }, { unique: true });

export const LectureProgress =
  mongoose.models.LectureProgress ||
  mongoose.model("LectureProgress", lectureProgressSchema);

const wishlistItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true },
);

wishlistItemSchema.index({ user: 1, course: 1 }, { unique: true });

export const WishlistItem =
  mongoose.models.WishlistItem ||
  mongoose.model("WishlistItem", wishlistItemSchema);

const certificateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    certificateId: { type: String, required: true, unique: true },
    studentName: { type: String, default: "" },
    courseName: { type: String, default: "" },
  },
  { timestamps: true },
);

certificateSchema.index({ user: 1, course: 1 }, { unique: true });

export const Certificate =
  mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);
