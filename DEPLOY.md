# Deploy JOB+
1. MongoDB Atlas (free M0) -> create DB user, allow 0.0.0.0/0, copy mongodb+srv URI.
2. Push this repo to GitHub.
3. Render -> New -> Blueprint -> pick repo (uses render.yaml). Fill MONGO_URI, GMAIL_USER,
   GMAIL_APP_PASSWORD, BACKEND_PUBLIC_URL (= your Render URL), CLIENT_ORIGIN (fill after step 4).
4. Vercel -> Import repo, Root Directory = frontend, add env VITE_API_BASE = <render-url>/api.
5. Put the Vercel URL in Render's CLIENT_ORIGIN (no trailing slash) and redeploy.
