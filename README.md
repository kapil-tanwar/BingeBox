# 🎬 BingeBox

A full-stack Netflix-inspired streaming platform built with **React**, **Node.js**, **Express**, and **MongoDB**. Browse trending movies & TV shows, watch trailers, search for content, and maintain a personalized search history — all powered by the [TMDB API](https://www.themoviedb.org/documentation/api).

---

## ✨ Features

- **🔐 Authentication** — Sign up, sign in, and logout with JWT-based auth & secure HTTP-only cookies.
- **🎥 Trending Content** — Discover daily trending movies and TV shows.
- **🎞️ Trailers** — Watch trailers directly via an embedded video player.
- **🔍 Search** — Search for movies, TV shows, and people across the TMDB catalog.
- **📜 Search History** — Automatically saved per-user search history with delete support.
- **📂 Category Browsing** — Browse movies and TV shows by category (popular, top rated, upcoming, etc.).
- **🧩 Similar Content** — View recommendations for similar movies or shows.
- **🛡️ Protected Routes** — Authenticated routes on both frontend and backend.
- **📱 Responsive UI** — Fully responsive design with Tailwind CSS.

---

## 🛠️ Tech Stack

| Layer      | Technology                                                         |
| ---------- | ------------------------------------------------------------------ |
| Frontend   | React 18, Vite, Tailwind CSS, Zustand, React Router, React Player |
| Backend    | Node.js, Express.js                                                |
| Database   | MongoDB (Mongoose ODM)                                             |
| Auth       | JWT, bcrypt.js, HTTP-only cookies                                  |
| API        | [TMDB API](https://developer.themoviedb.org/docs)                  |
| Dev Tools  | Nodemon, ESLint, PostCSS, cross-env                                |

---

## 📁 Project Structure

```
BingeBox/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── envVar.js          # Environment variable loader
│   ├── controller/
│   │   ├── auth.control.js    # Signup, signin, logout, auth check
│   │   ├── movie.control.js   # Trending, trailers, details, similar, category
│   │   ├── search.control.js  # Search movies/TV/people, history CRUD
│   │   └── tv.control.js      # Trending, trailers, details, similar, category
│   ├── middleware/
│   │   └── protectRoute.js    # JWT verification middleware
│   ├── model/
│   │   └── user.model.js      # User schema (username, email, password, searchHistory)
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── movie.route.js
│   │   ├── search.route.js
│   │   └── tv.route.js
│   ├── services/
│   │   └── tmdb.service.js    # TMDB API fetch helper
│   ├── utils/
│   │   └── generateToken.js   # JWT token generator
│   └── server.js              # Express app entry point
│
├── frontend/
│   ├── public/                # Static assets (avatars, etc.)
│   ├── src/
│   │   ├── components/
│   │   │   ├── MovieSlider.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── skeletons/     # Loading skeleton components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   │   ├── AuthScreen.jsx
│   │   │   │   ├── HomePage.jsx
│   │   │   │   └── HomeScreen.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignUpPage.jsx
│   │   │   └── WatchPage.jsx
│   │   ├── store/
│   │   │   ├── authUser.js    # Zustand auth store
│   │   │   └── content.js     # Zustand content store
│   │   ├── utils/
│   │   │   └── axios.jsx      # Axios instance for TMDB (frontend)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── package.json               # Root package (backend scripts & shared deps)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **MongoDB** — Local instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **TMDB API Key** — Get one at [themoviedb.org](https://www.themoviedb.org/settings/api)

### 1. Clone the repository

```bash
git clone https://github.com/kapil-tanwar/BingeBox.git
cd BingeBox
```

### 2. Set up environment variables

Create a **`.env`** file in the **root** directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bingebox
JWT_SECRET=your_jwt_secret_here
TMDB_API_KEY=your_tmdb_api_key_here
NODE_ENV=development
```

Create a **`.env`** file in the **`frontend/`** directory:

```env
VITE_TMDB_API_KEY=your_tmdb_bearer_token_here
```

> **Note:** The backend `TMDB_API_KEY` supports both v3 API keys and v4 Bearer tokens. The frontend `VITE_TMDB_API_KEY` expects a v4 Bearer (Read Access) token.

### 3. Install dependencies

```bash
# Install root (backend) dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend
```

### 4. Run in development mode

```bash
# Start the backend server (port 5000)
npm run dev
```

```bash
# In a separate terminal — start the frontend dev server (port 5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Build for Production

```bash
# Build both backend deps and frontend static bundle
npm run build

# Start the production server
npm start
```

In production mode, the Express server serves the built frontend from `frontend/dist` and handles all client-side routes via a catch-all.

---

## 📡 API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint      | Description                | Auth |
| ------ | ------------- | -------------------------- | ---- |
| POST   | `/signup`     | Register a new user        | ❌    |
| POST   | `/signin`     | Login with email/password  | ❌    |
| POST   | `/logout`     | Clear auth cookie          | ❌    |
| GET    | `/authCheck`  | Verify current session     | ✅    |

### Movies (`/api/movie`)

| Method | Endpoint          | Description                  | Auth |
| ------ | ----------------- | ---------------------------- | ---- |
| GET    | `/trending`       | Get a random trending movie  | ❌    |
| GET    | `/:id/trailers`   | Get movie trailers           | ❌    |
| GET    | `/:id/details`    | Get movie details            | ❌    |
| GET    | `/:id/similar`    | Get similar movies           | ❌    |
| GET    | `/:category`      | Get movies by category       | ❌    |

### TV Shows (`/api/tv`)

| Method | Endpoint          | Description                    | Auth |
| ------ | ----------------- | ------------------------------ | ---- |
| GET    | `/trending`       | Get a random trending TV show  | ❌    |
| GET    | `/:id/trailers`   | Get TV show trailers           | ❌    |
| GET    | `/:id/details`    | Get TV show details            | ❌    |
| GET    | `/:id/similar`    | Get similar TV shows           | ❌    |
| GET    | `/:category`      | Get TV shows by category       | ❌    |

### Search (`/api/search`)

| Method | Endpoint           | Description                      | Auth |
| ------ | ------------------ | -------------------------------- | ---- |
| GET    | `/person/:query`   | Search for a person              | ✅    |
| GET    | `/movie/:query`    | Search for a movie               | ✅    |
| GET    | `/tv/:query`       | Search for a TV show             | ✅    |
| GET    | `/history`         | Get user's search history        | ✅    |
| DELETE | `/history/:id`     | Remove item from search history  | ✅    |

---

## 🔧 Environment Variables Reference

| Variable            | Location   | Description                                      |
| ------------------- | ---------- | ------------------------------------------------ |
| `PORT`              | Root `.env`| Server port (default: `5000`)                    |
| `MONGO_URI`         | Root `.env`| MongoDB connection string                        |
| `JWT_SECRET`        | Root `.env`| Secret key for signing JWT tokens                |
| `TMDB_API_KEY`      | Root `.env`| TMDB API key or v4 Bearer token (backend)        |
| `NODE_ENV`          | Root `.env`| `development` or `production`                    |
| `FRONTEND_ORIGIN`   | Root `.env`| Frontend URL for CORS in production (optional)   |
| `VITE_TMDB_API_KEY` | `frontend/.env` | TMDB v4 Read Access (Bearer) token (frontend) |

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
