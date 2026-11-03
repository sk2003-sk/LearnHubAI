import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCourseReviews,
  createCourseReview,
  getStudentOrders,
  getStudentEnrollments,
  getStudentCourseContent,
  updateLectureProgress,
  completeLecture,
  getStudentProgressAnalytics,
  getStudentCertificates,
  getStudentCertificate,
  downloadStudentCertificate,
  getMyLearning,
} from "../api/student.api";
import { getCourseById } from "../../marketplace/api/marketplace.api";
import { getCourseFromResponse, getCourseId } from "../../courses/utils/courseHelpers";
import { getOrderCourseId, getOrdersFromResponse, getMyLearningRecords } from "../utils/studentHelpers";

export function useStudentLearning() {
  const myLearningQuery = useQuery({ queryKey: ["student", "my-learning"], queryFn: getMyLearning, staleTime: 30_000 });
  const ordersQuery = useQuery({ queryKey: ["student", "orders"], queryFn: getStudentOrders, staleTime: 30_000 });
  const enrollmentsQuery = useQuery({ queryKey: ["student", "enrollments"], queryFn: getStudentEnrollments, staleTime: 30_000 });

  const aggregateRecords = getMyLearningRecords(myLearningQuery.data);
  const orders = getOrdersFromResponse(ordersQuery.data);
  const enrollments = getOrdersFromResponse(enrollmentsQuery.data);
  const learningRecords = aggregateRecords.length ? aggregateRecords : enrollments.length ? enrollments : orders;
  const courseIds = [...new Set(learningRecords.map((item) => getOrderCourseId(item?.enrollment ?? item)).filter(Boolean))];

  const courseQueries = useQueries({ queries: courseIds.map((courseId) => ({
    queryKey: ["student", "course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: myLearningQuery.isSuccess || ordersQuery.isSuccess || enrollmentsQuery.isSuccess,
  })) });

  const courses = learningRecords.map((record, index) => {
    const nestedCourse = record?.course && typeof record.course === "object" ? record.course : record?.courseId && typeof record.courseId === "object" ? record.courseId : record?.name || record?.title ? record : null;
    const recordCourseId = getOrderCourseId(record?.enrollment ?? record);
    const courseResponse = nestedCourse ? nestedCourse : courseQueries[courseIds.indexOf(recordCourseId)]?.data;
    if (!courseResponse) return null;
    const course = getCourseFromResponse(courseResponse);
    const id = getCourseId(course) ?? recordCourseId ?? courseIds[index];
    return { ...course, _id: id, enrollment: record?.enrollment ?? (enrollments.find((item) => getOrderCourseId(item) === id) ?? record), order: orders.find((item) => getOrderCourseId(item) === id) };
  }).filter((course) => course?._id);

  const sourceQueries = [myLearningQuery, ordersQuery, enrollmentsQuery];
  const hasSuccessfulSource = sourceQueries.some((query) => query.isSuccess);
  const isLoading = !hasSuccessfulSource && sourceQueries.some((query) => query.isLoading) || courseQueries.some((query) => query.isLoading);
  const sourceError = sourceQueries.find((query) => query.isError)?.error;
  const courseError = courseQueries.find((query) => query.isError)?.error;

  return {
    orders,
    enrollments,
    courses,
    isLoading,
    isError: !hasSuccessfulSource && sourceQueries.every((query) => query.isError) || Boolean(courseError && courses.length === 0 && courseIds.length > 0),
    error: courseError || sourceError,
    refetch: async () => Promise.all(sourceQueries.map((query) => query.refetch())),
  };
}

export function useStudentCourseContent(courseId) {
  return useQuery({ queryKey: ["student", "course-content", courseId], queryFn: () => getStudentCourseContent(courseId), enabled: Boolean(courseId) });
}

export function useStudentProgressAnalytics() {
  return useQuery({ queryKey: ["student", "progress-analytics"], queryFn: getStudentProgressAnalytics, staleTime: 30_000 });
}

export function useUpdateLectureProgress() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: updateLectureProgress, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["student", "progress-analytics"] }) });
}

export function useCompleteLecture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeLecture,
    onSuccess: async () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ["student", "progress-analytics"] }),
      queryClient.invalidateQueries({ queryKey: ["student", "course-content"] }),
      queryClient.invalidateQueries({ queryKey: ["student", "orders"] }),
      queryClient.invalidateQueries({ queryKey: ["student", "enrollments"] }),
      queryClient.invalidateQueries({ queryKey: ["student", "my-learning"] }),
      queryClient.invalidateQueries({ queryKey: ["student", "certificates"] }),
    ]),
  });
}

export function useStudentCertificates() {
  return useQuery({ queryKey: ["student", "certificates"], queryFn: getStudentCertificates, staleTime: 30_000 });
}

export function useStudentCertificate(certificateId) {
  return useQuery({ queryKey: ["student", "certificate", certificateId], queryFn: () => getStudentCertificate(certificateId), enabled: Boolean(certificateId) });
}

export function useDownloadStudentCertificate() {
  return useMutation({ mutationFn: downloadStudentCertificate });
}

export function useCourseReviews(courseId) {
  return useQuery({ queryKey: ["student", "reviews", courseId], queryFn: () => getCourseReviews(courseId), enabled: Boolean(courseId) });
}

export function useCreateCourseReview() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: createCourseReview, onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ["student", "reviews", variables.courseId] }) });
}
