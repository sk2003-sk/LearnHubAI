import axiosInstance from "../../../services/api/axiosInstance";

const NOTIFICATIONS_URL = "/api/v1/notifications";

export const getAllNotifications = async () => {
    const response = await axiosInstance.get(
        `${NOTIFICATIONS_URL}/get-all-notification?limit=100`,
    );
    return response.data;
};

export const updateNotificationStatus = async (id) => {
    const response = await axiosInstance.put(
        `${NOTIFICATIONS_URL}/update-notification-status/${id}`,
    );
    return response.data;
};
