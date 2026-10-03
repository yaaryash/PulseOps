# PulseOps

**PulseOps** is a full-stack operations platform being built incrementally—from a dependable monolith to a production-ready, observable distributed system. It is a practical learning project designed to demonstrate how a modern React and Node.js product is designed, built, deployed, and operated.

> **Current milestone:** Phase 2 — Core Operations API ✓

## What is working today

The first two phases establish a clean, runnable connection between the browser and the API, then turn it into a small but real operations module.

- A React + TypeScript dashboard that displays the live API state
- A Node.js + Express + TypeScript API with a dedicated health controller and route
- Environment-based configuration and browser-safe CORS configuration
- A Service Registry with complete REST create, read, update, and delete operations
- Centralized request validation and consistent error responses
- A dashboard flow that registers and displays monitored services
- Independent development and production-build workflows for frontend and backend
- Git-ready repository rules that keep local `.env` files and build outputs out of source control

## Architecture

```text
Browser
  │
  ▼
React + Vite dashboard  ── Health + Service API ──►  Express API
                                                         │
                                                         ▼
                                            Controllers → Services → Repository
                                                                    │
                                                                    ▼
                                                            In-memory data
```

The project deliberately starts as a well-structured monolith. Phase 3 will replace the in-memory repository with PostgreSQL and Prisma. Later phases will add authentication, asynchronous jobs, infrastructure, and observability without replacing the foundation.

## Repository layout

```text
pulseops/
├── frontend/                         # React + Vite application
│   └── src/
│       ├── App.tsx                   # Dashboard entry screen
│       ├── main.tsx                  # React bootstrap
│       └── index.css                 # Base visual system
│
├── backend/                          # Express API
│   └── src/
│       ├── controllers/              # HTTP request and response handling
│       ├── routes/
│       ├── services/                 # Application rules
│       ├── repositories/             # Data access abstraction
│       ├── schemas/                  # Request validation rules
│       ├── middleware/               # Validation and error handling
│       ├── types/                    # Shared domain types
│       ├── app.ts                    # Middleware and API routes
│       └── server.ts                 # HTTP server bootstrap
│
├── .gitignore
└── README.md
```

## Technology

| Layer | Technology |
| --- | --- |
| Client | React 19, Vite, TypeScript |
| API | Node.js, Express 5, TypeScript |
| Configuration | `dotenv`, environment variables |
| Code quality | TypeScript strict mode |
| Version control | Git and GitHub |

## Run PulseOps locally

### Prerequisites

- Node.js 22 LTS or newer
- npm 10 or newer

### 1. Create local configuration

The application has safe defaults for local development. To customize them, create local environment files from the committed templates:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Never commit `.env` files. They are intentionally excluded by `.gitignore`; `.env.example` contains only safe, documented values.

### 2. Start the API

```powershell
cd backend
npm install
npm run dev
```

The API starts at `http://localhost:5000`.

### 3. Start the dashboard

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The dashboard automatically checks the API health endpoint and reports the result.

## API reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | API metadata and running confirmation |
| `GET` | `/api/health` | API health status for the dashboard and infrastructure checks |
| `GET` | `/api/services` | List registered services |
| `POST` | `/api/services` | Register a service |
| `GET` | `/api/services/:id` | Get one service |
| `PATCH` | `/api/services/:id` | Update a service's name, URL, description, or status |
| `DELETE` | `/api/services/:id` | Remove a service |

Example response from `GET /api/health`:

```json
{
  "success": true,
  "service": "pulseops-api",
  "status": "healthy"
}
```

## Verify a production build

```powershell
cd backend
npm run build

cd ../frontend
npm run build
```

## Delivery roadmap

| Phase | Focus | Status |
| --- | --- | --- |
| 1 | Full-stack foundation, health check, Git workflow | Complete |
| 2 | Core operations API: layered architecture, service resources, validation, and error handling | Complete |
| 3 | PostgreSQL and Prisma persistence | Next |
| 4 | Authentication and role-based access control | Planned |
| 5 | Operations dashboard features | Planned |
| 6–12 | Redis, queues, Kafka, Docker, cloud deployment, CI/CD, Kubernetes, and observability | Planned |

## Phase 2: Service Registry

Phase 2 introduces a **Service** resource—the application or system that PulseOps will monitor—with a clean controller → service → repository flow. Services have a name, optional URL and description, and one of four states: `operational`, `degraded`, `outage`, or `maintenance`.

The backend validates every write request before it reaches the service layer. Invalid data receives a clear `400` response, missing resources receive `404`, and unexpected errors are handled consistently.

For this phase, services are held in memory. They are deliberately not persistent yet, so restarting the API clears the registry.

## Next: Phase 3 — Persistent Data

Phase 3 will introduce Docker-based PostgreSQL and Prisma. The existing Service Repository will be upgraded from in-memory storage to a database-backed implementation, while the API and dashboard contracts remain stable. It will also include database migrations, a small development seed, and documentation for the local database workflow.

---

Built phase by phase. After all implementation phases are complete, the project will be revisited from the beginning for in-depth, phase-wise learning.
