import axiosInstance from "../../../services/api/axiosInstance";

const LMS_URL = "/api/v1/lms";

export const createCourse = async (courseData) => {
    const response = await axiosInstance.post(
        "/api/v1/course/create-course",
        courseData,
    );
    return response.data;
};

export const editCourse = async ({ id, courseData }) => {
    const response = await axiosInstance.put(
        `/api/v1/course/edit-course/${id}`,
        courseData,
    );
    return response.data;
};

export const getCourse = async (id) => {
    const response = await axiosInstance.get(`/api/v1/course/get-course/${id}`);
    return response.data;
};

export const getCourses = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/courses?limit=100`);
    return response.data;
};

export const getCourseContent = async (id) => {
    const response = await axiosInstance.get(
        `/api/v1/course/get-course-content/${id}`,
    );
    return response.data;
};

export const addQuestion = async (questionData) => {
    const response = await axiosInstance.put(
        "/api/v1/course/add-question",
        questionData,
    );
    return response.data;
};

export const addAnswer = async (answerData) => {
    const response = await axiosInstance.put("/api/v1/course/add-answer", answerData);
    return response.data;
};

export const addReview = async ({ id, rating, review }) => {
    const response = await axiosInstance.put(
        `/api/v1/course/add-review/${id}`,
        { rating, review },
    );
    return response.data;
};

export const addReply = async (replyData) => {
    const response = await axiosInstance.put("/api/v1/course/add-replay", replyData);
    return response.data;
};

export const getAllCourseDashboard = async () => {
    const response = await axiosInstance.get(
        "/api/v1/course/get-all-course-dashboard",
    );
    return response.data;
};

export const deleteCourse = async (id) => {
    const response = await axiosInstance.delete(
        `/api/v1/course/delete-course/${id}`,
    );
    return response.data;
};