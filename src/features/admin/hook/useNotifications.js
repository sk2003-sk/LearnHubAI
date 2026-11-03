import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllNotifications,
    updateNotificationStatus,
} from "../api/notifications.api";

export const useNotifications = () =>
    useQuery({
        queryKey: ["notifications"],
        queryFn: getAllNotifications,
    });

export const useUpdateNotificationStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateNotificationStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
        },
    });
};
