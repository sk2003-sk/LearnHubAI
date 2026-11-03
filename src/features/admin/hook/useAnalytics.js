import { useQuery } from "@tanstack/react-query";
import {
    getUsersAnalytics,
    getCourseAnalytics,
    getOrderAnalytics,
} from "../api/analytics.api";

export const useUsersAnalytics = () =>
    useQuery({
        queryKey: ["analytics", "users"],
        queryFn: getUsersAnalytics,
    });

export const useCourseAnalytics = () =>
    useQuery({
        queryKey: ["analytics", "courses"],
        queryFn: getCourseAnalytics,
    });

export const useOrderAnalytics = () =>
    useQuery({
        queryKey: ["analytics", "orders"],
        queryFn: getOrderAnalytics,
    });
