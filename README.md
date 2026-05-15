# NEW OPTION TECHNOLOGY

Full-stack repair management and portfolio app built with React, Vite, Express, and MongoDB.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT stored in HttpOnly cookies
- Email: Nodemailer

## Local development

1. Copy `backend/.env.example` to `backend/.env`.
2. Copy `frontend/.env.example` to `frontend/.env` if you want to override the default local API URL.
3. Install dependencies:

```bash
npm run install:all
```

4. Start both apps:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

## Render deployment

This repo is configured to run on Render as a single Node web service:

- Render builds the Vite frontend during deploy.
- Express serves the compiled frontend in production.
- API routes stay under `/api`.
- Auth cookies stay same-origin, which avoids cross-site session problems.

### Recommended setup

1. Push this repo to GitHub, GitLab, or Bitbucket.
2. In Render, create a new Blueprint and point it at this repo.
3. Render will read [`render.yaml`](./render.yaml).
4. Provide the required secret values during setup.

### Required production environment variables

- `JWT_SECRET`: strong random string with at least 32 characters
- `MONGODB_URI`: a hosted MongoDB connection string
- `ADMIN_EMAIL`: admin login email to seed in production
- `ADMIN_PASSWORD`: non-default admin password for first boot
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password or API key
- `SMTP_FROM_EMAIL`: verified sender email

### Important notes

- Do not use the checked-in `backend/mongo-data` folder on Render. Render instances are ephemeral. Use hosted MongoDB instead.
- If you add a custom domain later, set `ALLOWED_ORIGINS` to that exact origin, such as `https://yourdomain.com`.
- If frontend and backend are hosted as separate services, set `FRONTEND_URL` and include the same value in `ALLOWED_ORIGINS`.
- `JWT_SECRET` is generated automatically by the Blueprint if it is missing.
- The backend will refuse to boot in production if `JWT_SECRET`, `ADMIN_PASSWORD`, `SMTP`, or `MONGODB_URI` are unsafe or incomplete.

### Manual service settings

If you prefer setting up the service without a Blueprint, use:

- Runtime: `Node`
- Build Command: `npm run render:build`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Also add all required production environment variables manually. The `JWT_SECRET` auto-generation only happens when using the Blueprint.

## Default admin

The app seeds an admin account automatically if the configured admin email does not exist yet.

- Email: `cfeddx6@gmail.com`
- Password: `ADMIN_PASSWORD` from your environment

To use the same login in both local and hosted environments, set Render `ADMIN_EMAIL` and
`ADMIN_PASSWORD` to the same values used in `backend/.env`, then redeploy.

If the hosted database already contains an older admin account, create or refresh the matching admin
with:

```bash
npm run reset:admin -- --email=cfeddx6@gmail.com --password=your-password
```

Change the password after first login if you used a temporary value.
