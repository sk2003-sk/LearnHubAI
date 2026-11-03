import axiosInstance from "../../../services/api/axiosInstance";

const LAYOUT_URL = "/api/v1/layout";

export const createLayout = async (layoutData) => {
    const response = await axiosInstance.post(
        `${LAYOUT_URL}/create-layout`,
        layoutData,
    );
    return response.data;
};

export const updateLayout = async (layoutData) => {
    const response = await axiosInstance.put(
        `${LAYOUT_URL}/update-layout`,
        layoutData,
    );
    return response.data;
};

export const getLayout = async (type) => {
    const response = await axiosInstance.get(`${LAYOUT_URL}/get-layout`, {
        params: { type },
    });
    return response.data;
};
