# Ski & Snowboard Lesson Booking Platform

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Backend: Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot-green.svg)
![Frontend: Vue.js](https://img.shields.io/badge/Frontend-Vue.js-blue.svg)
![Database: MySQL](https://img.shields.io/badge/Database-MySQL-orange.svg)

A full-stack web application designed to connect certified ski and snowboard instructors with students. This project serves as a comprehensive portfolio piece, built from the ground up using modern backend and frontend development practices with Spring Boot and Vue.js.

## ✨ Key Features

* **Role-Based Access Control:** Secure registration and login for two distinct user roles: `STUDENT` and `INSTRUCTOR`.
* **Instructor Profile Management:** Instructors can set up their detailed profiles, including their CASI certification level, years of experience, a personal bio, and teaching specialties.
* **Dynamic Availability Scheduling:** Instructors can manage their available time slots for lessons, which students can then book.
* **Student Profile Customization:** Students can create profiles detailing their ability level (Beginner, Intermediate, Pro) and preferred riding styles (Carving, Park, etc.).
* **Lesson Browse & Booking:** Students can browse available instructors and book lessons based on the instructor's availability.
* **Booking Management:** Both students and instructors have dashboards to view and manage their upcoming and past lessons.

## 🛠️ Built With

This project uses a modern, decoupled architecture.

**Backend:**
* [Java 17](https://www.oracle.com/java/)
* [Spring Boot](https://spring.io/projects/spring-boot) - Core framework
* [Spring Security](https://spring.io/projects/spring-security) - For authentication and authorization
* [Spring Data JPA (Hibernate)](https://spring.io/projects/spring-data-jpa) - For database interaction
* [Maven](https://maven.apache.org/) - Dependency Management
* [MySQL](https://www.mysql.com/) - Relational Database

**Frontend:**
* [Vue.js (Vue 3)](https://vuejs.org/) - Core framework
* [Vue Router](https://router.vuejs.org/) - For client-side routing
* [Pinia](https://pinia.vuejs.org/) - For state management
* [Axios](https://axios-http.com/) - For making API requests

## 📄 Database Schema

The database is designed to be normalized and scalable, with a clear separation of concerns.
## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Java JDK 17 or later
* Apache Maven 3.6+
* Node.js and npm
* MySQL Server

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Backend Setup:**
    * Open the project in your favorite IDE (e.g., IntelliJ IDEA).
    * Create a MySQL database for the project. e.g., `ski_booking_db`.
    * Navigate to `src/main/resources/` and configure your `application-dev.yml`:
        ```yaml
        spring:
          datasource:
            url: jdbc:mysql://localhost:3306/ski_booking_db?useSSL=false&serverTimezone=UTC
            username: your_mysql_username
            password: your_mysql_password
        ```
    * Let Maven download the dependencies.
    * Run the Spring Boot application.

3.  **Frontend Setup:**
    * Navigate to the frontend directory (e.g., `/frontend`):
        ```sh
        cd frontend
        ```
    * Install NPM packages:
        ```sh
        npm install
        ```
    * Start the frontend development server:
        ```sh
        npm run dev
        ```

4.  **Database Initialization:**
    * Connect to your MySQL database using a client (DBeaver, MySQL Workbench, etc.).
    * Run the SQL script located at `src/main/resources/schema.sql` (or wherever you place it) to create all the necessary tables.

You should now be able to access the application at `http://localhost:8080` (or your configured frontend port).

## 🗺️ Roadmap

* [ ] **Payment Integration:** Integrate with Stripe or PayPal for online lesson payments.
* [ ] **Review and Rating System:** Allow students to rate and review instructors after a lesson.
* [ ] **Real-time Notifications:** Implement notifications (e.g., via WebSockets or email) for booking confirmations and reminders.
* [ ] **Calendar View:** A visual calendar for both students and instructors to manage schedules.
* [ ] **Admin Dashboard:** A separate interface for administrators to manage users and content.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements
* Acknowledge any third-party libraries or resources used.
* Hat tip to anyone whose code was used as inspiration.
