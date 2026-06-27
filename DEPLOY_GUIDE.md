# QuizRank India - Production Deployment Guide

This guide covers step-by-step instructions to deploy QuizRank India across various hosting platforms, including **Cloudflare Pages / Workers**, **Netlify**, **Vercel**, and **Google Cloud Run**. 

---

## 🚀 Recommended Platform: Google Cloud Run (Full-Stack Native)

Since QuizRank India is a full-stack application consisting of a **React Vite Frontend** and an **Express.js Backend with a local JSON Database and automation schedulers (cron)**, **Google Cloud Run** or any Docker-based container platform is the **fully compatible, optimal production platform**. It supports native Node.js environments, persistent local file storage (using volume mounts), and continuous cron jobs.

### Cloud Run Deployment Steps:
1. Ensure `package.json` contains:
   ```json
   "scripts": {
     "dev": "tsx server.ts",
     "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
     "start": "node dist/server.cjs"
   }
   ```
2. Build the production Docker container:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/quizrank-india
   ```
3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy quizrank-india \
     --image gcr.io/YOUR_PROJECT_ID/quizrank-india \
     --platform managed \
     --allow-unauthenticated \
     --port 3000 \
     --set-env-vars GEMINI_API_KEY="your-gemini-key",APP_URL="https://your-app-domain.run.app"
   ```

---

## 🌤️ Cloudflare Pages (Frontend SPA) + External Worker (API Proxy)

In serverless platforms like Cloudflare, Netlify, or Vercel, serverless functions are stateless and have a execution limit of 10-30 seconds. Because QuizRank India includes long-running background RSS pipelines, the best architecture on Cloudflare is to deploy the **Frontend statically to Cloudflare Pages**, and route **dynamic API requests to a Cloudflare Worker or external server**.

### Setup Wrangler Configuration
The project is pre-configured with `wrangler.jsonc` and `wrangler.toml` at the root.

### Cloudflare Pages Deploy:
1. **Connect Repository to Cloudflare Dashboard**:
   - Navigate to Cloudflare Dashboard > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. **Build Configuration**:
   - **Framework Preset**: `Vite` (or None)
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
   - **Root Directory**: `/`
3. **Environment Variables**:
   - In Pages settings, define `GEMINI_API_KEY` under Settings > Environment Variables.
4. **SPA Redirect Rules**:
   - The compiled output contains a `/dist/_redirects` file automatically generated from `/public/_redirects` with:
     ```text
     /*    /index.html   200
     ```
     This ensures direct URL reloads on `/quiz`, `/dashboard`, `/blog` do not result in a 404 error on Cloudflare Pages.

---

## ⚡ Netlify Deployment (Serverless API & Static Frontend)

Netlify is fully supported via the pre-configured `netlify.toml` included at the project root.

### Netlify Deployment Steps:
1. **Connect Repo to Netlify**:
   - Link your GitHub repository to Netlify.
2. **Build Settings** (Automatic via `netlify.toml`):
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. **Redirections**:
   - The `netlify.toml` includes a redirect rule that maps any non-file path back to `index.html` to allow HTML5 frontend routing, and proxies `/api/*` requests to your serverless backend.
4. **Define Variables**:
   - Go to Site Settings > **Environment variables** and add:
     - `GEMINI_API_KEY`: Your Google Gemini API Key.
     - `APP_URL`: Your deployed Netlify URL.

---

## 📐 Vercel Deployment

Vercel is pre-configured with a root `vercel.json` rewrite file to ensure SPA fallback works perfectly out of the box.

### Vercel Deployment Steps:
1. Install Vercel CLI or import the repository in the **Vercel Dashboard**.
2. Deploy directly via CLI:
   ```bash
   vercel --prod
   ```
3. **Build Settings**:
   - Vercel automatically detects the Vite configuration.
   - Set Build Command to `npm run build` and Output Directory to `dist`.
4. **Configure Environment Variables**:
   - Add `GEMINI_API_KEY` in Vercel project settings.

---

## 🛡️ Resilient Offline Fallback Mode

If QuizRank India is deployed to a strictly static environment where no Node.js server or Gemini API key is configured, the system activates its **Resilient Fallback Mode**:
- **Zero-Crash API Proxying**: If the server fails to reach the Gemini API or the key is missing, Express fallback endpoints intercept the requests and return high-quality, pre-populated offline mock tests and blog articles.
- **In-Memory Cache**: If the serverless environment has a read-only filesystem (e.g. AWS Lambda/Google Cloud Functions), database read/write operations automatically fallback to an in-memory storage buffer (`inMemoryDB`), ensuring 100% uptime without database locks.
