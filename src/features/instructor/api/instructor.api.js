
import axiosInstance from "../../../services/api/axiosInstance";

const LMS_URL = "/api/v1/lms";

export const getInstructorCourses = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/instructor/courses`);
    return response.data;
};

export const createInstructorCourse = async (courseData) => {
    const response = await axiosInstance.post(
        `${LMS_URL}/instructor/courses`,
        courseData,
    );
    return response.data;
};

export const updateInstructorCourse = async ({ courseId, courseData }) => {
    const response = await axiosInstance.put(
        `${LMS_URL}/instructor/courses/${courseId}`,
        courseData,
    );
    return response.data;
};

export const submitInstructorCourse = async (courseId) => {
    const response = await axiosInstance.post(
        `${LMS_URL}/instructor/courses/${courseId}/submit`,
    );
    return response.data;
};

export const getInstructorStudents = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/instructor/students`);
    return response.data;
};

export const createInstructorLecture = async ({
    courseId,
    lectureData,
}) => {
    const response = await axiosInstance.post(
        `${LMS_URL}/instructor/courses/${courseId}/lectures`,
        lectureData,
    );
    return response.data;
};

export const getSectionLectures = async (sectionId) => {
    const response = await axiosInstance.get(
        `${LMS_URL}/sections/${sectionId}/lectures`,
    );
    return response.data;
};

export const getInstructorAnalytics = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/instructor/analytics`);
    return response.data;
};

export const getInstructorRevenue = async () => {
    const response = await axiosInstance.get(`${LMS_URL}/instructor/revenue`);
    return response.data;
};
