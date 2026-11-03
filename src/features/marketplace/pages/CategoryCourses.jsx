import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { usePublicCourses } from "../../../features/courses/hooks/useCourses";
import CourseGrid from "../../../features/courses/components/CourseGrid";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import { getCoursesFromResponse } from "../../../features/courses/utils/courseHelpers";

export default function CategoryCourses() {
  const { category } = useParams();
  const query = usePublicCourses();
  const courses = useMemo(() => getCoursesFromResponse(query.data).filter((course) => String(course.category?.name ?? course.category ?? course.tags ?? "").toLowerCase().includes(String(category ?? "").toLowerCase())), [query.data, category]);
  if (query.isLoading) return <PageLoader />;
  return <div className="mx-auto max-w-7xl space-y-6 px-4 py-8"><PageHeader title={category || "Category"} description="Courses in this category." />{query.isError ? <p className="text-sm text-red-600">{query.error?.message || "Unable to load courses."}</p> : <CourseGrid courses={courses} />}</div>;
}
