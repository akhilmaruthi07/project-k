# Digital Notice Board with Expiry System

Full-stack notice board: **React (Vite)**, **Tailwind CSS**, **Framer Motion**, **Back4App (Parse JS SDK)**, and **React Context** for auth and theme.

## Features

- **Auth**: Login / signup via Parse `User`; roles **admin** and **student** (stored on `User` as `role`).
- **Admin**: CRUD notices with title, content, category, expiry, pinned, urgent.
- **Student**: Card feed with preview, category, expiry countdown, urgent + pinned styling.
- **Expiry**: Active notices use `expiryDate > now` on the server query; countdown in the UI.
- **Filters**: Category, keyword search, sort (newest / oldest / priority).
- **UI**: Dark/light mode, sticky navbar, animations, toasts, loading skeletons, optional Live Query + polling.

## Quick start

```bash
npm install
cp .env.example .env
# Edit .env with your Back4App keys (see below)
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Back4App setup

1. Create an app at [Back4App](https://www.back4app.com/).
2. In **App Settings → Security & Keys**, copy:
   - **Application ID** → `VITE_PARSE_APP_ID`
   - **JavaScript key** → `VITE_PARSE_JS_KEY`
3. **Server URL** is usually `https://parseapi.back4app.com` (default in `.env.example`).

### Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_PARSE_APP_ID` | Parse application ID |
| `VITE_PARSE_JS_KEY` | Parse JavaScript key |
| `VITE_PARSE_SERVER_URL` | Parse API URL (optional; defaults to Back4App) |

### Database: `Notices` class

Create a class named **`Notices`** (exact casing) with these columns:

| Column | Type |
|--------|------|
| `title` | String |
| `content` | String |
| `category` | String |
| `expiryDate` | Date |
| `isPinned` | Boolean |
| `isUrgent` | Boolean |
| `createdBy` | Pointer → `_User` |

### User role field

Add a **String** column **`role`** on **`_User`** (or edit the schema in the dashboard). Allowed values used by the app:

- `student` — default for new signups
- `admin` — can create/edit/delete notices

To make an admin: **Dashboard → Database → Browser → `_User`** → pick a user → set `role` to `admin`.

### Class-level permissions (recommended)

For **`Notices`**:

- **Read**: Public (or authenticated only, matching your needs).
- **Create / Update / Delete**: Restrict to authenticated users who are admins in production (the app enforces admin in code; for production, add **Cloud Code** or tight CLP).

The app sets **object-level ACLs** on each notice (public read; write restricted to the creating admin user).

### Live Query (optional)

For real-time list updates, enable **Live Query** for the `Notices` class in Back4App. If Live Query is off, the app still **polls** every 45 seconds.

## Optional Node/Express API (JWT + bcrypt)

This repo also includes an optional **Express** API in `server/` that:

- Logs users in via **Parse REST**
- Mints a **JWT** for your own `/api/*` endpoints
- Performs admin-only notice writes server-side (so Parse REST keys are not exposed to the browser)

### Run API locally

1. Add server env vars to `.env` (see `.env.example`):
   - `PARSE_APP_ID`
   - `PARSE_REST_API_KEY`
   - `PARSE_SERVER_URL` (defaults to Back4App)
   - `JWT_SECRET`
2. Start the API:

```bash
npm run dev:api
```

API will be available at `http://localhost:8080`:
- `GET /health`
- `POST /api/auth/signup`
- `POST /api/auth/login` → returns `{ token }`
- `GET /api/notices`
- `POST/PUT/DELETE /api/notices` (admin JWT required)

## Scripts

- `npm run dev` — development server  
- `npm run build` — production build  
- `npm run preview` — preview production build  
- `npm run lint` — ESLint  

## Project structure (high level)

- `src/lib/parseClient.js` — Parse initialization  
- `src/lib/noticesApi.js` — Notice CRUD and Live Query subscription  
- `src/context/` — `AuthContext`, `ThemeContext`  
- `src/hooks/` — `useNotices`, `useCountdown`  
- `src/components/` — Navbar, cards, modals, layout, skeletons  
- `src/pages/` — Login, student feed, admin panel  

## Security note

Client-side role checks are for UX only. For production, enforce admin-only writes with **Cloud Code** or Parse **Roles** and strict **CLP**.
