# LearnHub

A role-based learning management application built with React, Vite, Tailwind CSS v4, React Router, TanStack Query, Axios, and the LearnHub mock API.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Setup

Run these commands from inside the extracted project folder (the one containing `package.json`):

```bash
npm install
npm run dev
```

Then open the URL Vite prints, e.g. `http://localhost:5173` or `http://127.0.0.1:5173`.
Do not open `index.html` directly from Finder — the app must be served by Vite.

The `.env` file is included. API calls go through the Vite dev/preview proxy
(`/api` → `https://mockapi-mauve.vercel.app`), so the app works on any port and
either hostname. Set `VITE_API_BASE_URL` to an absolute URL only when deploying
the built `dist/` to a static host without a proxy.

If port 5173 is already in use, Vite starts on the next free port automatically —
use the URL it prints.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Application areas

- Public course marketplace and course details
- Authentication and account activation
- Student dashboard, enrolled learning, lesson progress, certificates, wishlist, and reviews
- Instructor dashboard, course creation and editing, lectures, students, and analytics
- Admin dashboard, course publishing workflow, and user management
- Role-protected profile view

## Authentication

The client uses the API's cookie-based session flow with Axios `withCredentials: true`. Access tokens are not persisted in browser local storage by this application.

## API integration notes

The client calls documented API routes from the configured backend. Do not add endpoints or request fields unless they are present in the backend's current API specification. Some planned areas (including payment checkout, coupon administration, order/refund administration, category administration, and profile editing) need their exact backend contracts and upload/payment configuration before they can be safely enabled.
