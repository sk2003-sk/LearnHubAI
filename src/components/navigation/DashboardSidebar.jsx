import {
  Award,
  BookOpen,
  Heart,
  Layout,
  LayoutDashboard,
  Shield,
  Users,
  GraduationCap,
  ChartNoAxesCombined,
  ClipboardCheck,
  ShieldCheck,
  UserRound,
  Tag,
  Bell,
  ShoppingCart,
  LayoutGrid,
  DollarSign,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { USER_ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { cn } from "../../utils/cn";

const commonTail = [
  {
    label: "Profile Settings",
    path: ROUTES.PROFILE,
    icon: UserRound,
    end: true,
  },
  {
    label: "Account Security",
    path: ROUTES.TWO_FACTOR,
    icon: ShieldCheck,
    end: true,
  },
  {
    label: "Wishlist",
    path: ROUTES.WISHLIST,
    icon: Heart,
    end: true,
  },
];

function buildNavigation(role) {
  if (role === USER_ROLES.INSTRUCTOR) {
    return [
      {
        label: "Dashboard",
        path: ROUTES.INSTRUCTOR_DASHBOARD,
        icon: LayoutDashboard,
        end: true,
      },
      {
        label: "My Courses",
        path: ROUTES.INSTRUCTOR_COURSES,
        icon: GraduationCap,
        end: true,
      },
      {
        label: "Students",
        path: ROUTES.INSTRUCTOR_STUDENTS,
        icon: Users,
        end: true,
      },
      {
        label: "Analytics",
        path: ROUTES.INSTRUCTOR_ANALYTICS,
        icon: ChartNoAxesCombined,
        end: true,
      },
      ...commonTail,
    ];
  }

  if (role === USER_ROLES.ADMIN) {
    return [
      {
        label: "Admin",
        path: ROUTES.ADMIN_DASHBOARD,
        icon: Shield,
        end: true,
      },
      {
        label: "Users",
        path: ROUTES.ADMIN_USERS,
        icon: Users,
        end: true,
      },
      {
        label: "Instructors",
        path: ROUTES.ADMIN_INSTRUCTORS,
        icon: GraduationCap,
        end: true,
      },
      {
        label: "Courses",
        path: ROUTES.ADMIN_COURSES,
        icon: BookOpen,
        end: true,
      },
      {
        label: "Orders",
        path: ROUTES.ADMIN_ORDERS,
        icon: ShoppingCart,
        end: true,
      },
      {
        label: "Enrollments",
        path: ROUTES.ADMIN_ENROLLMENTS,
        icon: Award,
        end: true,
      },
      {
        label: "Categories",
        path: ROUTES.ADMIN_CATEGORIES,
        icon: LayoutGrid,
        end: true,
      },
      {
        label: "Coupons",
        path: ROUTES.ADMIN_COUPONS,
        icon: Tag,
        end: true,
      },
      {
        label: "Notifications",
        path: ROUTES.ADMIN_NOTIFICATIONS,
        icon: Bell,
        end: true,
      },
      {
        label: "Analytics",
        path: ROUTES.ADMIN_ANALYTICS,
        icon: ChartNoAxesCombined,
        end: true,
      },
      {
        label: "Layout",
        path: ROUTES.ADMIN_SETTINGS,
        icon: Layout,
        end: true,
      },
      {
        label: "Refunds",
        path: ROUTES.ADMIN_REFUNDS,
        icon: DollarSign,
        end: true,
      },
      ...commonTail,
    ];
  }

  // Student (default)
  return [
    {
      label: "My Learning",
      path: ROUTES.MY_LEARNING,
      icon: BookOpen,
      end: false,
    },
    {
      label: "Profile Settings",
      path: ROUTES.PROFILE,
      icon: UserRound,
      end: true,
    },
    {
      label: "Dashboard",
      path: ROUTES.STUDENT_DASHBOARD,
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "My Certificates",
      path: ROUTES.CERTIFICATES,
      icon: Award,
      end: false,
    },
    {
      label: "Learning Progress",
      path: ROUTES.STUDENT_PROGRESS,
      icon: ChartNoAxesCombined,
      end: true,
    },
    {
      label: "Assessments",
      path: ROUTES.STUDENT_ASSESSMENTS,
      icon: ClipboardCheck,
      end: true,
    },
    {
      label: "Account Security",
      path: ROUTES.TWO_FACTOR,
      icon: ShieldCheck,
      end: true,
    },
    {
      label: "Wishlist",
      path: ROUTES.WISHLIST,
      icon: Heart,
      end: true,
    },
  ];
}

function DashboardSidebar({ onNavigate }) {
  const { user } = useAuth();
  const navigation = buildNavigation(user?.role);

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="shrink-0 border-b border-border px-5 py-4 pr-12 md:pr-5">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-brand-secondary" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-secondary">
            Workspace
          </p>
        </div>
        <p className="mt-2 truncate text-sm font-semibold text-foreground">
          {user?.name || "LearnHub"}
        </p>
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-4"
      >
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground",
                )
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-border p-4">
        <div className="rounded-xl bg-surface-secondary p-3.5">
          <p className="text-sm font-semibold text-foreground">LearnHub</p>
          <p className="mt-0.5 text-xs text-foreground-secondary">
            Learn. Build. Grow.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebar;
