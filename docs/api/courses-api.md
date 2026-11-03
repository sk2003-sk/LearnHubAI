# Courses API

## 1. Overview

The Courses API manages educational course information in LearnHubAI.

## 2. Student Course Operations

Expected functionality:

- Retrieve available courses.
- Retrieve course details.
- Search courses.
- Filter courses.
- Retrieve course categories.
- Retrieve instructor information.

## 3. Instructor Course Operations

Expected functionality:

- Create courses.
- Update course information.
- Manage course content.
- Upload course assets.
- Manage course publishing status.

## 4. Admin Course Operations

Expected functionality:

- Retrieve all courses.
- View course details.
- Manage courses.
- Review course information.
- Perform authorized course operations.

## 5. API Integration

Use the existing Axios instance and course API service.

The previously observed course request included:

```text
courses?limit=100
```

Verify the complete URL, HTTP method, parameters, and response structure in the actual course API service.

## 6. Course Data

Document actual response fields, including:

- Course identifier
- Course title
- Description
- Thumbnail
- Price
- Category
- Instructor
- Duration
- Lessons
- Course status

Only document fields confirmed by the backend.

## 7. UI Requirements

- Display loading state.
- Display course cards.
- Display empty state.
- Handle API errors.
- Support pagination where implemented.
- Maintain responsive layouts.

## 8. Testing

- [ ] Course listing works.
- [ ] Course details work.
- [ ] Search works.
- [ ] Filters work.
- [ ] Instructor course management works.
- [ ] Admin course management works.
- [ ] Unauthorized operations are rejected.
