import CourseGrid from "../../courses/components/CourseGrid";

export default function TrendingCourses({ courses = [] }) {
  return <section className="space-y-4"><div><h2 className="text-xl font-semibold text-foreground ">Trending Courses</h2><p className="mt-1 text-sm text-foreground-secondary">Browse courses currently available on LearnHub.</p></div><CourseGrid courses={courses} /></section>;
}
