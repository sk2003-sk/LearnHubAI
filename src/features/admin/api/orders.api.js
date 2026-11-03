import axiosInstance from "../../../services/api/axiosInstance";

const LMS_URL = "/api/v1/lms";

export const getAdminOrders = async () => {
  const response = await axiosInstance.get(`${LMS_URL}/admin/orders`);
  return response.data;
};

export const getAdminOrder = async (orderId) => {
  const response = await axiosInstance.get(`${LMS_URL}/orders/${orderId}`);
  return response.data;
};

export const processRefund = async ({ orderId }) => {
  const response = await axiosInstance.post(`${LMS_URL}/payments/refund`, { orderId });
  return response.data;
};
