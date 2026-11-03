import { extractArray } from "../../../utils/apiResponse";

export function getOrdersFromResponse(response) {
  return extractArray(response, ["orders", "enrollments", "items", "results", "purchases", "records"]);
}

export function getOrderCourseId(order) {
  const value = order?.courseId ?? order?.course?._id ?? order?.course?.id ?? order?.course;
  if (typeof value === "string") return value;
  return value?._id ?? value?.id ?? (order?.name || order?.title ? order?._id ?? order?.id : null);
}

export function getLearningContentFromResponse(response) {
  const content = extractArray(response, ["courseData", "content", "curriculum", "sections", "lectures", "items", "results"]);
  if (content.some((item) => Array.isArray(item?.lectures))) {
    return content.flatMap((section) => (section.lectures ?? []).map((lecture) => ({ ...lecture, sectionTitle: section.title ?? section.name ?? section.videoSection ?? "Course section" })));
  }
  return content;
}

export function getCertificatesFromResponse(response) {
  return extractArray(response, ["certificates", "items", "results", "records"]);
}

export function getProgressRowsFromResponse(response) {
  return extractArray(response, ["courses", "progress", "courseProgress", "perCourse", "progressByCourse", "items", "results", "enrollments"]);
}

export function getMyLearningRecords(response) {
  const payload = response?.data ?? response;
  const buckets = ["continueLearning", "inProgress", "completed"]
    .flatMap((key) => (Array.isArray(payload?.[key]) ? payload[key] : []));

  if (buckets.length) {
    const records = buckets.map((item) => {
      const enrollment = item?.enrollment ?? item?.enrolment ?? null;
      const course =
        item?.course ?? item?.courseId ?? enrollment?.course ?? null;
      const id =
        enrollment?._id ??
        enrollment?.id ??
        course?._id ??
        course?.id ??
        item?._id ??
        item?.id;

      return {
        ...item,
        ...(enrollment ?? {}),
        _id: id,
        course,
        enrollment: enrollment ?? item,
        completed:
          item?.completed ??
          enrollment?.completed ??
          Number(item?.progress ?? enrollment?.progress ?? 0) >= 100,
      };
    });

    return [...new Map(records.map((record, index) => [record._id ?? `record-${index}`, record])).values()];
  }

  return extractArray(response, ["courses", "enrollments", "items", "results", "myLearning", "records"]);
}
