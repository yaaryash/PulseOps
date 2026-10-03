# PulseOps

PulseOps is an operations dashboard project that will grow phase by phase. Phase 1 provides a React + Vite + TypeScript frontend and a Node.js + Express + TypeScript API.

## Phase 1 capabilities

- Frontend health-status screen
- Express API with CORS and environment configuration
- `GET /` service metadata endpoint
- `GET /api/health` health endpoint
- Production build scripts for both applications

## Project layout

```text
pulseops/
├── frontend/       # React + Vite + TypeScript client
├── backend/        # Express + TypeScript API
└── README.md
```

## Prerequisites

- Node.js 22 LTS (or newer)
- npm 10 (or newer)

## Configure environment files

Copy the examples before running the applications:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

The `.env` files are intentionally ignored by Git. Do not put secrets in the example files.

## Install and run

Open two terminals from the `pulseops` directory.

```powershell
cd backend
npm install
npm run dev
```

```powershell
cd frontend
npm install
npm run dev
```

- Frontend: <http://localhost:5173>
- API: <http://localhost:5000>
- Health check: <http://localhost:5000/api/health>

Expected health response:

```json
{
  "success": true,
  "service": "pulseops-api",
  "status": "healthy"
}
```

## Verify production builds

```powershell
cd backend
npm run build

cd ../frontend
npm run build
```

## Next phase

Phase 2 will build on this single codebase; no separate project is needed.
