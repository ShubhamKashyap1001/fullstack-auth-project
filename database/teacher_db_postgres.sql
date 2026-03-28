CREATE DATABASE teacher_db;

\c teacher_db;

CREATE TABLE IF NOT EXISTS auth_user (
    id         SERIAL PRIMARY KEY,
    email      VARCHAR(191) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    phone      VARCHAR(20)  DEFAULT NULL,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teachers (
    id              SERIAL PRIMARY KEY,
    user_id         INT          NOT NULL UNIQUE REFERENCES auth_user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    university_name VARCHAR(255) NOT NULL,
    gender          VARCHAR(10)  NOT NULL CHECK (gender IN ('male','female','other')),
    year_joined     INT          NOT NULL,
    subject         VARCHAR(150) DEFAULT NULL,
    bio             TEXT         DEFAULT NULL,
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO auth_user (email, first_name, last_name, password, phone) VALUES
('lucky.sharma@example.com',  'Lucky',   'Sharma', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91-9876543210'),
('adarsh.verma@example.com',  'Adarsh',  'Verma',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91-9812345678'),
('ravi.gupta@example.com',    'Ravi',    'Gupta',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL),
('shubham.singh@example.com', 'Shubham', 'Singh',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91-9898989898');

INSERT INTO teachers (user_id, university_name, gender, year_joined, subject, bio) VALUES
(1, 'Delhi University',            'male', 2019, 'Computer Science', 'Lucky specialises in full-stack development and cloud computing.'),
(2, 'IIT Bombay',                  'male', 2021, 'Mathematics',      'Adarsh researches applied mathematics and data science.'),
(3, 'Jawaharlal Nehru University', 'male', 2018, 'Physics',          'Ravi works on quantum mechanics and theoretical physics.'),
(4, 'IIT Delhi',                   'male', 2020, 'Electronics',      'Shubham focuses on embedded systems and IoT applications.');
