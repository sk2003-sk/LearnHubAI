# LearnHubAI - API Documentation

## 1. Overview

LearnHubAI communicates with its backend through HTTP API requests.

Axios is used for API communication.

## 2. API Configuration

Previously configured API base URL:

```text
https://mockapi-mauve.vercel.app
```

The authoritative configuration must be checked in the existing Axios configuration file.

Expected location:

```text
src/api/axios.js
```

Verify the following settings:

- Base URL
- Request headers
- Content-Type
- Authorization
- withCredentials
- Interceptors

## 3. Authentication API

The project has referenced the following authentication operations:

| Operation                   | Purpose                             |
| --------------------------- | ----------------------------------- |
| register                    | Register a new user                 |
| activate-user               | Activate an account                 |
| login                       | Authenticate a user                 |
| logout                      | End the user session                |
| refreshtoken                | Refresh authentication              |
| me                          | Retrieve current user               |
| social-auth                 | Social authentication               |
| update-user-info            | Update user information             |
| update-user-password        | Update password                     |
| update-user-profile-picture | Update profile picture              |
| get-all-user-dashboard      | Retrieve user dashboard data        |
| update-user-roles           | Update user roles                   |
| delete-user                 | Delete a user                       |
| 2FA setup                   | Configure two-factor authentication |
| 2FA verify                  | Verify two-factor authentication    |

Important:
These are operation names. Confirm the exact endpoint paths and HTTP methods in the actual API service files and backend documentation.

## 4. Course API

Document actual implemented endpoints for:

- Get all courses
- Get course details
- Create course
- Update course
- Delete course
- Search courses
- Filter courses
- Get instructor courses

Do not assume that all operations are supported by the backend.

## 5. Enrollment API

Document verified operations for:

- Create enrollment
- Get student enrollments
- Get course enrollments
- Get enrollment details
- Update enrollment status
- Track learning progress

## 6. Wishlist API

Document verified operations for:

- Get wishlist
- Add course
- Remove course
- Check wishlist status

## 7. Payment API

Document verified operations for:

- Initiate payment
- Verify payment
- Retrieve payment details
- Retrieve order history
- Process refund

## 8. Admin API

Document verified operations for:

- Dashboard statistics
- User management
- Instructor management
- Course management
- Enrollment management
- Order management
- Refund management

## 9. API Documentation Format

For every endpoint, document:

### Endpoint Name

- Method:
- URL:
- Authentication required:
- Required role:
- Request headers:
- Request parameters:
- Request body:
- Success response:
- Error response:

Example structure:

```http
GET /verified-endpoint
Authorization: Bearer <access-token>
```

The example above is illustrative, not an actual LearnHubAI endpoint.

## 10. Error Handling

Common HTTP status codes:

| Code | Meaning                                  |
| ---- | ---------------------------------------- |
| 200  | Successful request                       |
| 201  | Resource created                         |
| 204  | Successful request without response body |
| 400  | Bad request                              |
| 401  | Unauthorized                             |
| 403  | Forbidden                                |
| 404  | Resource not found                       |
| 409  | Conflict                                 |
| 500  | Internal server error                    |

## 11. Important Rules

- Never invent endpoint URLs.
- Never modify API payloads without checking backend requirements.
- Use existing API service modules.
- Handle API errors consistently.
- Keep endpoint documentation synchronized with implementation.
