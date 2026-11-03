import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BookOpen, PlayCircle, Video } from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import CreateLecture from "./CreateLecture";
import {
  useInstructorCourseSections,
  useInstructorCourses,
  useSectionLectures,
} from "../hook/useInstructior";

const extractCourses = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.courses)) return response.courses;
  if (Array.isArray(response?.data?.courses)) return response.data.courses;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const extractSections = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.sections)) return response.sections;
  if (Array.isArray(response?.data?.sections)) return response.data.sections;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const extractLectures = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.lectures)) return response.lectures;
  if (Array.isArray(response?.data?.lectures)) return response.data.lectures;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

function Lecturemanager() {
  const { courseId: routeCourseId } = useParams();
  const { data: coursesResponse, isLoading: coursesLoading } =
    useInstructorCourses();

  const courses = useMemo(
    () => extractCourses(coursesResponse),
    [coursesResponse],
  );

  const [selectedCourseId, setSelectedCourseId] = useState(routeCourseId || "");

  const activeCourseId =
    selectedCourseId ||
    routeCourseId ||
    courses[0]?._id ||
    courses[0]?.id ||
    "";

  const { data: sectionsResponse, isLoading: sectionsLoading } =
    useInstructorCourseSections(activeCourseId);

  const sections = useMemo(
    () => extractSections(sectionsResponse),
    [sectionsResponse],
  );

  const [selectedSectionId, setSelectedSectionId] = useState("");

  const activeSectionId =
    selectedSectionId || sections[0]?._id || sections[0]?.id || "";

  const { data: lecturesResponse, isLoading: lecturesLoading } =
    useSectionLectures(activeSectionId);

  const lectures = useMemo(
    () => extractLectures(lecturesResponse),
    [lecturesResponse],
  );

  if (coursesLoading) return <PageLoader />;

  const inputClass =
    "w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-foreground outline-none   ";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Lecture Management"
        description="Organize course sections and create learning lectures."
      />

      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-surface p-5  ">
          <div className="mb-5 flex items-center gap-3">
            <Video className="text-brand-secondary" size={22} />
            <h2 className="text-lg font-semibold text-foreground ">
              Create a lecture
            </h2>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-foreground ">
              Select course
            </label>

            <select
              value={activeCourseId}
              onChange={(event) => {
                setSelectedCourseId(event.target.value);
                setSelectedSectionId("");
              }}
              className={inputClass}
            >
              <option value="">Select a course</option>
              {courses.map((course) => {
                const id = course._id || course.id;

                return (
                  <option key={id} value={id}>
                    {course.name || course.title || "Untitled course"}
                  </option>
                );
              })}
            </select>
          </div>

          {activeCourseId ? (
            <CreateLecture courseId={activeCourseId} sections={sections} />
          ) : (
            <p className="text-sm text-foreground-secondary">
              Create or select a course before adding lectures.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5  ">
          <div className="mb-5 flex items-center gap-3">
            <BookOpen className="text-brand-secondary" size={22} />
            <h2 className="text-lg font-semibold text-foreground ">
              Course lectures
            </h2>
          </div>

          {!activeCourseId ? (
            <p className="text-sm text-foreground-secondary">
              Select a course to view its sections.
            </p>
          ) : sectionsLoading ? (
            <PageLoader />
          ) : sections.length === 0 ? (
            <p className="text-sm text-foreground-secondary">
              No sections are currently available for this course.
            </p>
          ) : (
            <>
              <label className="mb-2 block text-sm font-medium text-foreground ">
                Select section
              </label>

              <select
                value={activeSectionId}
                onChange={(event) => setSelectedSectionId(event.target.value)}
                className={inputClass}
              >
                {sections.map((section, index) => {
                  const id = section._id || section.id;

                  return (
                    <option key={id || index} value={id}>
                      {section.title ||
                        section.name ||
                        section.videoSection ||
                        `Section ${index + 1}`}
                    </option>
                  );
                })}
              </select>

              <div className="mt-5 space-y-3">
                {lecturesLoading ? (
                  <PageLoader />
                ) : lectures.length === 0 ? (
                  <p className="rounded-xl bg-surface-secondary p-4 text-sm text-foreground-secondary  ">
                    No lectures found in this section yet.
                  </p>
                ) : (
                  lectures.map((lecture, index) => (
                    <div
                      key={lecture._id || lecture.id || index}
                      className="flex items-start gap-3 rounded-xl border border-border p-4 "
                    >
                      <PlayCircle
                        size={20}
                        className="mt-0.5 shrink-0 text-brand-secondary"
                      />

                      <div className="min-w-0">
                        <p className="font-medium text-foreground ">
                          {lecture.title || `Lecture ${index + 1}`}
                        </p>

                        {lecture.description && (
                          <p className="mt-1 text-sm text-foreground-secondary">
                            {lecture.description}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-foreground-secondary">
                          {lecture.isPreview
                            ? "Preview available"
                            : "Enrolled students only"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Lecturemanager;
