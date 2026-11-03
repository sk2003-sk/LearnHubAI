# LearnHubAI - Database Structure

## 1. Overview

This document describes the logical data entities required by LearnHubAI.

The actual database schema must be obtained from the backend implementation.

The frontend must not assume database field names or relationships without verifying the API responses.

## 2. Main Entities

### User

Represents a registered platform user.

Expected business information:

- User identifier
- Name
- Email
- Role
- Profile information
- Account status
- Created date

### Course

Represents an educational course.

Expected business information:

- Course identifier
- Course title
- Description
- Thumbnail
- Price
- Category
- Instructor reference
- Course status

### Enrollment

Represents a student's enrollment in a course.

Expected business information:

- Enrollment identifier
- Student reference
- Course reference
- Enrollment status
- Enrollment date
- Learning progress

### Wishlist

Represents courses saved by a student.

Expected business information:

- Wishlist identifier
- Student reference
- Course references

### Order

Represents a purchase transaction.

Expected business information:

- Order identifier
- Student reference
- Purchased items
- Total amount
- Payment status
- Order date

### Payment

Represents payment information.

Expected business information:

- Payment identifier
- Order reference
- Amount
- Payment status
- Transaction reference

### Refund

Represents a refund request or transaction.

Expected business information:

- Refund identifier
- Original order reference
- Refund amount
- Refund status
- Refund date

## 3. Logical Relationships

- A user may create multiple courses if authorized as an instructor.
- A student may enroll in multiple courses.
- A course may have multiple enrolled students.
- A student may save multiple courses in a wishlist.
- An order may contain one or more purchased items, depending on backend design.
- A payment may be associated with an order.
- A refund must reference an applicable payment or order.

## 4. Data Integrity

- Use valid identifiers.
- Validate relationships.
- Prevent duplicate enrollments where prohibited.
- Prevent unauthorized data modification.
- Verify payment status before granting purchase access.

## 5. Important Note

This is a logical domain model, not a confirmed database schema.

Update this document using actual backend models, schemas, database migrations, and API response structures.
