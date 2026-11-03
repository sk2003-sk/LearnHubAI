# LearnHubAI Security Policy

## 1. Overview

Security is important because LearnHubAI handles user accounts, course purchases, authentication, and administrative operations.

## 2. Authentication Security

- Use secure authentication mechanisms.
- Handle token expiration.
- Protect authenticated API requests.
- Clear authentication state on logout.
- Avoid exposing authentication credentials.

## 3. Authorization

The application supports Student, Instructor, and Admin roles.

Backend authorization must validate permissions for protected operations.

Frontend protected routes improve navigation security but are not a replacement for backend authorization.

## 4. Environment Variables

- Never commit secret keys.
- Never expose private API credentials.
- Keep sensitive configuration outside source control.
- Maintain an appropriate .gitignore file.
- Use separate configurations for development and production.

## 5. Payment Security

- Never trust frontend payment success alone.
- Verify payment status through the backend.
- Validate transaction references.
- Prevent duplicate purchase processing.
- Grant course access only after successful backend verification.
- Protect refund operations with appropriate permissions.

## 6. Input Validation

- Validate form inputs.
- Validate API request data on the backend.
- Handle unexpected responses.
- Avoid rendering untrusted HTML.

## 7. Error Handling

- Do not expose stack traces to users.
- Do not expose secrets in logs.
- Handle unauthorized requests.
- Handle forbidden requests.
- Provide safe error messages.

## 8. Reporting Security Issues

Security issues should be documented with:

- Description.
- Affected functionality.
- Severity.
- Reproduction steps.
- Suggested remediation.

Never publish passwords, access tokens, or private credentials in issue reports.
