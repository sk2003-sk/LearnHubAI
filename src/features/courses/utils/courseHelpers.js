import { extractArray, extractObject } from "../../../utils/apiResponse";

export function getCourseFromResponse(response) {
  const course = extractObject(response, ["course", "item"]);
  return course && Object.keys(course).length ? course : response;
}

export function getCoursesFromResponse(response) {
  const courses = extractArray(response, ["courses", "items", "results", "wishlist", "savedCourses"]);
  return courses.map((item) => {
    if (item?.course && typeof item.course === "object") return item.course;
    if (item?.courseId && typeof item.courseId === "object") return item.courseId;
    if (item?.courseDetails && typeof item.courseDetails === "object") return item.courseDetails;
    if (typeof item?.courseId === "string") return { ...item, _id: item.courseId };
    return item;
  }).filter(Boolean);
}

export function getCourseThumbnail(course) {
  if (typeof course?.thumbnail === "string") return course.thumbnail;
  return course?.thumbnail?.url ?? course?.image ?? course?.imageUrl ?? "";
}

export function getCourseId(course) {
  if (typeof course?.courseId === "string") return course.courseId;
  return (
    course?._id ??
    course?.id ??
    course?.courseId?._id ??
    course?.courseId?.id ??
    course?.course?._id ??
    course?.course?.id ??
    null
  );
}

export function getCourseRating(course) {
  const value =
    course?.rating ??
    course?.ratings ??
    course?.averageRating ??
    course?.average_rating;

  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  if (value && typeof value === "object") {
    const nested = value.average ?? value.avg ?? value.value ?? value.rating;
    return Number.isFinite(Number(nested)) ? Number(nested) : 0;
  }

  return 0;
}

export function getCurriculumItemsFromResponse(response) {
  const items = extractArray(response, ["curriculum", "sections", "courseData", "lectures", "items", "results"]);
  if (items.some((item) => Array.isArray(item?.lectures))) {
    return items.flatMap((section) => (section.lectures ?? []).map((lecture) => ({ ...lecture, sectionTitle: section.title ?? section.name ?? section.videoSection ?? "Course section" })));
  }
  return items;
}

export function getCourseTags(course) {
  if (Array.isArray(course?.tags)) return course.tags.filter(Boolean);
  if (typeof course?.tags === "string") return course.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  return [];
}
