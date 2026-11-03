import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle2, PlayCircle } from "lucide-react";
import { useCourse } from "../../courses/hooks/useCourses";
import {
  useStudentCourseContent,
  useUpdateLectureProgress,
  useCompleteLecture,
} from "../hook/useStudentLearning";
import { getCourseFromResponse } from "../../courses/utils/courseHelpers";
import { getLearningContentFromResponse } from "../utils/studentHelpers";
import { ROUTES } from "../../../constants/routes";
import Button from "../../../components/ui/Button";
import PageLoader from "../../../components/common/PageLoader";
import MyReviews from "../reviews/MyReviews";

function getYouTubeId(url) {
  const match = String(url ?? "").match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match?.[1] ?? null;
}

function CourseLearning() {
  const { courseId } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const lastSavedRef = useRef({ lectureId: null, seconds: 0 });

  const courseQuery = useCourse(courseId);
  const contentQuery = useStudentCourseContent(courseId);
  const progressMutation = useUpdateLectureProgress();
  const completeMutation = useCompleteLecture();

  const course = getCourseFromResponse(courseQuery.data);
  const lessons = getLearningContentFromResponse(contentQuery.data);
  const selectedLesson = lessons[selectedIndex];
  const lectureId = selectedLesson?._id || selectedLesson?.id;
  const lessonVideoUrl =
    selectedLesson?.videoUrl ||
    selectedLesson?.video ||
    selectedLesson?.demoUrl ||
    (selectedIndex === 0 ? course?.demoUrl : "");
  const youTubeId = getYouTubeId(lessonVideoUrl);

  useEffect(() => {
    lastSavedRef.current = {
      lectureId,
      seconds: 0,
    };
  }, [lectureId]);

  const saveProgress = (video, force = false) => {
    if (!lectureId || !video || video.currentTime <= 0) return;

    const watchedSeconds = Math.floor(video.currentTime);
    const previous = lastSavedRef.current;

    if (
      previous.lectureId === lectureId &&
      (!force || watchedSeconds <= previous.seconds) &&
      watchedSeconds - previous.seconds < 15
    ) {
      return;
    }

    lastSavedRef.current = {
      lectureId,
      seconds: watchedSeconds,
    };

    progressMutation.mutate({
      lectureId,
      watchedSeconds,
    });
  };

  const handleVideoEnded = (video) => {
    saveProgress(video, true);

    if (lectureId) {
      completeMutation.mutate(lectureId);
    }
  };

  if (courseQuery.isLoading || contentQuery.isLoading) {
    return <PageLoader />;
  }

  if (courseQuery.isError || contentQuery.isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <h2 className="font-semibold text-red-700 dark:text-red-300">
          Unable to load course content
        </h2>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          You may need to sign in again or verify that you have access to this
          course.
        </p>
        <Link to={ROUTES.MY_LEARNING} className="mt-4 inline-block">
          <Button variant="outline">
            <ArrowLeft size={16} />
            Back to My Learning
          </Button>
        </Link>
      </div>
    );
  }

  if (!course) {
    return <p className="text-muted">Course not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Link
        to={ROUTES.MY_LEARNING}
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground-secondary hover:text-foreground  dark:hover:text-accent"
      >
        <ArrowLeft size={17} />
        Back to My Learning
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-foreground ">
          {course.name}
        </h1>
        <p className="mt-2 text-sm text-foreground-secondary ">
          {course.description}
        </p>
      </div>

      {lessons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center  ">
          <BookOpen size={36} className="mx-auto text-brand-secondary" />
          <h2 className="mt-4 text-lg font-semibold text-foreground ">
            Course content is not available
          </h2>
          <p className="mt-2 text-sm text-foreground-secondary ">
            No recognized lessons were returned by the course content API.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0">
            <div className="overflow-hidden rounded-2xl bg-black">
              {youTubeId ? (
                <iframe
                  key={`${lectureId}-${youTubeId}`}
                  src={`https://www.youtube-nocookie.com/embed/${youTubeId}`}
                  title={selectedLesson?.title || selectedLesson?.name || "Lesson video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="aspect-video w-full"
                />
              ) : lessonVideoUrl ? (
                <video
                  key={lectureId || lessonVideoUrl}
                  src={lessonVideoUrl}
                  controls
                  onTimeUpdate={(event) => saveProgress(event.currentTarget)}
                  onPause={(event) => saveProgress(event.currentTarget, true)}
                  onEnded={(event) => handleVideoEnded(event.currentTarget)}
                  className="aspect-video w-full"
                />
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-3 text-white">
                  <PlayCircle size={48} />
                  <p className="text-sm">
                    No video URL available for this lesson
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-surface p-5  ">
              <h2 className="text-xl font-semibold text-foreground ">
                {selectedLesson?.title || selectedLesson?.name || "Lesson"}
              </h2>

              {selectedLesson?.description && (
                <p className="mt-3 text-sm leading-6 text-foreground-secondary ">
                  {selectedLesson.description}
                </p>
              )}

              {selectedLesson?.videoLength != null && (
                <p className="mt-3 text-xs text-foreground-secondary ">
                  Duration: {selectedLesson.videoLength} minutes
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {progressMutation.isPending && (
                  <span className="text-xs text-foreground-secondary ">
                    Saving learning progress...
                  </span>
                )}

                {progressMutation.isError && (
                  <span className="text-xs text-red-600 dark:text-red-400">
                    Progress could not be saved. Continue watching to retry.
                  </span>
                )}

                {completeMutation.isPending && (
                  <span className="text-xs text-foreground-secondary ">
                    Marking lesson complete...
                  </span>
                )}

                {completeMutation.isSuccess && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400">
                    <CheckCircle2 size={15} />
                    Lesson completed
                  </span>
                )}

                {completeMutation.isError && (
                  <span className="text-xs text-red-600 dark:text-red-400">
                    Could not mark this lesson complete. Please try again.
                  </span>
                )}
              </div>

              {completeMutation.isError && lectureId && (
                <Button
                  className="mt-3"
                  size="sm"
                  onClick={() => completeMutation.mutate(lectureId)}
                  loading={completeMutation.isPending}
                >
                  Retry completion
                </Button>
              )}
            </div>
          </section>

          <aside className="h-fit overflow-hidden rounded-2xl border border-border bg-surface  ">
            <div className="border-b border-border p-5 ">
              <h2 className="font-semibold text-foreground ">
                Course content
              </h2>
              <p className="mt-1 text-xs text-foreground-secondary ">
                {lessons.length} lessons
              </p>
            </div>

            <div className="max-h-150 overflow-y-auto p-3">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson._id || lesson.id || index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`mb-2 flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors ${
                    selectedIndex === index
                      ? "bg-surface-secondary "
                      : "hover:bg-background dark:hover:bg-surface-secondary"
                  }`}
                >
                  <PlayCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-brand-secondary"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground ">
                      {lesson.title || lesson.name || `Lesson ${index + 1}`}
                    </span>
                    {lesson.videoLength != null && (
                      <span className="mt-1 block text-xs text-foreground-secondary ">
                        {lesson.videoLength} min
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      <MyReviews courseId={courseId} />
    </div>
  );
}

export default CourseLearning;
