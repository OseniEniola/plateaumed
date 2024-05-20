# React App: User Management System

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Modules](#modules)
- [Installation](#installation)
- [Usage](#usage)
- [Mocked User Credentials](#mocked-user-credentials)
- [Persistence](#persistence)
- [Contributing](#contributing)
- [License](#license)

## Overview

This React application is designed to manage students and teachers. The app is divided into two main modules: Student Management and Teacher Management. The Student Management module is accessible to both teachers and admins, while the Teacher Management module is accessible only to admins. The application uses localStorage to persist user data, and includes mocked user credentials for testing purposes.

## Features

- **Login functionality:** Only teachers and admins can log in.
- **User Registration:** Both students and teachers can create accounts via the registration link on the login page.
- **Student Management:** Accessible to both teachers and admins for managing student data.
- **Teacher Management:** Accessible only to admins for managing teacher data.
- **Data Persistence:** User data is stored in localStorage to ensure persistence across sessions.

## Modules

### Student Management

Accessible by both teacher and admin roles. This module allows users to:

- View student details
- Add new students
- Edit existing student information
- Delete students

### Teacher Management

Accessible only by admin role. This module allows users to:

- View teacher details
- Add new teachers
- Edit existing teacher information
- Delete teachers

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/OseniEniola/plateaumed.git
   ```

2. Navigate to the project directory:
   ```sh
   cd plateaumed
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

4. Start the development server:
   ```sh
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Use the provided mocked credentials to log in or create a new account using the registration link.

## Routes
- /login
- /signup-user
- /app/teachers-list
- /app/students-list

## Mocked User Credentials

### Admin
- **Username:** admin3@example.com
- **Password:** password

### Teacher
- **Username:** teacher2@example.com
- **Password:** password

## Persistence

The application uses `localStorage` to persist user data. This ensures that any data added or modified by users will remain available even after refreshing the browser or restarting the application.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. For major changes, please open an issue to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Enjoy managing your students and teachers with this React application! If you encounter any issues or have any suggestions, feel free to open an issue on the GitHub repository.
