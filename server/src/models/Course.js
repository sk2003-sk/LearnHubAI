import mongoose from "mongoose";

export const COURSE_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "PUBLISHED",
  "UNPUBLISHED",
  "ARCHIVED",
];

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0, min: 0 },
    estimatedPrice: { type: Number, default: 0, min: 0 },
    thumbnail: { type: String, default: "" },
    tags: [{ type: String }],
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    benefits: [{ title: { type: String } }],
    prerequisites: [{ title: { type: String } }],
    demoUrl: { type: String, default: "" },
    category: { type: String, default: "" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    instructorName: { type: String, default: "" },
    status: { type: String, enum: COURSE_STATUSES, default: "PUBLISHED" },
    purchased: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

courseSchema.index({ status: 1, category: 1 });
courseSchema.index({ name: "text", description: "text", tags: "text" });

export const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

const sectionSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Section = mongoose.models.Section || mongoose.model("Section", sectionSchema);

const lectureSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    videoLength: { type: Number, default: 0, min: 0 },
    isPreview: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Lecture = mongoose.models.Lecture || mongoose.model("Lecture", lectureSchema);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
