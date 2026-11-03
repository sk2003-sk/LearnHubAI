# LearnHubAI - Application Data Flow

## 1. Overview

LearnHubAI uses React components and API services to retrieve and update application data.

## 2. General Data Flow

1. User interacts with a component.
2. Component triggers an action.
3. Relevant API service is called.
4. Axios sends the HTTP request.
5. Backend processes the request.
6. Backend returns a response.
7. Application updates its state.
8. React renders the updated interface.

## 3. Authentication Data Flow

1. User submits login information.
2. Login API is called.
3. Backend validates credentials.
4. Authentication information is returned.
5. AuthContext updates authentication state.
6. Router determines the appropriate destination.
7. Protected pages become accessible according to authorization rules.

## 4. Course Data Flow

1. User opens the course catalogue.
2. Course API is requested.
3. Course information is returned.
4. Component updates course state.
5. Courses are displayed.
6. User can open course details.

## 5. Wishlist Data Flow

1. User clicks the wishlist action.
2. Wishlist API is called.
3. Backend processes the operation.
4. Wishlist information is updated.
5. UI reflects the updated wishlist.

## 6. Payment and Enrollment Data Flow

1. Student selects a course.
2. Student initiates payment.
3. Backend or payment provider processes payment.
4. Payment is verified by the backend.
5. Purchase or enrollment record is created according to backend business logic.
6. Student's purchased-course information is refreshed.
7. Course access is granted according to backend authorization.

## 7. Admin Data Flow

1. Admin opens a management page.
2. Relevant admin API is called.
3. Backend validates admin permissions.
4. Backend returns management data.
5. UI displays records.
6. Admin performs an authorized operation.
7. Updated information is retrieved or reflected in the UI.

## 8. Error Handling

Every API-driven feature should handle:

- Loading
- Success
- Empty response
- Unauthorized response
- Forbidden response
- Network failure
- Server failure

## 9. Important Rule

Actual request and response structures must match the backend implementation.
