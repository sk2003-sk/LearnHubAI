# LearnHubAI - Authentication and Authorization

## 1. Overview

Authentication identifies users, while authorization determines what resources and features they can access.

LearnHubAI supports three roles:

- Student
- Instructor
- Admin

## 2. Registration Flow

1. User opens the registration page.
2. User enters required information.
3. Frontend validates the form.
4. Registration API is called.
5. Backend processes registration.
6. Activation token or activation information is received.
7. User proceeds to account activation.
8. Account activation is completed through the backend.

## 3. Login Flow

1. User enters email and password.
2. Frontend validates the form.
3. Login API is called.
4. Backend validates credentials.
5. Authentication information is returned.
6. Frontend updates authentication state.
7. User is redirected according to their role.

## 4. Token Management

The application has an existing Axios configuration responsible for API communication.

Document the actual implementation of:

- Access-token storage.
- Refresh-token storage or cookies.
- Authorization header.
- Request interceptor.
- Response interceptor.
- Token expiration.
- Refresh-token failure.
- Logout cleanup.

Do not assume that access tokens and refresh tokens are stored in the same location.

## 5. Current User Flow

The current-user operation retrieves authenticated user information.

The application should:

1. Initialize authentication state.
2. Retrieve current user information when required.
3. Update the authentication context.
4. Determine the user's role.
5. Display the appropriate dashboard.

## 6. Protected Routes

Protected routes prevent unauthenticated users from accessing private pages.

The existing routing implementation includes:

- ProtectedRoute
- DashboardRedirect
- Role-based route handling

Verify the actual routing behavior before modifying these components.

## 7. Role-Based Authorization

### Student

Allowed functionality:

- Student dashboard
- Course browsing
- Wishlist
- Purchases
- Learning access
- Profile management

### Instructor

Allowed functionality:

- Instructor dashboard
- Course management
- Student information for permitted courses
- Instructor profile

### Admin

Allowed functionality:

- Admin dashboard
- User management
- Instructor management
- Course administration
- Enrollment administration
- Order administration
- Refund administration

## 8. Logout Flow

1. User clicks logout.
2. Logout operation is executed when required by the backend.
3. Authentication information is cleared according to the existing strategy.
4. User state is reset.
5. User is redirected to the login or public page.

## 9. Security Considerations

- Validate authorization on the backend.
- Do not trust frontend role information alone.
- Handle token expiration.
- Protect private API requests.
- Never expose secrets.
- Prevent unauthorized dashboard access.

## 10. Authentication Testing

Test:

- Valid login.
- Invalid login.
- Registration.
- Account activation.
- Logout.
- Page refresh.
- Expired access token.
- Invalid refresh token.
- Unauthorized API request.
- Role-based access.
- Direct URL access to restricted pages.
