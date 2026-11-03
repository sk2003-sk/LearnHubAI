# LearnHub - consolidated source update

## Applied changes

- Corrected the marketplace page import to match the actual `Marketplace.jsx` filename.
- Corrected the mobile navigation theme-toggle import.
- Reworked route registration to lazy-load page modules and added a shared page-loading fallback.
- Registered protected admin user management at `/admin/users` and exposed it in the admin sidebar.
- Added a profile overview at `/profile` using the authenticated session user object.
- Reworked the admin dashboard to show totals returned by the existing admin users and admin courses APIs.
- Made marketplace search handle both string and array course tags.
- Added a password recovery information page because the current verified backend contract does not provide a confirmed reset flow.
- Replaced the template README with project setup, scripts, architecture, and API notes.
- Cleaned `.env.example` so it contains only the API base URL.

## Existing working areas retained

The existing authentication, marketplace, student learning, instructor course and lecture workflows, instructor analytics, admin course management, and admin user management source files were retained. Existing API endpoint paths and payloads were not changed as part of this update.

## Backend-dependent features not enabled

The uploaded project and the verified API details available for this task do not provide enough contract information to safely implement these features end-to-end:

- Payment checkout and Stripe payment confirmation
- Coupon creation and redemption
- Homepage settings and notifications

These need the exact endpoint paths, request schemas, response schemas, and any external provider configuration. No guessed API routes or request fields have been added.

## Recently completed features

The following features have been implemented based on existing API contracts in the codebase:

- **Forgot Password** - Users can submit their email to request a password reset link
- **Reset Password** - Users can set a new password using a token from the reset email
- **Profile Editing** - Users can edit their name and email
- **Password Change** - Users can change their password from the profile page
- **Profile Picture Upload** - Users can upload a new profile picture
- **Refund Management** - Admin can process refunds for completed orders
- **Category Creation** - Admin can create new course categories (in addition to edit/delete)

## Validation status

- Relative source imports were checked after the changes; all resolve to existing files.
- The ZIP archive is validated for integrity.
- `npm run lint` and `npm run build` could not be executed in this environment because dependency installation (`npm ci`) timed out and left the local dependency binaries unavailable. Run both commands after extracting the archive and installing dependencies locally.
