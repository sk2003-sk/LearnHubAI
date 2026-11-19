function plain(doc) {
  if (!doc) return null;
  return typeof doc.toObject === "function" ? doc.toObject() : doc;
}

export function userJSON(user) {
  const doc = plain(user);
  if (!doc) return null;
  const twoFactorEnabled = Boolean(doc.twoFactor?.enabled);
  return {
    _id: doc._id,
    name: doc.name,
    email: doc.email,
    role: doc.role,
    avatar: { url: doc.avatar?.url || "" },
    isVerified: Boolean(doc.isVerified),
    twoFactorEnabled,
    twoFactor: { enabled: twoFactorEnabled },
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function courseJSON(course) {
  const doc = plain(course);
  if (!doc) return null;
  const category =
    typeof doc.category === "object" && doc.category?.name
      ? doc.category.name
      : doc.category || "";
  return {
    _id: doc._id,
    id: doc._id,
    name: doc.name,
    description: doc.description || "",
    price: Number(doc.price ?? 0),
    estimatedPrice: Number(doc.estimatedPrice ?? doc.price ?? 0),
    thumbnail: typeof doc.thumbnail === "string" ? doc.thumbnail : doc.thumbnail?.url || "",
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    level: doc.level || "Beginner",
    benefits: Array.isArray(doc.benefits) ? doc.benefits : [],
    prerequisites: Array.isArray(doc.prerequisites) ? doc.prerequisites : [],
    demoUrl: doc.demoUrl || "",
    category,
    categoryId: doc.categoryId || null,
    instructor: doc.instructor || null,
    instructorName: doc.instructorName || "",
    status: doc.status || "PUBLISHED",
    purchased: Number(doc.purchased ?? 0),
    rating: Number(doc.rating ?? 0),
    reviewCount: Number(doc.reviewCount ?? 0),
    isFree: Number(doc.price ?? 0) <= 0,
    createdAt: doc.createdAt,
  };
}

export function lectureJSON(lecture, extras = {}) {
  const doc = plain(lecture);
  if (!doc) return null;
  return {
    _id: doc._id,
    id: doc._id,
    title: doc.title,
    name: doc.title,
    description: doc.description || "",
    videoUrl: doc.videoUrl || "",
    video: doc.videoUrl || "",
    videoLength: Number(doc.videoLength ?? 0),
    isPreview: Boolean(doc.isPreview),
    sectionId: doc.sectionId,
    courseId: doc.courseId,
    order: doc.order ?? 0,
    ...extras,
  };
}

export function sectionJSON(section, lectures = []) {
  const doc = plain(section);
  if (!doc) return null;
  return {
    _id: doc._id,
    id: doc._id,
    title: doc.title,
    name: doc.title,
    courseId: doc.courseId,
    order: doc.order ?? 0,
    lectures: lectures.map((lecture) => lectureJSON(lecture)),
  };
}

export function enrollmentJSON(enrollment) {
  const doc = plain(enrollment);
  if (!doc) return null;
  const course = doc.course && typeof doc.course === "object" && doc.course.name
    ? courseJSON(doc.course)
    : null;
  return {
    _id: doc._id,
    id: doc._id,
    user: doc.user,
    courseId: course?._id ?? doc.course,
    course,
    progress: Number(doc.progress ?? 0),
    completed: Boolean(doc.isCompleted),
    isCompleted: Boolean(doc.isCompleted),
    completedLectures: doc.completedLectures || [],
    enrolledAt: doc.createdAt,
    createdAt: doc.createdAt,
  };
}

export function orderJSON(order) {
  const doc = plain(order);
  if (!doc) return null;
  const course = doc.course && typeof doc.course === "object" && doc.course.name
    ? courseJSON(doc.course)
    : null;
  return {
    _id: doc._id,
    id: doc._id,
    user: doc.user,
    courseId: course?._id ?? doc.course,
    course,
    courseName: course?.name || "",
    amount: Number(doc.amount ?? 0),
    couponCode: doc.couponCode || "",
    status: doc.status,
    paymentInfo: doc.paymentInfo || null,
    createdAt: doc.createdAt,
  };
}

export function certificateJSON(certificate) {
  const doc = plain(certificate);
  if (!doc) return null;
  const course = doc.course && typeof doc.course === "object" && doc.course.name
    ? courseJSON(doc.course)
    : null;
  return {
    _id: doc._id,
    id: doc._id,
    certificateId: doc.certificateId,
    user: doc.user,
    courseId: course?._id ?? doc.course,
    course,
    courseName: course?.name || doc.courseName || "Course",
    title: course?.name || doc.courseName || "Course",
    studentName: doc.studentName || "",
    issuedAt: doc.createdAt,
    createdAt: doc.createdAt,
  };
}

export function reviewJSON(review) {
  const doc = plain(review);
  if (!doc) return null;
  const user = doc.user && typeof doc.user === "object" ? doc.user : null;
  return {
    _id: doc._id,
    id: doc._id,
    user: user
      ? { _id: user._id, name: user.name, avatar: user.avatar || { url: "" } }
      : { _id: doc.user, name: "Learner", avatar: { url: "" } },
    userName: user?.name || "Learner",
    name: user?.name || "Learner",
    rating: Number(doc.rating ?? 0),
    comment: doc.comment || "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
