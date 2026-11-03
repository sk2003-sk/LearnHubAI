
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createInstructorCourse,
    createInstructorLecture,
    getInstructorAnalytics,
    getInstructorCourses,
    getInstructorRevenue,
    getInstructorStudents,
    getSectionLectures,
    submitInstructorCourse,
    updateInstructorCourse,
} from "../api/instructor.api";

import { getCourseSections } from "../../marketplace/api/marketplace.api";

export const useInstructorCourses = () =>
    useQuery({
        queryKey: ["instructor", "courses"],
        queryFn: getInstructorCourses,
    });

export const useCreateInstructorCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createInstructorCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["instructor", "courses"],
            });
        },
    });
};

export const useUpdateInstructorCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateInstructorCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["instructor", "courses"],
            });
        },
    });
};

export const useSubmitInstructorCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitInstructorCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["instructor", "courses"],
            });
        },
    });
};

export const useInstructorStudents = () =>
    useQuery({
        queryKey: ["instructor", "students"],
        queryFn: getInstructorStudents,
    });

export const useInstructorCourseSections = (courseId) =>
    useQuery({
        queryKey: ["instructor", "course-sections", courseId],
        queryFn: () => getCourseSections(courseId),
        enabled: Boolean(courseId),
    });

export const useSectionLectures = (sectionId) =>
    useQuery({
        queryKey: ["instructor", "section-lectures", sectionId],
        queryFn: () => getSectionLectures(sectionId),
        enabled: Boolean(sectionId),
    });

export const useCreateInstructorLecture = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createInstructorLecture,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["instructor", "section-lectures"],
            });

            queryClient.invalidateQueries({
                queryKey: ["instructor", "course-sections"],
            });
        },
    });
};

export const useInstructorAnalytics = () =>
    useQuery({
        queryKey: ["instructor", "analytics"],
        queryFn: getInstructorAnalytics,
    });

export const useInstructorRevenue = () =>
    useQuery({
        queryKey: ["instructor", "revenue"],
        queryFn: getInstructorRevenue,
    });
