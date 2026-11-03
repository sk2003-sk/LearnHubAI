# Enrollment API

## 1. Overview

Enrollment functionality manages the relationship between students and courses.

## 2. Student Enrollment

Expected operations:

- Retrieve enrolled courses.
- Retrieve enrollment details.
- Access purchased courses.
- View enrollment status.
- Track learning progress.

## 3. Enrollment Creation

Enrollment should be created according to the backend's defined business process.

For paid courses:

1. Student selects a course.
2. Student initiates payment.
3. Backend verifies payment.
4. Backend creates or confirms the applicable enrollment.
5. Student receives access to the course.

For free courses, follow the backend's actual enrollment rules.

## 4. Instructor Enrollment

Where authorized, instructors can:

- View students enrolled in their courses.
- View enrollment information.
- Monitor enrollment activity.

## 5. Admin Enrollment

Administrators should be able to:

- View enrollment records.
- Retrieve enrollment details.
- Manage enrollment operations where supported.
- Monitor enrollment information.

## 6. Enrollment Data

Verify actual backend response fields for:

- Enrollment ID
- Student ID
- Course ID
- Enrollment status
- Enrollment date
- Payment reference
- Progress information

## 7. Known Issue

Admin enrollment data has previously failed to display correctly.

Investigate:

- API endpoint.
- HTTP method.
- Authorization.
- Query parameters.
- Response structure.
- Data mapping.
- Loading and error states.

## 8. Testing

- [ ] Student enrollment works.
- [ ] Purchased courses are displayed.
- [ ] Duplicate enrollment is handled.
- [ ] Enrollment status is accurate.
- [ ] Admin enrollment data loads.
- [ ] Instructor permissions are respected.
