/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import DashboardRedirect from "./DashboardRedirect";
import PageLoader from "../components/common/PageLoader";
import { ROUTES } from "../constants/routes";
import { USER_ROLES } from "../constants/roles";

const Login = lazy(() => import("../features/auth/pages/Login"));
const Register = lazy(() => import("../features/auth/pages/Register"));
const ActivateAccount = lazy(() => import("../features/auth/pages/ActivateAccount"));
const ForgotPassword = lazy(() => import("../features/auth/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../features/auth/pages/ResetPassword"));
const TwoFactorAuth = lazy(() => import("../features/auth/pages/TwoFactoruth"));
const Marketplace = lazy(() => import("../features/courses/pages/Marketplace"));
const CourseDetails = lazy(() => import("../features/courses/pages/CourseDetails"));
const Wishlist = lazy(() => import("../features/courses/pages/Wishlist"));
const SearchResults = lazy(() => import("../features/marketplace/pages/SearchResults"));
const Home = lazy(() => import("../features/home/pages/Home"));
const StudentDashboard = lazy(() => import("../features/student/dashboard/StudentDashboard"));
const MyLearning = lazy(() => import("../features/student/pages/MyLearning"));
const CourseLearning = lazy(() => import("../features/student/pages/CourseLearning"));
const MyCertificates = lazy(() => import("../features/student/certificates/MyCertificates"));
const CertificateDetails = lazy(() => import("../features/student/certificates/CertificateDetails"));
const InstructorDashboard = lazy(() => import("../features/instructor/dashboard/InstructorDashboard"));
const InstructorCourses = lazy(() => import("../features/instructor/courses/InstructorCourses"));
const CreateCourse = lazy(() => import("../features/instructor/courses/CreateCourse"));
const EditCourse = lazy(() => import("../features/instructor/courses/EditCourse"));
const Lecturemanager = lazy(() => import("../features/instructor/lectures/Lecturemanager"));
const InstructorStudents = lazy(() => import("../features/instructor/students/InstructorStudents"));
const InstructorAnalytics = lazy(() => import("../features/instructor/analytics/InstructorAnalytics"));
const AdminDashboard = lazy(() => import("../features/admin/dashboard/AdminDashboard"));
const AdminInstructors = lazy(() => import("../features/admin/instructors/Instructors"));
const AdminCreateCourse = lazy(() => import("../features/admin/courses/AdminCreateCourse"));
const AdminEditCourse = lazy(() => import("../features/admin/courses/AdminEditCourse"));
const StudentProgress = lazy(() => import("../features/student/progess/LearningProgress"));
const AssessmentPortal = lazy(() => import("../features/student/assessments/AssessmentPortal"));
const CourseManagement = lazy(() => import("../features/admin/courses/CourseManagement"));
const Users = lazy(() => import("../features/admin/users/Users"));
const Profile = lazy(() => import("../features/profile/pages/Profile"));
const HomepageSettings = lazy(() => import("../features/admin/settings/HomepageSettings"));
const Categories = lazy(() => import("../features/admin/categories/Categories"));
const Coupons = lazy(() => import("../features/admin/coupons/Coupons"));
const AdminNotifications = lazy(() => import("../features/admin/notifications/AdminNotifications"));
const AdminAnalytics = lazy(() => import("../features/admin/analytics/AdminAnalytics"));
const AdminOrders = lazy(() => import("../features/admin/orders/Orders"));
const AdminEnrollments = lazy(() => import("../features/admin/enrollments/Enrollments"));
const RefundManagement = lazy(() => import("../features/admin/orders/RefundManagement"));
const Checkout = lazy(() => import("../features/checkout/pages/Checkout"));
const PaymentSuccess = lazy(() => import("../features/checkout/pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("../features/checkout/pages/PaymentFailure"));

const page = (element) => <Suspense fallback={<PageLoader />}>{element}</Suspense>;
const rolePage = (Component, roles) => (
  <ProtectedRoute allowedRoles={roles}>{page(<Component />)}</ProtectedRoute>
);

export const routeConfig = [
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: page(<Login />) },
      { path: ROUTES.REGISTER, element: page(<Register />) },
      { path: ROUTES.ACTIVATE, element: page(<ActivateAccount />) },
      { path: ROUTES.FORGOT_PASSWORD, element: page(<ForgotPassword />) },
      { path: ROUTES.RESET_PASSWORD, element: page(<ResetPassword />) },
    ],
  },
  { path: ROUTES.MARKETPLACE, element: page(<Marketplace />) },
  { path: ROUTES.SEARCH, element: page(<SearchResults />) },
  { path: ROUTES.COURSE_DETAILS, element: page(<CourseDetails />) },
  { path: ROUTES.CHECKOUT, element: rolePage(Checkout, [USER_ROLES.USER]) },
  { path: ROUTES.PAYMENT_SUCCESS, element: page(<PaymentSuccess />) },
  { path: ROUTES.PAYMENT_FAILURE, element: page(<PaymentFailure />) },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardRedirect /> },
          { path: ROUTES.PROFILE, element: page(<Profile />) },
          { path: ROUTES.TWO_FACTOR, element: rolePage(TwoFactorAuth, [USER_ROLES.USER, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN]) },
          { path: ROUTES.WISHLIST, element: page(<Wishlist />) },
          { path: ROUTES.STUDENT_DASHBOARD, element: rolePage(StudentDashboard, [USER_ROLES.USER]) },
          { path: ROUTES.MY_LEARNING, element: rolePage(MyLearning, [USER_ROLES.USER]) },
          { path: ROUTES.COURSE_LEARNING, element: rolePage(CourseLearning, [USER_ROLES.USER]) },
          { path: ROUTES.CERTIFICATES, element: rolePage(MyCertificates, [USER_ROLES.USER]) },
          { path: ROUTES.CERTIFICATE_DETAILS, element: rolePage(CertificateDetails, [USER_ROLES.USER]) },
          { path: ROUTES.STUDENT_PROGRESS, element: rolePage(StudentProgress, [USER_ROLES.USER]) },
          { path: ROUTES.STUDENT_ASSESSMENTS, element: rolePage(AssessmentPortal, [USER_ROLES.USER]) },
          { path: ROUTES.INSTRUCTOR_DASHBOARD, element: rolePage(InstructorDashboard, [USER_ROLES.INSTRUCTOR]) },
          { path: ROUTES.INSTRUCTOR_COURSES, element: rolePage(InstructorCourses, [USER_ROLES.INSTRUCTOR]) },
          { path: ROUTES.INSTRUCTOR_COURSE_CREATE, element: rolePage(CreateCourse, [USER_ROLES.INSTRUCTOR]) },
          { path: ROUTES.INSTRUCTOR_COURSE_EDIT, element: rolePage(EditCourse, [USER_ROLES.INSTRUCTOR]) },
          { path: ROUTES.INSTRUCTOR_COURSE_LECTURES, element: rolePage(Lecturemanager, [USER_ROLES.INSTRUCTOR]) },
          { path: ROUTES.INSTRUCTOR_STUDENTS, element: rolePage(InstructorStudents, [USER_ROLES.INSTRUCTOR]) },
          { path: ROUTES.INSTRUCTOR_ANALYTICS, element: rolePage(InstructorAnalytics, [USER_ROLES.INSTRUCTOR]) },
          { path: ROUTES.ADMIN_DASHBOARD, element: rolePage(AdminDashboard, [USER_ROLES.ADMIN]) },
          { path: ROUTES.ADMIN_COURSES, element: rolePage(CourseManagement, [USER_ROLES.ADMIN]) },
          { path: ROUTES.ADMIN_USERS, element: rolePage(Users, [USER_ROLES.ADMIN]) },
          { path: ROUTES.ADMIN_INSTRUCTORS, element: rolePage(AdminInstructors, [USER_ROLES.ADMIN]) },
          { path: ROUTES.ADMIN_COURSE_CREATE, element: rolePage(AdminCreateCourse, [USER_ROLES.ADMIN]) },
          { path: ROUTES.ADMIN_COURSE_EDIT, element: rolePage(AdminEditCourse, [USER_ROLES.ADMIN]) },
          { path: ROUTES.ADMIN_SETTINGS, element: rolePage(HomepageSettings, [USER_ROLES.ADMIN]) },
          { path: ROUTES.ADMIN_CATEGORIES, element: rolePage(Categories, [USER_ROLES.ADMIN]) },
          { path: ROUTES.ADMIN_COUPONS, element: rolePage(Coupons, [USER_ROLES.ADMIN]) },
          { path: ROUTES.ADMIN_NOTIFICATIONS, element: rolePage(AdminNotifications, [USER_ROLES.ADMIN]) },
          { path: ROUTES.ADMIN_ANALYTICS, element: rolePage(AdminAnalytics, [USER_ROLES.ADMIN]) },
          { path: ROUTES.ADMIN_ORDERS, element: rolePage(AdminOrders, [USER_ROLES.ADMIN]) },
          { path: ROUTES.ADMIN_ENROLLMENTS, element: rolePage(AdminEnrollments, [USER_ROLES.ADMIN]) },
          { path: ROUTES.ADMIN_REFUNDS, element: rolePage(RefundManagement, [USER_ROLES.ADMIN]) },
        ],
      },
    ],
  },
  { path: ROUTES.HOME, element: page(<Home />) },
  { path: ROUTES.NOT_FOUND, element: <Navigate to={ROUTES.MARKETPLACE} replace /> },
];
