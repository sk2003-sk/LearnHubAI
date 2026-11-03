import axiosInstance from "../../../services/api/axiosInstance";

const ANALYTICS_URL = "/api/v1/analytics";

export const getUsersAnalytics = async () => {
    const response = await axiosInstance.get(
        `${ANALYTICS_URL}/get-users-analytics`,
    );
    return response.data;
};

export const getCourseAnalytics = async () => {
    const response = await axiosInstance.get(
        `${ANALYTICS_URL}/get-course-analytics`,
    );
    return response.data;
};

export const getOrderAnalytics = async () => {
    const response = await axiosInstance.get(
        `${ANALYTICS_URL}/get-order-analytics`,
    );
    return response.data;
};
