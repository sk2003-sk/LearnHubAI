export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    ACTIVATE: "/activate",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    TWO_FACTOR: "/two-factor",

    DASHBOARD: "/dashboard",
    STUDENT_DASHBOARD: "/student/dashboard",
    INSTRUCTOR_DASHBOARD: "/instructor/dashboard",
    ADMIN_DASHBOARD: "/admin/dashboard",

    INSTRUCTOR_COURSES: "/instructor/courses",
    INSTRUCTOR_COURSE_CREATE: "/instructor/courses/create",
    INSTRUCTOR_COURSE_EDIT: "/instructor/courses/:courseId/edit",

    MARKETPLACE: "/marketplace",
    COURSE_DETAILS: "/marketplace/:courseId",
    SEARCH: "/search",
    WISHLIST: "/wishlist",

    MY_LEARNING: "/student/learning",
    COURSE_LEARNING: "/student/learning/:courseId",

    CERTIFICATES: "/student/certificates",
    CERTIFICATE_DETAILS: "/student/certificates/:certificateId",

    PROFILE: "/profile",
    NOT_FOUND: "*",

    INSTRUCTOR_COURSE_LECTURES: "/instructor/courses/:courseId/lectures",
    INSTRUCTOR_STUDENTS: "/instructor/students",

    INSTRUCTOR_ANALYTICS: "/instructor/analytics",

    ADMIN_COURSES: "/admin/courses",
    ADMIN_USERS: "/admin/users",
    ADMIN_INSTRUCTORS: "/admin/instructors",
    ADMIN_COURSE_CREATE: "/admin/courses/create",
    ADMIN_COURSE_EDIT: "/admin/courses/:courseId/edit",
    ADMIN_SETTINGS: "/admin/settings",
    ADMIN_CATEGORIES: "/admin/categories",
    ADMIN_COUPONS: "/admin/coupons",
    ADMIN_NOTIFICATIONS: "/admin/notifications",
    ADMIN_ANALYTICS: "/admin/analytics",
    ADMIN_ORDERS: "/admin/orders",
    ADMIN_ENROLLMENTS: "/admin/enrollments",
    ADMIN_REFUNDS: "/admin/refunds",

    CHECKOUT: "/checkout/:courseId",
    PAYMENT_SUCCESS: "/payment/success",
    PAYMENT_FAILURE: "/payment/failure",
    STUDENT_PROGRESS: "/student/progress",
    STUDENT_ASSESSMENTS: "/student/assessments",
};