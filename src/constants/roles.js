
export const USER_ROLES = {
    USER: "user",
    INSTRUCTOR: "instructor",
    ADMIN: "admin",
};

export const ROLE_LABELS = {
    [USER_ROLES.USER]: "Student",
    [USER_ROLES.INSTRUCTOR]: "Instructor",
    [USER_ROLES.ADMIN]: "Administrator",
};

export const hasRole = (user, role) => user?.role === role;

export const isAdmin = (user) => hasRole(user, USER_ROLES.ADMIN);

export const isInstructor = (user) =>
    hasRole(user, USER_ROLES.INSTRUCTOR);

export const isStudent = (user) => hasRole(user, USER_ROLES.USER);
