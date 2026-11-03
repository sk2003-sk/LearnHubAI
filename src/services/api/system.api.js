import axiosInstance from "./axiosInstance";

export const getApiRoot = async () => {
    const response = await axiosInstance.get("/");
    return response.data;
};

export const getHealthCheck = async () => {
    const response = await axiosInstance.get("/test");
    return response.data;
};

export const getOpenApiSpec = async () => {
    const response = await axiosInstance.get("/api-docs.json");
    return response.data;
};
