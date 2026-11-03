# LearnHub - functional update

## Admin updates

- Admin course management now reads the shared nested API response formats instead of relying on a shallow `data.courses` check.
- Admin order management and refund management now use the documented `GET /api/v1/lms/admin/orders` endpoint.
- Admin enrollment management uses the documented `GET /api/v1/lms/admin/enrollments` endpoint and handles nested response wrappers and populated user/course/order values.
- Admin category loading uses the documented `GET /api/v1/lms/categories` endpoint.
- Refund processing uses the documented `POST /api/v1/lms/payments/refund` endpoint with `{ orderId }`. The documented operation is a full refund; amount and reason fields are not invented.
- Order, enrollment, and analytics queries are invalidated after refunds and successful payment verification.

## Student updates

- Student learning now checks the documented aggregate `GET /api/v1/lms/my-learning` endpoint as well as orders and enrollments, then resolves course details when the aggregate response contains IDs rather than populated courses.
- Successful Stripe payment is followed by the documented `POST /api/v1/lms/payments/verify` operation with `paymentIntentId` and `courseId`. When the backend returns a simulated `pi_mock_` intent, checkout switches to a test-payment confirmation that completes through the documented `POST /api/v1/order/create-order` operation, which creates the order and enrollment. On success, student orders, enrollments, My Learning, progress, certificates, and admin order/enrollment data are invalidated so the purchased course appears in My Learning.
- Wishlist uses the documented `GET /api/v1/lms/wishlist` and `POST /api/v1/lms/wishlist` operations. Wishlist buttons are available on marketplace cards and course details, use an optimistic cache update, and restore the prior cache if the request fails. The wishlist page hydrates saved course IDs, supports removal, and links each course to checkout.
- Certificates and progress now use shared response extractors to support nested backend response wrappers.
- Learning Progress falls back to progress stored on the user's enrollment records when analytics does not return per-course rows.
- Course completion invalidates My Learning, enrollments, progress analytics, and certificates.

## Theme updates

- Tailwind's `dark:` variant is now driven by the `.dark` class on the document root, so the app's theme toggle controls dark mode rather than relying on the operating-system preference.
- Theme state is applied consistently to the root element and persisted in `learnhub-theme`.
- Updated affected admin and student surfaces to use the shared botanical theme tokens where practical.

## Backend contract notes

- The API operations above are based on the supplied OpenAPI specification. The specification does not provide complete response schemas for several list endpoints, so response extraction is defensive but still depends on the backend returning the documented resource data.
- Real Stripe payments require a valid `VITE_STRIPE_PUBLIC_KEY` and a backend that returns a real Stripe client secret. The supplied demo backend returns simulated `pi_mock_` intents, so checkout automatically uses the test-payment flow instead.
- Live API rendering, role permissions, Stripe processing, and refunds must be verified against the user's backend and Stripe environment. They cannot be confirmed by static source checks alone.
- Trackademy assessment modules remain linked to the external portal because the supplied LearnHub API specification does not define those module or assessment endpoints.

## Environment

Create `.env` from `.env.example` and set:

```env
VITE_API_BASE_URL=https://mockapi-mauve.vercel.app
VITE_STRIPE_PUBLIC_KEY=
```

Leave `VITE_STRIPE_PUBLIC_KEY` empty to use the test-payment flow; set a real `pk_test_...` or `pk_live_...` key only when the backend is configured for Stripe.

Do not commit `.env`.

## Validation

- ESLint source scan passed.
- Vite production build passed (`npm run build`).
