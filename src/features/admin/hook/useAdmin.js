
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    cloneAdminCourse,
    getAdminCourses,
    updateAdminCourseStatus,
    getAdminInstructors,
    getAdminOrders,
    getAdminEnrollments,
    getAdminAnalytics,
    exportAdminEnrollments,
    getAllCategories,
    updateCategory,
    deleteCategory,
    createAdminCourse,
    updateAdminCourse,
    deleteAdminCourse,
} from "../api/admin.api";

export const useAdminCourses = () =>
    useQuery({
        queryKey: ["admin", "courses"],
        queryFn: getAdminCourses,
    });

export const useUpdateAdminCourseStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAdminCourseStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "courses"],
            });
        },
    });
};

export const useCloneAdminCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cloneAdminCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "courses"],
            });
        },
    });
};

export const useAdminInstructors = () =>
    useQuery({
        queryKey: ["admin", "instructors"],
        queryFn: getAdminInstructors,
    });

export const useAdminOrders = () =>
    useQuery({
        queryKey: ["admin", "orders"],
        queryFn: getAdminOrders,
    });

export const useAdminEnrollments = () =>
    useQuery({
        queryKey: ["admin", "enrollments"],
        queryFn: getAdminEnrollments,
    });

export const useAdminAnalytics = () =>
    useQuery({
        queryKey: ["admin", "analytics"],
        queryFn: getAdminAnalytics,
    });

export const useExportAdminEnrollments = () => {
    return useMutation({
        mutationFn: exportAdminEnrollments,
    });
};

export const useAllCategories = () =>
    useQuery({
        queryKey: ["admin", "categories"],
        queryFn: getAllCategories,
    });

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "categories"],
            });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "categories"],
            });
        },
    });
};

export const useCreateAdminCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAdminCourse,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "courses"] }),
    });
};

export const useUpdateAdminCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAdminCourse,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "courses"] }),
    });
};

export const useDeleteAdminCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAdminCourse,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "courses"] }),
    });
};
