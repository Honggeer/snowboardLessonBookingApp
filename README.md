# 🏔️ Snowboard Lesson Booking App

An online platform for booking snowboard lessons with certified instructors. This app allows students to browse instructors, select preferred teaching styles, and book available time slots. Instructors can manage their availability and provide detailed teaching profiles.

---

## 🚀 Features

- User authentication and role-based access (Admin / Instructor / Student)
- Instructor profile management with CASI level and teaching content
- Student profile with skill level and style preferences
- Time slot management and real-time booking availability
- Support for multiple teaching styles
- Email verification and secure password hashing

---

## 🛠️ Tech Stack

### Backend:
- **Java 17**
- **Spring Boot 3**
- **Spring Data JPA**
- **Spring Security**
- **MySQL**
- **Hibernate**
- **Redis** (for caching)
- **Maven**
- **Docker**

### Frontend:
- **React.js**
- **Tailwind CSS**
- **Axios**
- (Coming soon...)

### Deployment & Tools:
- **AWS EC2** (deployed instance)
- **NGINX** (reverse proxy)
- **GitHub Actions** (CI/CD in progress)
- **IntelliJ IDEA** (development IDE)

---

## 🧩 Database Schema Overview

### `users` – Core User Table

| Field             | Type                                              | Description                  |
|------------------|---------------------------------------------------|------------------------------|
| id               | BIGINT, Primary Key                               | User ID                      |
| email            | VARCHAR(255), Unique, Not Null                    | Login email                  |
| phone_number     | VARCHAR(50), Unique, Not Null                     | Contact number               |
| password_hash    | VARCHAR(255), Not Null                            | Hashed password              |
| user_name        | VARCHAR(100), Not Null                            | Username                     |
| role             | ENUM('ADMIN', 'INSTRUCTOR', 'STUDENT')            | User role                    |
| status           | ENUM('UNVERIFIED', 'ACTIVE', 'SUSPENDED')         | Account status               |
| verification_token | VARCHAR(255), Unique                           | Email verification token     |
| token_expiry     | DATETIME                                          | Token expiration timestamp   |
| created_at       | TIMESTAMP, Default CURRENT_TIMESTAMP              | Record creation time         |
| updated_at       | TIMESTAMP, Auto-updated                           | Last update timestamp        |

---

### `instructor_profiles` – Instructor Details

| Field             | Type                                                   | Description             |
|------------------|--------------------------------------------------------|-------------------------|
| user_id          | BIGINT, Primary Key (FK to `users`)                    | Linked user ID          |
| casi_level       | ENUM('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'PARK_1', 'PARK_2') | CASI Certification Level |
| experience_years | INT, Not Null                                          | Years of experience     |
| bio              | TEXT                                                   | Bio introduction        |
| teaching_content | TEXT                                                   | Description of lessons  |

---

### `student_profiles` – Student Details

| Field         | Type                                                  | Description             |
|--------------|-------------------------------------------------------|-------------------------|
| user_id      | BIGINT, Primary Key (FK to `users`)                   | Linked user ID          |
| date_of_birth| DATE, Not Null                                        | Date of birth           |
| gender       | ENUM('MALE', 'FEMALE', 'OTHER'), Not Null             | Gender                  |
| height_cm    | INT, Not Null                                         | Height in cm            |
| weight_kg    | DECIMAL(5, 2), Not Null                               | Weight in kg            |
| ability_level| ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PRO')  | Skill level (optional)  |

---

### `styles` – Teaching Styles

| Field | Type                            | Description         |
|-------|---------------------------------|---------------------|
| id    | INT, Primary Key, Auto-increment| Style ID            |
| name  | VARCHAR(100), Unique, Not Null  | Style name          |

---

### `student_styles` – Student Style Preferences (Many-to-Many)

| Field       | Type     | Description           |
|-------------|----------|-----------------------|
| student_id  | BIGINT   | Linked student ID (FK)|
| style_id    | INT      | Linked style ID (FK)  |
| Primary Key | (student_id, style_id)           |

---

### `availabilities` – Instructor Time Slots

| Field         | Type                              | Description                     |
|---------------|-----------------------------------|---------------------------------|
| id            | BIGINT, Primary Key               | Slot ID                         |
| instructor_id | BIGINT, Not Null (FK to `users`)  | Linked instructor               |
| start_time    | DATETIME, Not Null                | Start of availability           |
| end_time      | DATETIME, Not Null                | End of availability             |
| is_booked     | TINYINT(1), Default 0             | Booking status                  |
| notes         | TEXT                              | Optional notes                  |
| created_at    | TIMESTAMP, Default CURRENT_TIMESTAMP | Creation time               |
| updated_at    | TIMESTAMP, Auto-updated           | Last updated time               |

---

## 🧪 Development & Testing

- Environment config via `application.yml` and profile-based separation (`application-dev.yml`)
- Dockerized MySQL and Redis setup (see `docker-compose.yml`)
- API testing with Postman (collections available)
- Frontend dev under `client/` (React app)

---

## 📦 Setup Instructions

```bash
# Backend
cd backend/
mvn clean install
./mvnw spring-boot:run

# Frontend (if already initialized)
cd client/
npm install
npm run dev
