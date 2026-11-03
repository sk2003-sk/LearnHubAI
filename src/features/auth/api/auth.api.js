
import axiosInstance from "../../../services/api/axiosInstance";

const AUTH_URL = "/api/v1/auth";

export const registerUser = async (userData) => {
    const response = await axiosInstance.post(
        `${AUTH_URL}/register`,
        userData,
    );

    return response.data;
};

export const activateUser = async (activationData) => {
    const response = await axiosInstance.post(
        `${AUTH_URL}/activate-user`,
        activationData,
    );

    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await axiosInstance.post(
        `${AUTH_URL}/login`,
        credentials,
    );

    return response.data;
};

export const logoutUser = async () => {
    const response = await axiosInstance.get(
        `${AUTH_URL}/logout`,
    );

    return response.data;
};

export const refreshAccessToken = async () => {
    const response = await axiosInstance.get(
        `${AUTH_URL}/refreshtoken`,
    );

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get(
        `${AUTH_URL}/me`,
    );

    return response.data;
};

export const socialAuthUser = async (userData) => {
    const response = await axiosInstance.post(
        `${AUTH_URL}/social-auth`,
        userData,
    );

    return response.data;
};

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

export const getAllUserDashboard = async () => {
    const response = await axiosInstance.get(
        `${AUTH_URL}/get-all-user-dashboard`,
    );

    return response.data;
};

export const updateUserRoles = async ({ id, role }) => {
    const response = await axiosInstance.put(
        `${AUTH_URL}/update-user-roles`,
        { id, role },
    );

    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axiosInstance.delete(
        `${AUTH_URL}/delete-user/${id}`,
    );

    return response.data;
};

export const setup2FA = async () => {
    const response = await axiosInstance.post(
        `${AUTH_URL}/2fa/setup`,
    );

    return response.data;
};

export const verify2FA = async (token) => {
    const response = await axiosInstance.post(
        `${AUTH_URL}/2fa/verify`,
        { token },
    );

    return response.data;
};

export const disable2FA = async (token) => {
    const response = await axiosInstance.post(
        `${AUTH_URL}/2fa/disable`,
        { token },
    );

    return response.data;
};

export const forgotPassword = async (emailData) => {
    const response = await axiosInstance.post(
        `${AUTH_URL}/forgot-password`,
        emailData,
    );

    return response.data;
};

export const resetPassword = async (resetData) => {
    const response = await axiosInstance.post(
        `${AUTH_URL}/reset-password`,
        resetData,
    );

    return response.data;
};
