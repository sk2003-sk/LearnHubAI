import axiosInstance from "../../../services/api/axiosInstance";

const LMS_URL = "/api/v1/lms";

export const getStudentOrders = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/orders`);
    return response.data;
};

export const getStudentEnrollments = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/enrollments`);
    return response.data;
};

export const getStudentCourseContent = async (courseId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/courses/${courseId}/curriculum`,
    );
    return response.data;
};

export const updateLectureProgress = async ({ lectureId, watchedSeconds }) => {
    const response = await axiosInstance.post(
        `${LMS_URL}/lectures/${lectureId}/progress`,
        { watchedSeconds },
    );
    return response.data;
};

export const completeLecture = async (lectureId) => {
    const response = await axiosInstance.post(
        `${LMS_URL}/lectures/${lectureId}/complete`,
    );
    return response.data;
};

export const getStudentProgressAnalytics = async () => {
    const response = await axiosInstance.get(
        `${LMS_URL}/progress-analytics`,
    );
    return response.data;
};

export const getStudentCertificates = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/certificates`);
    return response.data;
};

export const getStudentCertificate = async (certificateId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/certificates/${certificateId}`,
    );
    return response.data;
};

export const downloadStudentCertificate = async (certificateId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/certificates/${certificateId}/download`,
        { responseType: "blob" },
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

export const getMyLearning = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/my-learning`);
    return response.data;
};

export const getPurchases = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/purchases`);
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

export const validateCoupon = async ({ courseId, code }) => {
    const response = await axiosInstance.post(`${LMS_URL}/coupons/validate`, {
        courseId,
        code,
    });
    return response.data;
};
