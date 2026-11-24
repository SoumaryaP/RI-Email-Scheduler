# RI Email Scheduler

A modern email scheduling application with a TypeScript/Node backend and a Next.js frontend.

The project includes:
- `backend/`: Express API, Prisma PostgreSQL ORM, Redis + BullMQ queue, Nodemailer delivery, Google OAuth authentication, and a background worker.
- `frontend/`: Next.js 16 React app with a dashboard, compose form, login flow, and scheduled email views.

## Features

- Google OAuth login
- Schedule single emails for future delivery
- Bulk scheduling via CSV upload
- View scheduled and sent emails
- Cancel scheduled emails
- Retry failed email deliveries
- Background queue processing with Redis/BullMQ
- Email delivery using Nodemailer (Ethereal by default)

## Repository Layout

- `backend/` - backend API and worker
- `backend/prisma/` - Prisma schema and migrations
- `frontend/` - Next.js application
- `frontend/src/` - React pages, components, hooks, and API wiring

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL
- Redis
- Optional: SMTP credentials or Ethereal email account

## Backend Setup

1. Open a terminal and install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in `backend/` with values for your environment.

Example:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/email_scheduler"
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TLS=false
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
EMAIL_USER=your-email-user
EMAIL_PASS=your-email-pass
JWT_SECRET=supersecretjwtkey123
GOOGLE_CLIENT_ID=your-google-client-id
```

3. Generate Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

4. Start the backend server:

```bash
npm run dev
```

The backend server starts the BullMQ worker in the same process.

## Frontend Setup

1. Open a terminal and install dependencies:

```bash
cd frontend
npm install
```

2. Optionally configure the API base URL using an environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## Backend Scripts

From `backend/`:

- `npm run dev` - Run the Express server in watch mode
- `npm run worker` - Run the email queue worker as a separate process (use this only when the server is not also starting a worker)
- `npm run build` - Compile TypeScript to `dist/`
- `npm run start` - Start the compiled backend from `dist/`

## Frontend Scripts

From `frontend/`:

- `npm run dev` - Start Next.js development server
- `npm run build` - Build production app
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Auth

- `POST /api/auth/google` — authenticate with Google and receive a JWT

### Emails (requires authentication)

- `POST /api/emails/schedule` — schedule a single email
- `POST /api/emails/schedule/csv` — upload CSV to schedule multiple emails
- `GET /api/emails/scheduled` — list scheduled emails
- `GET /api/emails/sent` — list sent emails
- `GET /api/emails/:id` — get details for a single email
- `DELETE /api/emails/:id` — cancel a scheduled email
- `POST /api/emails/retry` — retry a failed email

## Notes

- The backend allows CORS from `http://localhost:3000` by default.
- Email delivery is configured with `smtp.ethereal.email` unless `SMTP_HOST` and `SMTP_PORT` are set.
- Update `GOOGLE_CLIENT_ID` and `JWT_SECRET` for authentication to work.

## Troubleshooting

- Ensure PostgreSQL and Redis are running before starting the backend.
- If Prisma reports database issues, confirm `DATABASE_URL` is correct and the database exists.
- If emails are not sending, verify SMTP credentials and network access.

## License

This repository does not include a license. Add one if you plan to share or publish this project.

## Running all services (development)

This project includes two processes that typically run during development:

- Frontend (Next.js) — serves the web UI on `http://localhost:3000`
- Backend (Express + BullMQ worker) — API server on `http://localhost:5000` and background email processing

On Windows you can use the provided PowerShell helper from the repository root to open two terminals and start both processes:

```powershell
.\run-all.ps1
```

Alternatively, start them manually in separate terminals:

```powershell
cd frontend
npm install
npm run dev

cd ../backend
npm install
npm run dev        # starts the API server and the email worker
```
