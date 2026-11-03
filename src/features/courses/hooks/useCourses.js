import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCourses } from "../api/courses.api";
import { getCourseById, getCourseCurriculum, getCourseSections, getCourseWishlist, toggleCourseWishlist } from "../../marketplace/api/marketplace.api";
import { getCourseId, getCoursesFromResponse } from "../utils/courseHelpers";

export function usePublicCourses() {
  return useQuery({ queryKey: ["courses", "public"], queryFn: getCourses, select: getCoursesFromResponse, staleTime: 60_000 });
}

export function useCourse(courseId) {
  return useQuery({ queryKey: ["courses", "detail", courseId], queryFn: () => getCourseById(courseId), enabled: Boolean(courseId) });
}

export function useCourseCurriculum(courseId) {
  return useQuery({ queryKey: ["courses", "curriculum", courseId], queryFn: () => getCourseCurriculum(courseId), enabled: Boolean(courseId) });
}

export function useCourseSections(courseId) {
  return useQuery({ queryKey: ["courses", "sections", courseId], queryFn: () => getCourseSections(courseId), enabled: Boolean(courseId) });
}

export function useCourseWishlist(enabled = true) {
  return useQuery({ queryKey: ["courses", "wishlist"], queryFn: getCourseWishlist, enabled, staleTime: 0 });
}

export function useToggleCourseWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleCourseWishlist,
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({ queryKey: ["courses", "wishlist"] });
      const previous = queryClient.getQueryData(["courses", "wishlist"]);
      const savedCourses = getCoursesFromResponse(previous);
      const isSaved = savedCourses.some(
        (course) => String(getCourseId(course)) === String(courseId),
      );
      const nextCourses = isSaved
        ? savedCourses.filter((course) => String(getCourseId(course)) !== String(courseId))
        : [...savedCourses, { courseId, _id: courseId }];

      queryClient.setQueryData(["courses", "wishlist"], {
        success: true,
        wishlist: nextCourses,
      });

      return { previous };
    },
    onSuccess: (response) => {
      if (Array.isArray(response?.wishlist)) {
        queryClient.setQueryData(["courses", "wishlist"], response);
      }
    },
    onError: (_error, _courseId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(["courses", "wishlist"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["courses", "wishlist"] }),
  });
}
