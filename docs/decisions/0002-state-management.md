# ADR 0002 - State Management Strategy

## Status

Existing implementation - Review required.

## Context

LearnHubAI contains shared and feature-specific application state.

Examples:

- Authentication information.
- Current user.
- Course data.
- Wishlist data.
- Enrollment information.
- Dashboard data.
- UI loading and error states.

## State Management Responsibilities

### Authentication Context

The existing AuthContext is responsible for shared authentication-related state.

It should manage the information required by:

- Login.
- Logout.
- Current user.
- Authentication status.
- Role-based application behavior.

### Component State

React component state should handle local UI information.

Examples:

- Form values.
- Modal visibility.
- Selected filters.
- Pagination state.
- Temporary loading indicators.

### API Data

Server data should be retrieved through the existing API service modules.

Avoid duplicating the same data in multiple state locations without a clear requirement.

## Best Practices

- Keep state close to where it is used.
- Share state only when necessary.
- Avoid unnecessary state duplication.
- Handle asynchronous operations carefully.
- Keep loading and error states consistent.

## Important

Document additional libraries such as Redux Toolkit or TanStack Query only if they are actually installed and used in the project.

Do not introduce a new state-management library unnecessarily.
