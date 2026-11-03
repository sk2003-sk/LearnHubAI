import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createLayout,
    updateLayout,
    getLayout,
} from "../api/layout.api";

export const useLayout = (type) =>
    useQuery({
        queryKey: ["layout", type],
        queryFn: () => getLayout(type),
        enabled: Boolean(type),
    });

export const useCreateLayout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createLayout,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["layout"],
            });
        },
    });
};

export const useUpdateLayout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateLayout,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["layout"],
            });
        },
    });
};
