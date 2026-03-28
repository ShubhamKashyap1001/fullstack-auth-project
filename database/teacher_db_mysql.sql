-- 1. Create Database
CREATE DATABASE IF NOT EXISTS teacher_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE teacher_db;

-- 2. USER TABLE
CREATE TABLE IF NOT EXISTS auth_user (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. TEACHER TABLE
CREATE TABLE IF NOT EXISTS teachers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL UNIQUE,
    university_name VARCHAR(255) NOT NULL,
    gender ENUM('male','female','other') NOT NULL,
    year_joined YEAR NOT NULL,
    subject VARCHAR(150),
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_teacher_user
    FOREIGN KEY (user_id) REFERENCES auth_user(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 4. INSERT USERS (password = "password")
INSERT INTO auth_user (email, first_name, last_name, password, phone) VALUES
('adarsh.singh@gmail.com', 'Adarsh', 'Singh', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543210'),
('shubham.raj@gmail.com', 'Shubham', 'Raj', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9123456780'),
('sudhanshu@gmail.com', 'Sudhanshu', 'Kumar', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9988776655'),
('ayush.kumar@gmail.com', 'Ayush', 'Kumar', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9090909090');

-- 5. INSERT TEACHERS
INSERT INTO teachers (user_id, university_name, gender, year_joined, subject, bio) VALUES
(1, 'Heritage Institute of Technology', 'male', 2018, 'Computer Science', 'Adarsh teaches full-stack development.'),
(2, 'Jadavpur University', 'female', 2019, 'Mechanical Engineering', 'Shubham specialises in core mechanical.'),
(3, 'NIT Durgapur', 'male', 2020, 'Electrical Engineering', 'Sudhanshu focuses on circuits and systems.'),
(4, 'IIT Kharagpur', 'female', 2017, 'Mathematics', 'Ayush teaches applied mathematics.');

-- 6. VIEW USERS
SELECT * FROM auth_user;

-- 7. VIEW TEACHERS WITH USER DATA (IMPORTANT)
SELECT 
    t.id,
    u.first_name,
    u.last_name,
    u.email,
    t.university_name,
    t.subject,
    t.gender
FROM teachers t
JOIN auth_user u ON u.id = t.user_id;