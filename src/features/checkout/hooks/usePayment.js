import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder, createPayment, verifyPayment } from "../api/checkout.api";
import { toast } from "sonner";

export async function refreshPurchaseQueries(queryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["student", "orders"] }),
    queryClient.invalidateQueries({ queryKey: ["student", "enrollments"] }),
    queryClient.invalidateQueries({ queryKey: ["student", "my-learning"] }),
    queryClient.invalidateQueries({ queryKey: ["student", "course"] }),
    queryClient.invalidateQueries({ queryKey: ["student", "progress-analytics"] }),
    queryClient.invalidateQueries({ queryKey: ["student", "certificates"] }),
    queryClient.invalidateQueries({ queryKey: ["learning", "my"] }),
    queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }),
    queryClient.invalidateQueries({ queryKey: ["admin", "enrollments"] }),
    queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] }),
  ]);
}

export const useCreatePayment = () => useMutation({
  mutationFn: createPayment,
  onSuccess: () => toast.success("Payment initiated successfully"),
});

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => refreshPurchaseQueries(queryClient),
    onError: (error) => toast.error(error?.response?.data?.message || error?.message || "Failed to complete your order"),
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: async () => {
      toast.success("Payment verified and enrollment confirmed");
      await refreshPurchaseQueries(queryClient);
    },
    onError: (error) => toast.error(error?.response?.data?.message || error?.message || "Failed to verify payment"),
  });
};
