# TeachPortal — Full Setup Guide

This document explains how to set up the **Frontend**, **Backend**, and **Database** step-by-step, including how to verify everything is working.

# 1. FRONTEND SETUP (React)

## Step 1:
cd frontend

## Step 2: Install Dependencies
npm install

## Step 3: Setup Environment Variables
REACT_APP_API_BASE_URL=http://localhost:8080/api

## Step 4: Run Frontend

npm start
http://localhost:3000

## Step 5: Verify Frontend

* Open browser → `http://localhost:3000`
* Try:

  * Register
  * Login
  * Dashboard

# 2. BACKEND SETUP (CodeIgniter 4)

## Step 1: Go to Backend Folder
cd backend

## Step 2: Install Dependencies

composer install

## Step 3: Setup `.env`
CI_ENVIRONMENT = development

app.baseURL = 'http://localhost:8080/'

database.default.hostname = localhost
database.default.database = teacher_db
database.default.username = root
database.default.password =
database.default.DBDriver = MySQLi

JWT_SECRET = your_secret_key

## Step 4: Run Backend
php spark serve


## Backend runs on:
http://localhost:8080

## Step 5: Test API
Open browser:
http://localhost:8080/api/teachers


# 3. DATABASE SETUP (MySQL)

## Step 1: Open MySQL

mysql -u root -p

## Step 2: Create Database
CREATE DATABASE teacher_db;
USE teacher_db;

# DATABASE CHECK COMMANDS 

## Check database
SHOW DATABASES;

## Use database
USE teacher_db;

## Show tables
SHOW TABLES;

## View users
SELECT * FROM auth_user;

## View teachers
SELECT * FROM teachers;

## Join
SELECT 
u.first_name,
u.last_name,
u.email,
t.university_name,
t.subject
FROM teachers t
JOIN auth_user u ON u.id = t.user_id;

