# AGENTS.md

# LearnHubAI - AI Development Instructions

## 1. Project Overview

LearnHubAI is a Learning Management System built using React and Vite.

The application supports three roles:

- Student
- Instructor
- Admin

Before making any changes, understand the existing project structure, components, API services, routing configuration, authentication context, and styling conventions.

## 2. Important Development Rules

- Always inspect existing code before modifying it.
- Follow the existing folder structure.
- Reuse existing components whenever possible.
- Avoid unnecessary code duplication.
- Do not create duplicate API service files.
- Do not introduce unnecessary dependencies.
- Do not rewrite working functionality without a clear reason.
- Preserve existing application behavior.
- Keep components reusable and maintainable.
- Use meaningful variable and function names.
- Handle loading, error, empty, and success states.
- Maintain responsive layouts.

## 3. API Integration Rules

- Use the existing Axios configuration.
- Use the existing API service modules.
- Never invent API endpoints.
- Refer to the actual backend API documentation.
- Maintain existing request and response structures.
- Handle HTTP errors properly.
- Avoid unnecessary duplicate API requests.
- Do not expose secret keys or credentials.

## 4. Authentication Rules

- Follow the existing AuthContext implementation.
- Maintain the existing login and logout flow.
- Handle token expiration and refresh behavior correctly.
- Protect authenticated routes.
- Verify user roles before accessing restricted pages.
- Do not rely only on frontend role checks for security.

## 5. Authorization Rules

### Student

Students can access student-specific features.

### Instructor

Instructors can access instructor-specific features and their permitted course management operations.

### Admin

Admins can access administrative features and management operations.

Never allow one role to access another role's restricted pages without authorization.

## 6. React Development Rules

- Use functional components.
- Use React Hooks appropriately.
- Avoid unnecessary useEffect calls.
- Use proper dependency arrays.
- Use stable keys when rendering lists.
- Avoid unnecessary component re-renders.
- Separate API logic from presentation when appropriate.

## 7. Styling Rules

- Use the existing Tailwind CSS setup.
- Maintain the existing project theme.
- Keep the interface responsive.
- Follow existing spacing, typography, and color conventions.
- Avoid introducing conflicting CSS frameworks.

## 8. Error Handling

Handle:

- Network errors
- Unauthorized requests
- Forbidden requests
- Server errors
- Invalid responses
- Empty data
- Loading states

Display meaningful error messages to users.

## 9. Before Completing Any Task

1. Inspect the affected files.
2. Understand existing dependencies.
3. Identify the root cause.
4. Implement the smallest appropriate change.
5. Check related components.
6. Test the affected functionality.
7. Verify that existing functionality still works.
8. Update relevant documentation.

## 10. Important Restrictions

- Never fabricate backend functionality.
- Never assume an API endpoint exists.
- Never hardcode authentication credentials.
- Never remove existing features without permission.
- Never replace the project's architecture unnecessarily.
- Never mark a feature complete without verifying it.
