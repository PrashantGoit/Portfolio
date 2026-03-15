# MERN Portfolio

Full-stack developer portfolio built with **MongoDB + Express + React + Node.js**.

---

## Folder Structure

```
mern-portfolio/
├── package.json            ← root scripts (runs both)
├── .gitignore
│
├── server/
│   ├── index.js            ← Express entry point
│   ├── package.json
│   ├── .env.example        ← copy → .env and fill in values
│   ├── config/
│   │   ├── db.js           ← MongoDB Atlas connection
│   │   └── mailer.js       ← Nodemailer (Gmail)
│   ├── models/
│   │   └── Contact.js      ← Mongoose schema
│   ├── middleware/
│   │   └── adminAuth.js    ← Bearer token guard
│   └── routes/
│       └── contact.js      ← Full CRUD: POST/GET/GET:id/DELETE
│
└── client/
    ├── index.html
    ├── vite.config.js      ← proxies /api → localhost:5000 in dev
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx          ← Router + ThemeProvider
        ├── index.css        ← CSS variables (dark/light themes)
        ├── api/
        │   └── index.js    ← Axios instance + contactAPI
        ├── context/
        │   └── ThemeContext.jsx  ← Dark/Light toggle + localStorage
        ├── hooks/
        │   └── useInView.js     ← IntersectionObserver fade-in
        ├── components/
        │   ├── Navbar.jsx        ← Nav + theme toggle button
        │   └── ContactForm.jsx   ← Form with validation + API call
        └── pages/
            ├── Home.jsx          ← Hero, About, Projects, Contact
            └── Admin.jsx         ← Protected admin dashboard
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd mern-portfolio
npm run install:all
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
# Edit .env with your values (see below)
```

### 3. Run in development

```bash
# From root — starts both server (port 5000) + client (port 5173)
npm run dev
```

---

## Environment Variables (`server/.env`)

| Variable      | Description                                      |
|---------------|--------------------------------------------------|
| `PORT`        | Express port (default: 5000)                     |
| `MONGO_URI`   | MongoDB Atlas connection string                  |
| `EMAIL_USER`  | Gmail address for sending notifications          |
| `EMAIL_PASS`  | Gmail App Password (not your real password)      |
| `EMAIL_TO`    | Where to deliver contact notifications           |
| `ADMIN_TOKEN` | Secret string to protect `/admin` route          |
| `CLIENT_URL`  | Frontend URL for CORS (e.g. https://yourdomain.com) |

**Generating a secure ADMIN_TOKEN:**
```bash
openssl rand -hex 32
```

**Setting up Gmail App Password:**
1. Enable 2FA on your Google account
2. Go to myaccount.google.com/apppasswords
3. Create an app password for "Mail"
4. Use that 16-char password as `EMAIL_PASS`

---

## API Reference

### Public
| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| POST   | /api/contact   | Submit a contact form |

### Admin (requires `Authorization: Bearer <ADMIN_TOKEN>`)
| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| GET    | /api/contact      | List all messages     |
| GET    | /api/contact/:id  | Get single message    |
| DELETE | /api/contact/:id  | Delete message        |

**Pagination:** `GET /api/contact?page=2&limit=20`

---

## Admin Panel

Navigate to `/admin` in the browser.

Enter your `ADMIN_TOKEN` to authenticate. The token is stored in `sessionStorage` (clears on tab close). You can view all messages, paginate, and delete entries.

---

## Theme Toggle

The Navbar includes a ☀/☽ toggle. Theme preference is persisted to `localStorage` via the `ThemeContext`. Both dark and light modes maintain the cyberpunk aesthetic using CSS custom properties defined in `index.css`.

---

## Deploy: MongoDB Atlas + Render

### Step 1 — MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user (username + password)
3. Whitelist `0.0.0.0/0` under Network Access (or Render's IP range)
4. Get the connection string: **Connect → Drivers → Node.js**
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

### Step 2 — Deploy Backend on Render

1. Push your code to GitHub
2. New Web Service → connect your repo
3. **Root Directory:** `server`
4. **Build Command:** `npm install`
5. **Start Command:** `node index.js`
6. Add all environment variables from `.env` in the Render dashboard
7. Note your backend URL: `https://your-api.onrender.com`

### Step 3 — Deploy Frontend on Render (or Vercel/Netlify)

**Option A — Render Static Site:**
1. New Static Site → same repo
2. **Root Directory:** `client`
3. **Build Command:** `npm install && npm run build`
4. **Publish Directory:** `dist`
5. Add env var: `VITE_API_URL=https://your-api.onrender.com`

**Option B — Vercel (recommended for React):**
```bash
cd client
npx vercel --prod
# Set VITE_API_URL in Vercel project settings
```

### Step 4 — Update CORS

In your backend `.env` / Render env vars:
```
CLIENT_URL=https://your-frontend.onrender.com
```

---

## Local Development Notes

- Vite proxies `/api/*` requests to `http://localhost:5000` automatically — no CORS issues in dev
- Backend validates all inputs server-side (don't rely on frontend-only validation)
- Rate limiting: one submission per email per 15 minutes (enforced in route handler)
- Nodemailer silently skips sending if `EMAIL_USER`/`EMAIL_PASS` aren't set (safe for dev)
