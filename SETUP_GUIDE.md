# TeachPortal — Complete Setup Guide
# For Windows (PowerShell / CMD / VS Code Terminal)

---

## STEP 1 — Check MySQL is running

Open PowerShell or CMD in VS Code terminal and run:

```powershell
mysql --version
```

If MySQL is installed you'll see something like:
```
mysql  Ver 8.0.xx ...
```

If not installed, download MySQL from: https://dev.mysql.com/downloads/installer/

---

## STEP 2 — Log into MySQL

```powershell
mysql -u root -p
```

Enter your MySQL root password when prompted.
If you have no password set:

```powershell
mysql -u root
```

---

## STEP 3 — Create the database

Inside the MySQL shell (after logging in):

```sql
CREATE DATABASE teacher_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
EXIT;
```

---

## STEP 4 — Import the SQL dump

Back in PowerShell/CMD, navigate to your project folder:

```powershell
cd C:\path\to\fullstack-auth-project-fixed
```

Then import:

```powershell
mysql -u root -p teacher_db < database\teacher_db_mysql.sql
```

To verify data was imported:

```powershell
mysql -u root -p -e "USE teacher_db; SELECT id, email, first_name, last_name FROM auth_user;"
```

---

## STEP 5 — Configure backend .env

```powershell
cd backend
copy .env.example .env
```

Now open `.env` in VS Code and edit these lines:

```
database.default.hostname = localhost
database.default.database = teacher_db
database.default.username = root
database.default.password = YOUR_ACTUAL_PASSWORD
database.default.DBDriver = MySQLi
database.default.port     = 3306

JWT_SECRET_KEY = teachportal_secret_key_change_in_production
```

If your MySQL has NO password, leave password empty:
```
database.default.password =
```

---

## STEP 6 — Install PHP dependencies

```powershell
composer install
```

This installs CodeIgniter 4 and firebase/php-jwt (needed for JWT tokens).

---

## STEP 7 — Start the backend server

```powershell
php spark serve
```

You should see:
```
CodeIgniter development server started on http://localhost:8080
```

Test it in your browser: http://localhost:8080/api/login
(Should return a JSON error saying email/password required — that means it's working!)

---

## STEP 8 — Start the frontend

Open a NEW terminal in VS Code, then:

```powershell
cd frontend
npm install
npm start
```

Browser will open at http://localhost:3000

---

## STEP 9 — Test login

Use one of the seeded accounts:

| Email                        | Password    |
|------------------------------|-------------|
| lucky.sharma@example.com     | password123 |
| adarsh.verma@example.com     | password123 |
| ravi.gupta@example.com       | password123 |
| shubham.singh@example.com    | password123 |

---

## Troubleshooting

### "Failed to load dashboard data"
- This means the JWT token is not being accepted by the backend
- Make sure `composer install` was run (installs firebase/php-jwt)
- Make sure the `.env` file exists and has correct DB credentials
- Run `php spark serve` and check for errors in the terminal

### CORS error in browser
Add this to the top of `backend/public/index.php` (after `<?php`):

```php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}
```

### MySQL "Access denied"
Try connecting with explicit host:
```powershell
mysql -h 127.0.0.1 -u root -p
```

### Check if port 8080 is in use
```powershell
netstat -ano | findstr :8080
```

### Check PHP version (needs 8.1+)
```powershell
php --version
```
