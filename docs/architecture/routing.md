# LearnHubAI - Routing Architecture

## 1. Overview

LearnHubAI uses React Router DOM for client-side navigation.

The routing system manages public routes, authentication routes, protected routes, and role-specific dashboards.

## 2. Routing Responsibilities

- Navigate between pages.
- Protect authenticated routes.
- Redirect unauthenticated users.
- Redirect users according to their roles.
- Prevent access to unauthorized dashboard sections.
- Support nested layouts.

## 3. Main Routing Components

### ProtectedRoute

Responsible for checking whether a user is authenticated before allowing access to protected routes.

### DashboardRedirect

Responsible for redirecting authenticated users to the appropriate dashboard based on their role.

### AuthLayout

Provides a shared layout for authentication-related pages.

### DashboardLayout

Provides a shared dashboard structure.

### PageLoader

Displays a loading interface while lazy-loaded pages or route content are loading.

## 4. Route Categories

### Public Routes

Examples:

- Home
- Courses
- Course details

### Authentication Routes

Examples:

- Login
- Registration
- Account activation

### Student Routes

Examples:

- Student dashboard
- My courses
- Wishlist
- Profile

### Instructor Routes

Examples:

- Instructor dashboard
- Course management
- Course content management

### Admin Routes

Examples:

- Admin dashboard
- Users
- Instructors
- Courses
- Enrollments
- Orders
- Refunds

These are logical route categories. Confirm exact URL paths in the route configuration.

## 5. Route Protection Flow

1. User requests a protected route.
2. ProtectedRoute checks authentication.
3. If authentication is unavailable, redirect to login.
4. If authentication exists, verify the required role.
5. If the role is valid, render the requested page.
6. Otherwise, redirect to an authorized page.

## 6. Lazy Loading

Use React lazy loading for pages where implemented.

Suspense should display an appropriate loading component while a page is loading.

## 7. Routing Rules

- Do not duplicate route definitions.
- Reuse existing layouts.
- Keep route paths centralized where appropriate.
- Verify permissions for every protected route.
- Do not rely exclusively on frontend route protection.
