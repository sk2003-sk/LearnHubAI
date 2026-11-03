
export const unwrapAnalytics = (response) =>
    response?.data?.data ?? response?.data ?? response ?? {};

export const getMetric = (source, keys) => {
    for (const key of keys) {
        const value = source?.[key];

        if (typeof value === "number" && Number.isFinite(value)) {
            return value;
        }

        if (
            typeof value === "string" &&
            value.trim() !== "" &&
            Number.isFinite(Number(value))
        ) {
            return Number(value);
        }

        if (Array.isArray(value)) {
            return value.length;
        }
    }

    return null;
};

export const getCourseArray = (response) => {
    const data = unwrapAnalytics(response);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.courses)) return data.courses;
    if (Array.isArray(data?.data?.courses)) return data.data.courses;

    return [];
};

export const getRevenueArray = (response) => {
    const data = unwrapAnalytics(response);

    if (Array.isArray(data?.byCourse)) return data.byCourse;
    if (Array.isArray(data?.data?.byCourse)) return data.data.byCourse;

    return [];
};

export const formatMetric = (value) =>
    value === null || value === undefined
        ? "—"
        : Number(value).toLocaleString("en-IN");

export const getCourseName = (course, index = 0) =>
    course?.course?.name ||
    course?.courseName ||
    course?.name ||
    course?.title ||
    `Course ${index + 1}`;
