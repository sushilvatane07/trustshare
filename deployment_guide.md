# TrustShare Production Deployment Guide

This guide describes how to deploy the **TrustShare** application stack to production.

---

## 1. Prerequisites
* A Supabase project with database tables (`profiles`, `files`, `share_links`, `activity_logs`) and a storage bucket named `trustshare-files` (configured as shown in your schema diagram).
* Docker and Docker Compose installed on your host server, or access to a container service (like AWS ECS, Google Cloud Run, Azure Container Apps, or Render).

---

## 2. Deploying with Docker Compose (VPS / Single Host)

If you are deploying to a standard virtual server (VPS) like AWS EC2, DigitalOcean, or Linode, Docker Compose is the easiest route.

### Step 1: Clone and Prep Env Variables
In the root directory of your project, create a single `.env` file containing all the environment variables needed for both containers:

```bash
# Supabase settings for Backend (service_role to bypass RLS)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key-bypassing-rls

# CORS settings for Backend
# Restrict this to your actual production domains (e.g. your GitHub Pages url or custom domain)
ALLOWED_ORIGINS=https://sushilvatane07.github.io,http://localhost

# Supabase settings for Frontend build (anon key)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_API_URL=http://your-server-ip-or-domain:8000
```

### Step 2: Build and Launch Containers
Run the following command to build the Docker images and start the services in the background:

```bash
docker compose up -d --build
```

* The **FastAPI backend** will start on port `8000`.
* The **React frontend** will start on port `80` (accessible via browser directly at `http://your-server-ip`).

---

## 3. Deploying Frontend to GitHub Pages (Static Hosting) & Backend separately

Since your frontend has a pre-existing GitHub Pages deployment configuration (`gh-pages` and `base: "/trustshare/"`), this hybrid model is highly recommended:

### Step 1: Deploy backend to Cloud Containers (Render, Cloud Run, or AWS ECS)
1. Set up a new web service on Render or Google Cloud Run pointing to your `backend/` directory.
2. Provide the following environment variables in their dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `ALLOWED_ORIGINS` (set to `https://sushilvatane07.github.io` to secure it)
3. Note the public URL generated for your backend service (e.g. `https://trustshare-api.onrender.com`).

### Step 2: Deploy frontend to GitHub Pages
1. In your `frontend/.env` file (or in your terminal environment), set:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   VITE_API_URL=https://your-backend-service-url.com
   ```
2. Run the deploy script from the `frontend/` directory:
   ```bash
   npm run deploy
   ```
   This will automatically build your app for production (injecting environment variables) and push the compiled files in `dist/` directly to your `gh-pages` branch.
