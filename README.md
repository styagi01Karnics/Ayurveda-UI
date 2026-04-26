# Ganesha Ayurvedaa - Full Stack Application

## Tech Stack
- **Frontend**: React.js (Vite) with Tailwind CSS
- **Backend**: Java 17 + Spring Boot 3
- **Database**: PostgreSQL

## Project Structure
```
ganesha-ayurvedaa/
├── frontend/          # React.js application
└── backend/           # Spring Boot application
```

## Quick Start

### Prerequisites
- Node.js 18+ (tested with 18.20.8)
- Java 17+
- PostgreSQL 14+
- Maven 3.8+

### Database Setup
```sql
CREATE DATABASE ganesha_ayurvedaa;
CREATE USER ganesha_user WITH PASSWORD 'ganesha123';
GRANT ALL PRIVILEGES ON DATABASE ganesha_ayurvedaa TO ganesha_user;
```

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend runs on: http://localhost:8080

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

## Default Login
- Email: admin@ganesha.com
- Password: admin123

---

## Demo / Docker (Recommended)

Run the entire stack on any machine with only Docker installed — no Node, Java, or PostgreSQL required.

### Start everything
```bash
# First time or after code changes (builds images)
docker compose -f docker-compose.dev.yml up --build

# Subsequent runs (reuse existing images, faster)
docker compose -f docker-compose.dev.yml up
```

Open **http://localhost:5173** in the browser.

### Stop everything
```bash
docker compose -f docker-compose.dev.yml down
```

### Stop and wipe the database (clean slate)
```bash
docker compose -f docker-compose.dev.yml down -v
```

### Demo credentials
| Role   | Email                        | Password    |
|--------|------------------------------|-------------|
| Admin  | admin@ganesha.com            | admin123    |
| Doctor | dr.sheekha@ganesha.com       | doctor123   |

### Services
| Service  | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:5173    |
| Backend  | http://localhost:8080    |
| Postgres | localhost:5432           |

> **Prerequisite:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
