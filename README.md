# StreamHub Frontend

React + Vite + Tailwind frontend for your Node/Express video backend.

## Run
1. Start your backend on `http://localhost:8000`.
2. In this folder run `npm install`.
3. Run `npm run dev` and open `http://localhost:5173`.

## Included
- Home feed, search, watch page and comments
- Register/login/logout with cookie-based auth
- Video upload with video + thumbnail
- Creator dashboard and channel pages
- Likes, playlists, subscriptions and profile screen
- Responsive dark UI

## Backend assumptions
Routes are mounted under `/api/v1`: `users`, `videos`, `comments`, `likes`, `playlists`, `subscriptions`, `dashboard`. Update `src/api.js` if your app.js uses different mount paths. Enable CORS for `http://localhost:5173` with credentials and use cookie-parser. The frontend uses the controller paths and common response wrappers; compare your actual controller response shapes if a screen returns empty data.
