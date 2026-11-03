import axiosInstance from "../../../services/api/axiosInstance";

const LMS_URL = "/api/v1/lms";

export const getAdminCourses = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/admin/courses?limit=100`);
    return response.data;
};

export const updateAdminCourseStatus = async ({ courseId, status }) => {
    const response = await axiosInstance.put(`${LMS_URL}/admin/courses/${courseId}/status`, { status });
    return response.data;
};

export const cloneAdminCourse = async (courseId) => {
    const response = await axiosInstance.post(`${LMS_URL}/courses/clone`, { courseId });
    return response.data;
};

export const getAdminInstructors = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/admin/instructors?limit=100`);
    return response.data;
};

export const getAdminOrders = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/admin/orders?limit=100`);
    return response.data;
};

export const getAdminEnrollments = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/admin/enrollments?limit=100`);
    return response.data;
};

export const getAdminAnalytics = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/admin/analytics`);
    return response.data;
};

export const exportAdminEnrollments = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/admin/enrollments/export`, { responseType: "blob" });
    return response.data;
};

export const getAllCategories = async () => {
    try {
        const response = await axiosInstance.get(`${LMS_URL}/categories/all?limit=100`);
        return response.data;
    } catch (error) {
        const status = error?.response?.status ?? error?.status;
        if (status && [401, 403, 404].includes(status)) {
            const response = await axiosInstance.get(`${LMS_URL}/categories?limit=100`);
            return response.data;
        }
        throw error;
    }
};

export const updateCategory = async ({ categoryId, categoryData }) => {
    const response = await axiosInstance.put(`${LMS_URL}/categories/${categoryId}`, categoryData);
    return response.data;
};

export const createAdminCourse = async (courseData) => {
    const payload = {
        ...courseData,
        thumbnail: typeof courseData.thumbnail === "object" ? courseData.thumbnail?.url ?? "" : courseData.thumbnail,
    };
    const response = await axiosInstance.post("/api/v1/course/create-course", payload);
    return response.data;
};

export const updateAdminCourse = async ({ courseId, courseData }) => {
    const payload = {
        ...courseData,
        thumbnail: typeof courseData.thumbnail === "object" ? courseData.thumbnail?.url ?? "" : courseData.thumbnail,
    };
    const response = await axiosInstance.put(`/api/v1/course/edit-course/${courseId}`, payload);
    return response.data;
};

export const deleteAdminCourse = async (courseId) => {
    const response = await axiosInstance.delete(`/api/v1/course/delete-course/${courseId}`);
    return response.data;
};

export const deleteCategory = async (categoryId) => {
    const response = await axiosInstance.delete(`${LMS_URL}/categories/${categoryId}`);
    return response.data;
};
