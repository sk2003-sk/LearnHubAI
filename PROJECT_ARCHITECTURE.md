# LearnHubAI - Project Architecture

## 1. Architecture Overview

LearnHubAI follows a component-based frontend architecture using React.

The application separates:

- Pages
- Reusable components
- Layouts
- Context providers
- API services
- Routing
- Shared utilities
- Static assets

## 2. Main Application Layers

### Presentation Layer

Responsible for displaying the user interface.

Includes:

- Pages
- Components
- Layouts
- Forms
- Tables
- Dashboards

### Routing Layer

Responsible for:

- Public routes
- Authentication routes
- Protected routes
- Role-based navigation
- Dashboard redirection

### Authentication Layer

Responsible for:

- Login state
- Registration state
- User information
- Token handling
- Logout
- Authentication context

### API Layer

Responsible for:

- HTTP communication
- API requests
- Response handling
- Error handling
- Axios configuration

### Feature Layer

Organizes application functionality by domain.

Examples:

- Authentication
- Courses
- Enrollment
- Payments
- Wishlist
- Administration

## 3. Technology Architecture

Frontend:

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router DOM
- Axios

Backend:

- Existing configured backend API

The backend is responsible for data persistence, business logic, authentication validation, authorization, and payment verification.

## 4. Application Flow

1. User opens the application.
2. React initializes the application.
3. Authentication context initializes user state.
4. Router determines the requested route.
5. Protected routes validate authentication.
6. Role-based routing determines dashboard access.
7. Components request data through API services.
8. API responses update the interface.

## 5. Design Principles

- Separation of concerns
- Reusable components
- Centralized API communication
- Role-based access control
- Maintainable code
- Responsive UI
- Consistent error handling

## 6. Important Architecture Rule

All new functionality must follow the existing application architecture.

Before introducing a new service, context, layout, or routing strategy, inspect the existing implementation.
