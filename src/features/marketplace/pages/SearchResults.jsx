import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { usePublicCourses } from "../../../features/courses/hooks/useCourses";
import CourseGrid from "../../../features/courses/components/CourseGrid";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import { getCoursesFromResponse } from "../../../features/courses/utils/courseHelpers";

export default function SearchResults() {
  const [params] = useSearchParams();
  const queryText = params.get("q") ?? "";
  const query = usePublicCourses();
  const courses = useMemo(() => getCoursesFromResponse(query.data).filter((course) => `${course.name ?? ""} ${course.description ?? ""} ${Array.isArray(course.tags) ? course.tags.join(" ") : course.tags ?? ""}`.toLowerCase().includes(queryText.toLowerCase())), [query.data, queryText]);
  if (query.isLoading) return <PageLoader />;
  return <div className="mx-auto max-w-7xl space-y-6 px-4 py-8"><PageHeader title="Search results" description={`Results for “${queryText}”`} />{query.isError ? <p className="text-sm text-red-600">{query.error?.message || "Unable to search courses."}</p> : <CourseGrid courses={courses} />}</div>;
}
