import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    deleteAdminUser,
    getAdminUsers,
    updateAdminUserRole,
} from "../api/userManagement.api";
import { toast } from "sonner";
import { extractArray } from "../../../utils/apiResponse";

const USERS_QUERY_KEY = ["admin-users"];

export const useAdminUsers = () => {
    return useQuery({
        queryKey: USERS_QUERY_KEY,
        queryFn: getAdminUsers,
        select: (response) => extractArray(response, ["users", "items", "results"]),
    });
};

export const useUpdateAdminUserRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAdminUserRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
            toast.success("User role updated successfully");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Unable to update user role",
            );
        },
    });
};

export const useDeleteAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAdminUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
            toast.success("User deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Unable to delete user");
        },
    });
};