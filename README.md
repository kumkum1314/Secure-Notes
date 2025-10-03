<!-- Project: MERN Secure Notes App -->

<div align="center">
  <h1>Secure Notes App</h1>
  <p>A modern, secure, and responsive MERN notes application.</p>

  <p>
    <a href="https://nodejs.org/"><img alt="Node" src="https://img.shields.io/badge/Node-18%2B-339933?logo=node.js&logoColor=white"></a>
    <a href="https://react.dev/"><img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=0A0A0A"></a>
    <a href="https://vitejs.dev/"><img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white"></a>
    <a href="https://www.mongodb.com/"><img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white"></a>
    <a href="https://render.com/"><img alt="Render" src="https://img.shields.io/badge/Backend-Render-5746AF?logo=render&logoColor=white"></a>
    <a href="https://www.netlify.com/"><img alt="Netlify" src="https://img.shields.io/badge/Frontend-Netlify-00C7B7?logo=netlify&logoColor=white"></a>
  </p>
</div>

## ✨ Features
- **Authentication**: Register, Login, JWT-based sessions
- **CRUD Notes**: Create, read, update, delete notes
- **Search**: Debounced global search in navbar
- **Responsive UI**: Modern, accessible design with glassmorphism and subtle animations
- **Protected API**: Express + Mongoose with auth middleware

## 🧱 Tech Stack
- **Frontend**: React 18, Vite, Tailwind (via `@import`), custom theme
- **Backend**: Node, Express, MongoDB (Mongoose)
- **Auth**: JWT
- **Deployment**: Render (API), Netlify (SPA)

## 🚀 Quick Start (Local)
```bash
# 1) Install deps (root + frontend)
npm install
npm install --prefix frontend

# 2) Create .env at repo root
echo "MONGO_URI=your-mongodb-uri" >> .env
echo "JWT_SECRET=super-secret-key" >> .env
echo "NODE_ENV=development" >> .env

# 3) Start dev server (backend with nodemon)
npm run dev

# 4) In another terminal, run the frontend
cd frontend && npm run dev
```

Open the frontend dev server URL (usually `http://localhost:5173`). The backend runs on port 5000 by default.

## 🔧 Environment Variables
Place these in Render (Backend) and `.env` locally:
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – any secure random string
- `NODE_ENV` – `production` on Render, `development` locally

## 📦 NPM Scripts
```json
{
  "dev": "nodemon backend/server.js",
  "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend",
  "start": "node backend/server.js"
}
```

## 🌐 Deployment

### Backend → Render (Web Service)
1. Push the repo to GitHub.
2. Create a Render Web Service, connect the repo.
3. Settings:
   - Root Directory: leave blank
   - Build Command: `npm install`
   - Start Command: `npm start` (runs `node backend/server.js`)
4. Environment → add: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`.
5. Deploy, then copy your API URL (e.g., `https://your-backend.onrender.com`).

### Frontend → Netlify (Vite)
Option A (recommended, proxy preserved):
1. Ensure a Netlify redirects file exists at `frontend/public/_redirects`:
```
/api/* https://YOUR-RENDER-SERVICE.onrender.com/api/:splat 200
/* /index.html 200
```
2. In Netlify → New site from Git, choose this repo.
3. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy.

Option B (no proxy): Update axios URLs to use the full backend domain and enable CORS on the backend.

## 🧪 Smoke Test
- `GET /api/notes` without token → 401 Unauthorized (expected)
- Register → Login → Create note → Edit → Delete
- Search from navbar filters notes in real-time

## 📁 Project Structure
```
mern-notes-app/
  backend/
    config/db.js
    middleware/auth.js
    models/{User,Note}.js
    routes/{auth,notes}.js
    server.js
  frontend/
    src/{App.jsx, main.jsx, index.css}
    src/components/{Navbar,Home,Login,Register,NoteModal}.jsx
    public/_redirects (optional for proxy)
```

## 🛡️ Security Notes
- Never commit real secrets. Use environment variables.
- JWT secret should be long and random.
- Validate inputs on both client and server.

## 📸 Screenshots (optional)
Add screenshots to showcase the UI in `frontend/public/` and link them here.

## 🙌 Credits
Built with ❤️ using the MERN stack.


