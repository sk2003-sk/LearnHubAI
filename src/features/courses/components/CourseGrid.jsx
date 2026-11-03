import CourseCard from "./CourseCard";
import { getCourseId } from "../utils/courseHelpers";

function CourseGrid({ courses = [] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((course, index) => (
        <CourseCard
          key={getCourseId(course) ?? course?._id ?? course?.id ?? index}
          course={course}
        />
      ))}
    </div>
  );
}

export default CourseGrid;
