import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import { getCourseFromResponse } from "../../courses/utils/courseHelpers";
import InstructorCourseForm from "../component/InstructorCourseForm";
import {
  useInstructorCourses,
  useUpdateInstructorCourse,
} from "../hook/useInstructior";
function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const coursesQuery = useInstructorCourses();
  const updateMutation = useUpdateInstructorCourse();

  const response = coursesQuery.data;
  const courses = Array.isArray(response)
    ? response
    : response?.courses || response?.data?.courses || response?.result?.courses || [];

  const course =
    courses.find((item) => (item._id || item.id) === courseId) || null;

  const handleUpdate = async (courseData) => {
    try {
      await updateMutation.mutateAsync({
        courseId,
        courseData,
      });

      toast.success("Course updated successfully.");
      navigate("/instructor/courses");
    } catch (error) {
      toast.error(error?.message || "Unable to update course.");
    }
  };

  if (coursesQuery.isLoading) return <PageLoader />;

  if (coursesQuery.isError) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Unable to load course information.
      </p>
    );
  }

  if (!course) {
    return (
      <p className="text-sm text-foreground-secondary ">
        Course not found in your instructor course list.
      </p>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Course"
        description={`Update the details for ${course.name || "your course"}.`}
      />

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-7  ">
        <InstructorCourseForm
          initialData={getCourseFromResponse(course)}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}

export default EditCourse;
