# Deployment & Operations Guide
## Digital Suraksha — Production & Cloud Deployment Manual

---

## 1. Local Development Setup (Zero-Config SQLite)

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd "Mayur CEP 1"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build shared library:**
   ```bash
   npm run build --workspace=packages/shared
   ```

4. **Initialize database & seed tri-lingual data:**
   ```bash
   npm run db:setup --workspace=packages/backend
   ```

5. **Start backend and frontend:**
   ```bash
   npm run dev:backend   # Starts API on http://localhost:5000
   npm run dev:frontend  # Starts UI on http://localhost:5173
   ```

---

## 2. Docker & Docker Compose Deployment (PostgreSQL)

For running the complete production-grade multi-service stack with a dedicated PostgreSQL database container:

```bash
# 1. Build and start containers in detached mode
docker compose up -d --build

# 2. Check running services
docker compose ps

# 3. View live server logs
docker compose logs -f backend
```

Services exposed:
- **Frontend Application**: `http://localhost:5173` (Nginx reverse proxy)
- **Backend REST API**: `http://localhost:5000/api/v1`
- **PostgreSQL Database**: `localhost:5432` (`digital_suraksha`)

---

## 3. Production Cloud Hosting Options

### Option A: Railway / Render (Full-Stack in 10 minutes)
1. Provision a free PostgreSQL database on Render or Railway.
2. Deploy the backend service:
   - Root directory: `packages/backend`
   - Build command: `npm install && npm run build --workspace=packages/shared && npm run build`
   - Start command: `node dist/server.js`
   - Environment variables:
     - `DATABASE_URL`: `postgresql://<user>:<pwd>@<host>:<port>/<db>?sslmode=require`
     - `JWT_SECRET`: Random 32+ character string
     - `NODE_ENV`: `production`
3. Deploy the frontend service on Vercel or Render Static Site:
   - Root directory: `packages/frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variable:
     - `VITE_API_URL`: URL of the deployed backend service (e.g. `https://api.suraksha.edu.in/api/v1`)

---

## 4. Database Backup & Disaster Recovery

### PostgreSQL Backup
```bash
# Export compressed database backup
pg_dump -U postgres -d digital_suraksha -F c -b -v -f suraksha_backup_$(date +%F).dump

# Restore from backup
pg_restore -U postgres -d digital_suraksha -v suraksha_backup_2026-10-16.dump
```

### SQLite Backup (Local Environment)
```bash
# Simply copy the dev.db file
cp packages/backend/prisma/dev.db packages/backend/prisma/dev.db.backup
```
