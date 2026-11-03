import { useMemo } from "react";
import { Users, Mail, BookOpen } from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import { useInstructorStudents } from "../hook/useInstructior";

const extractStudents = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.students)) return response.students;
  if (Array.isArray(response?.data?.students)) return response.data.students;
  if (Array.isArray(response?.users)) return response.users;
  if (Array.isArray(response?.data?.users)) return response.data.users;
  if (Array.isArray(response?.enrollments)) return response.enrollments;
  if (Array.isArray(response?.data?.enrollments)) return response.data.enrollments;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

function InstructorStudents() {
  const { data, isLoading, isError, error } = useInstructorStudents();

  const students = useMemo(() => extractStudents(data), [data]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Students"
        description="View students associated with your instructor account."
      />

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error?.response?.data?.message ||
            error?.message ||
            "Unable to load students."}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-5  ">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground-secondary">Total students</p>
                <Users className="text-brand-secondary" size={21} />
              </div>

              <p className="mt-3 text-3xl font-semibold text-foreground ">
                {students.length}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface  ">
            <div className="border-b border-border p-5 ">
              <h2 className="font-semibold text-foreground ">
                Student list
              </h2>
            </div>

            {students.length === 0 ? (
              <div className="p-10 text-center">
                <Users size={36} className="mx-auto mb-3 text-foreground-secondary" />
                <p className="font-medium text-foreground ">
                  No students found
                </p>
                <p className="mt-1 text-sm text-foreground-secondary">
                  Students will appear here when the API returns enrollment
                  data.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-150 text-left text-sm">
                  <thead className="bg-surface-secondary text-foreground-secondary  ">
                    <tr>
                      <th className="px-5 py-4 font-medium">Student</th>
                      <th className="px-5 py-4 font-medium">Email</th>
                      <th className="px-5 py-4 font-medium">Course</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border ">
                    {students.map((student, index) => {
                      const user = student.user || student.student || student.userId || {};
                      const course = student.course || student.courseId || {};

                      return (
                        <tr
                          key={student._id || student.id || index}
                          className="text-foreground "
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-secondary font-semibold text-foreground  ">
                                {(user.name || "S").charAt(0).toUpperCase()}
                              </div>

                              <span className="font-medium">
                                {user.name || user.fullName || (typeof user === "string" ? `User ${user.slice(-8)}` : "Student details unavailable")}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="flex items-center gap-2 text-foreground-secondary">
                              <Mail size={15} />
                              {user.email || "Not provided"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="flex items-center gap-2">
                              <BookOpen size={15} className="text-brand-secondary" />
                              {course.name ||
                                course.title ||
                                student.courseName ||
                                (typeof course === "string" ? `Course ${course.slice(-8)}` : "Course information unavailable")}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default InstructorStudents;
