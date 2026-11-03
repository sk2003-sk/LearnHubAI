import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import InstructorCourseForm from "../../instructor/component/InstructorCourseForm";
import { getAdminCoursesFromResponse } from "../utils/adminData";
import { useAdminCourses, useUpdateAdminCourse } from "../hook/useAdmin";

function AdminEditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const coursesQuery = useAdminCourses();
  const updateMutation = useUpdateAdminCourse();
  const courses = useMemo(() => getAdminCoursesFromResponse(coursesQuery.data), [coursesQuery.data]);
  const course = courses.find((item) => (item._id ?? item.id) === courseId);

  const handleUpdate = async (courseData) => {
    try {
      await updateMutation.mutateAsync({ courseId, courseData });
      toast.success("Course updated successfully");
      navigate("/admin/courses");
    } catch (error) {
      toast.error(error.message || "Unable to update course");
    }
  };

  if (coursesQuery.isLoading) return <PageLoader />;
  if (coursesQuery.isError) return <p className="text-sm text-red-600">{coursesQuery.error?.message || "Unable to load courses."}</p>;
  if (!course) return <p className="text-sm text-foreground-secondary">Course not found in the admin course list.</p>;

  return <div className="space-y-6"><PageHeader title="Edit Course" description={`Update ${course.name || "course"}.`} /><div className="rounded-2xl border border-border bg-surface p-5 sm:p-7  "><InstructorCourseForm initialData={course} onSubmit={handleUpdate} isSubmitting={updateMutation.isPending} submitLabel="Save course changes" /></div></div>;
}

export default AdminEditCourse;
