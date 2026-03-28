# TeachPortal — Full Stack Auth Project

A CodeIgniter 4 + ReactJS application with JWT-based authentication and teacher management.

---

## Project Structure

```
fullstack-auth-project/
├── backend/        CodeIgniter 4 REST API
├── frontend/       ReactJS application
└── database/       SQL dump files
```

---

## Backend Setup (CodeIgniter 4)

### Prerequisites
- PHP 8.1+
- Composer
- MySQL or PostgreSQL

### Steps

```bash
cd backend
composer install
cp .env.example .env
```

Edit `.env` with your database credentials:

**MySQL:**
```
database.default.DBDriver = MySQLi
database.default.hostname = localhost
database.default.database = teacher_db
database.default.username = root
database.default.password = your_password
database.default.port     = 3306
JWT_SECRET_KEY            = any_long_random_string
```

**PostgreSQL:**
```
database.default.DBDriver = Postgre
database.default.hostname = localhost
database.default.database = teacher_db
database.default.username = postgres
database.default.password = your_password
database.default.port     = 5432
JWT_SECRET_KEY            = any_long_random_string
```

### Option A — Migrations (recommended)

```bash
php spark migrate
php spark serve
```

### Option B — Import SQL dump

**MySQL:**
```bash
mysql -u root -p teacher_db < ../database/teacher_db_mysql.sql
php spark serve
```

**PostgreSQL:**
```bash
psql -U postgres -d teacher_db -f ../database/teacher_db_postgres.sql
php spark serve
```

API runs at: `http://localhost:8080`

> Sample seed passwords are all `password123`

---

## Frontend Setup (ReactJS)

### Prerequisites
- Node.js 16+
- npm

### Steps

```bash
cd frontend
npm install
npm start
```

App runs at: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint        | Auth     | Description              |
|--------|----------------|----------|--------------------------|
| POST   | /api/register  | Public   | Register user + teacher  |
| POST   | /api/login     | Public   | Login and get token      |
| GET    | /api/users     | JWT      | List all users           |
| GET    | /api/teachers  | JWT      | List all teachers        |
| POST   | /api/teacher   | JWT      | Create teacher + user    |

---

## Database Schema

### auth_user
| Column     | Type         |
|------------|--------------|
| id         | INT PK AI    |
| email      | VARCHAR(191) |
| first_name | VARCHAR(100) |
| last_name  | VARCHAR(100) |
| password   | VARCHAR(255) |
| phone      | VARCHAR(20)  |
| created_at | DATETIME     |
| updated_at | DATETIME     |

### teachers
| Column          | Type         |
|-----------------|--------------|
| id              | INT PK AI    |
| user_id         | INT FK       |
| university_name | VARCHAR(255) |
| gender          | ENUM         |
| year_joined     | SMALLINT     |
| subject         | VARCHAR(150) |
| bio             | TEXT         |
| created_at      | DATETIME     |
| updated_at      | DATETIME     |
