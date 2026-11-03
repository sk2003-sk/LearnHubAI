# LearnHubAI - Folder Structure

## 1. Overview

LearnHubAI uses a modular React project structure to separate application pages, reusable components, layouts, features, API services, and shared utilities.

## 2. Main Directories

### public/

Contains static assets that are served directly.

### src/

Contains the main application source code.

### src/assets/

Contains images, icons, fonts, and other application assets.

### src/components/

Contains reusable UI components.

Examples:

- Navigation components
- Buttons
- Forms
- Loaders
- Shared tables

### src/layouts/

Contains reusable page layouts.

Examples:

- Authentication layout
- Dashboard layout
- Admin layout
- Instructor layout

### src/pages/

Contains route-level pages.

Examples:

- Home
- Courses
- Login
- SignUp
- Dashboard

### src/features/

Contains functionality organized by application domain.

Examples:

- Authentication
- Courses
- Enrollment
- Payments
- Wishlist

### src/api/

Contains Axios configuration and API service modules.

### src/context/

Contains shared React context providers.

### src/routes/

Contains route configuration and route protection logic.

### src/constants/

Contains shared application constants.

### src/hooks/

Contains reusable custom React Hooks, where implemented.

### src/utils/

Contains reusable utility functions.

## 3. Organization Rules

- Keep related functionality together.
- Avoid duplicate components.
- Separate API communication from UI components.
- Keep shared components reusable.
- Follow existing naming conventions.

## 4. Important Rule

The actual source-code folder structure is authoritative.

Update this document whenever folders or major modules are added, removed, or reorganized.
