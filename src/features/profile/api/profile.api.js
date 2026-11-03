import axiosInstance from "../../../services/api/axiosInstance";

const AUTH_URL = "/api/v1/auth";

export const updateUserInfo = async (userData) => {
    const response = await axiosInstance.put(
        `${AUTH_URL}/update-user-info`,
        userData,
    );

    return response.data;
};

export const updateUserPassword = async (passwordData) => {
    const response = await axiosInstance.put(
        `${AUTH_URL}/update-user-password`,
        passwordData,
    );

    return response.data;
};

export const updateUserProfilePicture = async (formData) => {
    const response = await axiosInstance.put(
        `${AUTH_URL}/update-user-profile-picture`,
        formData,
    );

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get(`${AUTH_URL}/me`);
    return response.data;
};

export const setup2FA = async () => {
    const response = await axiosInstance.post(`${AUTH_URL}/2fa/setup`);
    return response.data;
};

export const verify2FA = async (token) => {
    const response = await axiosInstance.post(`${AUTH_URL}/2fa/verify`, {
        token,
    });
    return response.data;
};

export const disable2FA = async (token) => {
    const response = await axiosInstance.post(`${AUTH_URL}/2fa/disable`, {
        token,
    });
    return response.data;
};
