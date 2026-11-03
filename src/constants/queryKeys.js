
export const queryKeys = {
    auth: {
        all: ["auth"],
        currentUser: () => ["auth", "currentUser"],
    },
    marketplace: {
        all: ["marketplace"],
        courses: () => ["marketplace", "courses"],
        course: (courseId) => ["marketplace", "course", courseId],
        categories: () => ["marketplace", "categories"],
        search: (filters) => ["marketplace", "search", filters],
    },
    student: {
        all: ["student"],
        dashboard: () => ["student", "dashboard"],
        courses: () => ["student", "courses"],
        course: (courseId) => ["student", "course", courseId],
        progress: (courseId) => ["student", "progress", courseId],
        wishlist: () => ["student", "wishlist"],
        certificates: () => ["student", "certificates"],
        reviews: () => ["student", "reviews"],
    },
    instructor: {
        all: ["instructor"],
        dashboard: () => ["instructor", "dashboard"],
        courses: () => ["instructor", "courses"],
        course: (courseId) => ["instructor", "course", courseId],
        students: () => ["instructor", "students"],
        analytics: () => ["instructor", "analytics"],
    },
    admin: {
        all: ["admin"],
        dashboard: () => ["admin", "dashboard"],
        users: () => ["admin", "users"],
        user: (userId) => ["admin", "user", userId],
        courses: () => ["admin", "courses"],
        orders: () => ["admin", "orders"],
        instructors: () => ["admin", "instructors"],
        categories: () => ["admin", "categories"],
        analytics: () => ["admin", "analytics"],
    },
    checkout: {
        all: ["checkout"],
        order: (orderId) => ["checkout", "order", orderId],
    },
};
