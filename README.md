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
