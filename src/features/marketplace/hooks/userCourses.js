import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getPublicCourses,
    getCourseById,
    getCourseCurriculum,
    getCourseSections,
    getCourseWishlist,
    toggleCourseWishlist,
    getMyLearning,
    getMarketplaceHome,
    searchCourses,
    getCategories,
    createCategory,
    getSection,
    getSectionLectures,
    getLecture,
    getLectureAccess,
    saveLectureProgress,
    markLectureComplete,
    getPurchases,
    getOrders,
    getOrder,
    getEnrollments,
    getEnrollment,
    getCourseReviews,
    createCourseReview,
    validateCoupon,
    getCertificates,
    getCertificate,
    downloadCertificate,
    getProgressAnalytics,
} from "../api/marketplace.api";

export function usePublicCourses() {
    return useQuery({
        queryKey: ["courses", "public"],
        queryFn: getPublicCourses,
        select: (response) => response?.courses ?? [],
    });
}

export function useCourse(courseId) {
    return useQuery({
        queryKey: ["courses", "detail", courseId],
        queryFn: () => getCourseById(courseId),
        enabled: Boolean(courseId),
    });
}

export function useCourseCurriculum(courseId) {
    return useQuery({
        queryKey: ["courses", "curriculum", courseId],
        queryFn: () => getCourseCurriculum(courseId),
        enabled: Boolean(courseId),
    });
}

export function useCourseSections(courseId) {
    return useQuery({
        queryKey: ["courses", "sections", courseId],
        queryFn: () => getCourseSections(courseId),
        enabled: Boolean(courseId),
    });
}

export function useCourseWishlist(enabled = true) {
    return useQuery({
        queryKey: ["courses", "wishlist"],
        queryFn: getCourseWishlist,
        enabled,
    });
}

export function useToggleCourseWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleCourseWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["courses", "wishlist"],
            });
        },
    });
}

export function useMyLearning() {
    return useQuery({
        queryKey: ["learning", "my"],
        queryFn: getMyLearning,
    });
}

export function useMarketplaceHome() {
    return useQuery({
        queryKey: ["marketplace", "home"],
        queryFn: getMarketplaceHome,
    });
}

export function useSearchCourses(query) {
    return useQuery({
        queryKey: ["courses", "search", query],
        queryFn: () => searchCourses(query),
        enabled: Boolean(query),
    });
}

export function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });
}

export function useSection(sectionId) {
    return useQuery({
        queryKey: ["sections", sectionId],
        queryFn: () => getSection(sectionId),
        enabled: Boolean(sectionId),
    });
}

export function useSectionLectures(sectionId) {
    return useQuery({
        queryKey: ["sections", sectionId, "lectures"],
        queryFn: () => getSectionLectures(sectionId),
        enabled: Boolean(sectionId),
    });
}

export function useLecture(lectureId) {
    return useQuery({
        queryKey: ["lectures", lectureId],
        queryFn: () => getLecture(lectureId),
        enabled: Boolean(lectureId),
    });
}

export function useLectureAccess(lectureId) {
    return useQuery({
        queryKey: ["lectures", lectureId, "access"],
        queryFn: () => getLectureAccess(lectureId),
        enabled: Boolean(lectureId),
    });
}

export function useSaveLectureProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveLectureProgress,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["learning", "my"],
            });
        },
    });
}

export function useMarkLectureComplete() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markLectureComplete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["learning", "my"],
            });
            queryClient.invalidateQueries({
                queryKey: ["certificates"],
            });
        },
    });
}

export function usePurchases() {
    return useQuery({
        queryKey: ["purchases"],
        queryFn: getPurchases,
    });
}

export function useOrders() {
    return useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    });
}

export function useOrder(orderId) {
    return useQuery({
        queryKey: ["orders", orderId],
        queryFn: () => getOrder(orderId),
        enabled: Boolean(orderId),
    });
}

export function useEnrollments() {
    return useQuery({
        queryKey: ["enrollments"],
        queryFn: getEnrollments,
    });
}

export function useEnrollment(enrollmentId) {
    return useQuery({
        queryKey: ["enrollments", enrollmentId],
        queryFn: () => getEnrollment(enrollmentId),
        enabled: Boolean(enrollmentId),
    });
}

export function useCourseReviews(courseId) {
    return useQuery({
        queryKey: ["reviews", courseId],
        queryFn: () => getCourseReviews(courseId),
        enabled: Boolean(courseId),
    });
}

export function useCreateCourseReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCourseReview,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["reviews", variables.courseId],
            });
        },
    });
}

export function useValidateCoupon() {
    return useMutation({
        mutationFn: validateCoupon,
    });
}

export function useCertificates() {
    return useQuery({
        queryKey: ["certificates"],
        queryFn: getCertificates,
    });
}

export function useCertificate(certificateId) {
    return useQuery({
        queryKey: ["certificates", certificateId],
        queryFn: () => getCertificate(certificateId),
        enabled: Boolean(certificateId),
    });
}

export function useDownloadCertificate() {
    return useMutation({
        mutationFn: downloadCertificate,
    });
}

export function useProgressAnalytics() {
    return useQuery({
        queryKey: ["analytics", "progress"],
        queryFn: getProgressAnalytics,
    });
}
