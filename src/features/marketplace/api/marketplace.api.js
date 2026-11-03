import axiosInstance from "../../../services/api/axiosInstance";

const LMS_URL = "/api/v1/lms";

export const getPublicCourses = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/courses`);
    return response.data;
};

export const getCourseById = async (courseId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/courses/${courseId}`,
    );

    return response.data;
};

export const getCourseCurriculum = async (courseId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/courses/${courseId}/curriculum`,
    );

    return response.data;
};

export const getCourseSections = async (courseId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/courses/${courseId}/sections`,
    );

    return response.data;
};

export const getCourseWishlist = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/wishlist`);
    return response.data;
};

export const toggleCourseWishlist = async (courseId) => {
    const response = await axiosInstance.post(`${LMS_URL}/wishlist`, {
        courseId,
    });

    return response.data;
};

export const toggleCourseWishlistAlias = async (courseId) => {
    const response = await axiosInstance.post(`${LMS_URL}/wishlist/toggle`, {
        courseId,
    });

    return response.data;
};

export const getMyLearning = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/my-learning`);
    return response.data;
};

export const getMarketplaceHome = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/home`);
    return response.data;
};

export const searchCourses = async (query) => {
    const response = await axiosInstance.get(`${LMS_URL}/search`, {
        params: { q: query },
    });
    return response.data;
};

export const getCategories = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/categories`);
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await axiosInstance.post(
        `${LMS_URL}/categories`,
        categoryData,
    );
    return response.data;
};

export const getSection = async (sectionId) => {
    const response = await axiosInstance.get(`${LMS_URL}/sections/${sectionId}`);
    return response.data;
};

export const getSectionLectures = async (sectionId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/sections/${sectionId}/lectures`,
    );
    return response.data;
};

export const getLecture = async (lectureId) => {
    const response = await axiosInstance.get(`${LMS_URL}/lectures/${lectureId}`);
    return response.data;
};

export const getLectureAccess = async (lectureId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/lectures/${lectureId}/access`,
    );
    return response.data;
};

export const saveLectureProgress = async ({ lectureId, watchedSeconds }) => {
    const response = await axiosInstance.post(
        `${LMS_URL}/lectures/${lectureId}/progress`,
        { watchedSeconds },
    );
    return response.data;
};

export const markLectureComplete = async (lectureId) => {
    const response = await axiosInstance.post(
        `${LMS_URL}/lectures/${lectureId}/complete`,
    );
    return response.data;
};

export const getPurchases = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/purchases`);
    return response.data;
};

export const getOrders = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/orders`);
    return response.data;
};

export const getOrder = async (orderId) => {
    const response = await axiosInstance.get(`${LMS_URL}/orders/${orderId}`);
    return response.data;
};

export const getEnrollments = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/enrollments`);
    return response.data;
};

export const getEnrollment = async (enrollmentId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/enrollments/${enrollmentId}`,
    );
    return response.data;
};

export const getCourseReviews = async (courseId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/reviews/${courseId}`,
    );
    return response.data;
};

export const createCourseReview = async ({ courseId, rating, comment }) => {
    const response = await axiosInstance.post(
        `${LMS_URL}/reviews/${courseId}`,
        { rating, comment },
    );
    return response.data;
};

export const getCourseReviewsAlias = async (courseId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/courses/${courseId}/reviews`,
    );
    return response.data;
};

export const validateCoupon = async ({ courseId, code }) => {
    const response = await axiosInstance.post(`${LMS_URL}/coupons/validate`, {
        courseId,
        code,
    });
    return response.data;
};

export const getCoupons = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/coupons`);
    return response.data;
};

export const createCoupon = async (couponData) => {
    const response = await axiosInstance.post(`${LMS_URL}/coupons`, couponData);
    return response.data;
};

export const getCertificates = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/certificates`);
    return response.data;
};

export const getCertificate = async (certificateId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/certificates/${certificateId}`,
    );
    return response.data;
};

export const downloadCertificate = async (certificateId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/certificates/${certificateId}/download`,
        { responseType: "blob" },
    );
    return response.data;
};

export const getProgressAnalytics = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/progress-analytics`);
    return response.data;
};
