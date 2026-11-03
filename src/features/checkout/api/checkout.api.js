import axiosInstance from "../../../services/api/axiosInstance";

const LMS_URL = "/api/v1/lms";
const ORDER_URL = "/api/v1/order";

export const createPayment = async (paymentData) => {
    const response = await axiosInstance.post(
        `${LMS_URL}/payments/create`,
        paymentData,
    );
    return response.data;
};

export const verifyPayment = async (verificationData) => {
    const response = await axiosInstance.post(
        `${LMS_URL}/payments/verify`,
        verificationData,
    );
    return response.data;
};

export const handlePaymentWebhook = async (webhookData) => {
    const response = await axiosInstance.post(
        `${LMS_URL}/payments/webhook`,
        webhookData,
    );
    return response.data;
};

export const refundPayment = async ({ orderId }) => {
    const response = await axiosInstance.post(`${LMS_URL}/payments/refund`, {
        orderId,
    });
    return response.data;
};

export const createOrder = async (orderData) => {
    const response = await axiosInstance.post(
        `${ORDER_URL}/create-order`,
        orderData,
    );
    return response.data;
};

export const getAllOrderDashboard = async () => {
    const response = await axiosInstance.get(
        `${ORDER_URL}/get-all-order-dashboard`,
    );
    return response.data;
};
