import { useAuth } from "../../features/auth/hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import { USER_ROLES } from "../../constants/roles";

export function usePrimaryNav() {
  const { user, isAuthenticated } = useAuth();
  const role = user?.role;

  const items = [
    { label: "Home", path: ROUTES.HOME, end: true },
    { label: "Courses", path: ROUTES.MARKETPLACE },
  ];

  if (isAuthenticated) {
    if (role === USER_ROLES.ADMIN) {
      items.push({ label: "Admin", path: ROUTES.ADMIN_DASHBOARD });
    } else {
      items.push({ label: "Dashboard", path: ROUTES.DASHBOARD });
    }

    if (role === USER_ROLES.INSTRUCTOR) {
      items.push({ label: "Instructor", path: ROUTES.INSTRUCTOR_DASHBOARD });
    }
  }

  return items;
}
