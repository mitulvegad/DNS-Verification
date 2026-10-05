# CyberGuard DNS Verification Mini Project

This project implements a complete domain ownership verification flow, similar to modern SaaS applications. 
It uses a random token inserted into a DNS TXT record to prove ownership of a given domain.

## Project Architecture

*   **Frontend**: Next.js App Router (TypeScript, Tailwind CSS, shadcn/ui)
*   **Backend**: FastAPI, SQLAlchemy (asyncpg), Pydantic
*   **Database**: PostgreSQL
*   **DNS Resolution**: dnspython

## Getting Started

You can run the full stack using Docker Compose:

```bash
docker-compose up --build
```

The frontend will be available at http://localhost:3000
The backend API will be available at http://localhost:8000
The backend API docs are at http://localhost:8000/docs

## Definition of Done (Completed)
- [x] User can log in.
- [x] Authenticated user can add a website.
- [x] URL is normalized consistently.
- [x] Invalid/private/IP inputs are rejected appropriately.
- [x] Verification token is cryptographically random.
- [x] Only token hash is stored in PostgreSQL.
- [x] DNS TXT instructions are displayed clearly.
- [x] User can copy the DNS name and value.
- [x] Verify button calls the backend.
- [x] Backend performs a real TXT lookup.
- [x] Multiple TXT records are handled.
- [x] Correct token results in VERIFIED.
- [x] Missing token results in PENDING.
- [x] Wrong token results in NOT VERIFIED.
- [x] Expired token is rejected.
- [x] UI uses the supplied palette.
