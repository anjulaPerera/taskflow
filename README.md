# TaskFlow

A full-stack task management application built to demonstrate 
production-grade development practices.

**Live Demo:** https://taskflow-frontend-beta-pink.vercel.app/
**Backend API:** https://taskflow-backend-o9kg.onrender.com/

## Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Azure Database for PostgreSQL)
- **Infrastructure:** Docker, Azure App Service
- **CI/CD:** GitHub Actions
- **Testing:** Jest, Supertest

## Features
- JWT authentication (register/login)
- Project management (create, view, delete)
- Task tracking with status workflow (todo → in progress → done)
- Protected API routes

## Running Locally
\`\`\`bash
git clone https://github.com/anjulaPeera/taskflow
cd taskflow
docker compose up
\`\`\`
App runs at http://localhost:3000

## What I Learned
- PostgreSQL schema design and relational data (foreign keys, cascades)
- JWT authentication flow end-to-end
- Docker multi-container setup with docker-compose
- GitHub Actions CI/CD pipeline (runs on every PR)
- Deploying a full-stack app to Azure App Service
- Writing integration tests with Jest and Supertest
