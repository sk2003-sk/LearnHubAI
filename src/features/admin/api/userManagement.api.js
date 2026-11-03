import axiosInstance from "../../../services/api/axiosInstance";

const AUTH_URL = "/api/v1/auth";

export const getAdminUsers = async () => {
    const response = await axiosInstance.get(
        `${AUTH_URL}/get-all-user-dashboard?limit=100`,
    );

    return response.data;
};

export const updateAdminUserRole = async ({ id, role }) => {
    const response = await axiosInstance.put(
        `${AUTH_URL}/update-user-roles`,
        { id, role },
    );

    return response.data;
};

export const deleteAdminUser = async (id) => {
    const response = await axiosInstance.delete(
        `${AUTH_URL}/delete-user/${id}`,
    );

    return response.data;
};