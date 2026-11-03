# Authentication API

## 1. Overview

This document describes authentication-related API operations used by LearnHubAI.

## 2. API Configuration

Base URL:

https://mockapi-mauve.vercel.app

Verify the current value in the Axios configuration before making changes.

## 3. Authentication Operations

### Register

Purpose:
Create a new user account.

Expected frontend functionality:

- Collect registration information.
- Validate form inputs.
- Submit registration request.
- Handle successful registration.
- Handle validation errors.

### Activate User

Purpose:
Activate a newly registered account.

### Login

Purpose:
Authenticate an existing user.

Expected functionality:

- Submit credentials.
- Handle authentication response.
- Update AuthContext.
- Navigate according to user role.

### Logout

Purpose:
End the authenticated session.

### Refresh Token

Purpose:
Refresh authentication when the access token expires.

### Current User

Purpose:
Retrieve information about the currently authenticated user.

### Social Authentication

Purpose:
Support external authentication providers where configured.

### Update User Information

Purpose:
Update user profile information.

### Update User Password

Purpose:
Change the user's password.

### Update Profile Picture

Purpose:
Update the user's profile picture.

### Get All User Dashboard

Purpose:
Retrieve user dashboard information.

### Update User Roles

Purpose:
Update user roles through authorized administrative operations.

### Delete User

Purpose:
Delete a user through authorized operations.

### Two-Factor Authentication

Operations:

- Setup
- Verify

## 4. API Implementation

Authentication API functions should be organized using the existing authentication service module.

The actual module path must be verified in the project.

## 5. Error Handling

Handle:

- Invalid credentials
- Unauthorized access
- Expired token
- Invalid refresh token
- Account activation errors
- Validation errors
- Network errors
- Server errors

## 6. Testing Checklist

- [ ] Registration works.
- [ ] Account activation works.
- [ ] Login works.
- [ ] Logout works.
- [ ] Token refresh works.
- [ ] Current-user request works.
- [ ] Profile update works.
- [ ] Password update works.
- [ ] Role authorization works.
- [ ] Invalid credentials are handled correctly.

## 7. Important

Operation names are not guaranteed URL paths.

Use the actual backend API documentation and existing API service implementations to verify methods, paths, parameters, and response structures.
