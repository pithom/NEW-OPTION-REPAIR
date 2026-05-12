# NEW OPTION TECHNOLOGY

Dark-themed full-stack web application for a public technology portfolio and a private laptop repair management system.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT
- Session storage: HttpOnly secure cookies
- Email delivery: Nodemailer

## Features

- Public portfolio landing page with services, about, and contact form
- Secure login for private staff access
- Forgot password flow with 6-digit email OTP verification
- One-time password reset session stored in an HttpOnly cookie
- Rate-limited auth and contact form endpoints
- Repair, customer, and technician management
- Dashboard analytics with charts and revenue overview
- Profile update and password change
- Responsive dark UI for desktop, tablet, and mobile

## Project Structure

- `frontend` - React application
- `backend` - Express API

## Password Reset Routes

- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`

## Local Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Copy `frontend/.env.example` to `frontend/.env` if needed
3. Install dependencies:

```bash
npm run install:all
```

4. Start both servers:

```bash
npm run dev
```

## Default Admin

The backend seeds a first admin account automatically if no user exists.

- Email: `admin@newoptiontechnology.com`
- Password: `Admin@12345`

Change this password immediately after the first login from the Settings page.

## Security Notes

- Set `JWT_SECRET` to a strong secret with at least 32 characters.
- Set `ALLOWED_ORIGINS` to the exact frontend URLs allowed to call the API.
- Change `ADMIN_PASSWORD` before using the app outside local development.
- Use a Gmail App Password or SMTP credentials for the Nodemailer configuration.
