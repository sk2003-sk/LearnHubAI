import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { USER_ROLES } from "../constants/roles";
import { ROUTES } from "../constants/routes";

function DashboardRedirect() {
  const { user } = useAuth();

  const dashboardRoutes = {
    [USER_ROLES.USER]: ROUTES.STUDENT_DASHBOARD,
    [USER_ROLES.INSTRUCTOR]: ROUTES.INSTRUCTOR_DASHBOARD,
    [USER_ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
  };

  return <Navigate to={dashboardRoutes[user?.role] || ROUTES.LOGIN} replace />;
}

export default DashboardRedirect;
