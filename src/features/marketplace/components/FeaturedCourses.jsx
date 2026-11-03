import CourseGrid from "../../courses/components/CourseGrid";

export default function FeaturedCourses({ courses = [] }) {
  return <section className="space-y-4"><div><h2 className="text-xl font-semibold text-foreground ">Featured courses</h2><p className="mt-1 text-sm text-foreground-secondary">Explore selected courses from the catalogue.</p></div><CourseGrid courses={courses} /></section>;
}
