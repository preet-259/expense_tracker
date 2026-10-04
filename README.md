# Expense Tracker Application
A full-stack web application designed to help users track their personal finances. Users can create custom categories, log daily expenses, and analyze their spending habits through a secure, personalized dashboard featuring real-time filtering, sorting, and analytics.

# Tech Stack
•	Frontend: Next.js, React, Tailwind CSS, Axios
•	Backend: NestJS, TypeScript, TypeORM, JWT Authentication
•	Database: MySQL

# Prerequisites
Before you begin, ensure you have the following installed on your machine:
•	Node.js (v16 or higher)
•	MySQL (v8.0 or higher)
•	Git

# Database Setup
This application uses TypeORM with synchronize: true, which means you do not need to manually create tables. You only need to create the empty database.
	1.	Open your MySQL terminal or GUI (like MySQL Workbench).
	2.	Run the following SQL command to create the database:
        CREATE DATABASE expense_tracker;

(The backend will automatically generate the user, category, and expense tables upon starting).

# Environment Variables
You will need to create two .env files—one for the backend and one for the frontend.
1. Backend .env
Create a .env file in the root of your backend folder and add the following variables. Update the database credentials to match your local MySQL setup:

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=expense_tracker

# JWT Security
JWT_SECRET=your_jwt_key

2. Frontend .env.local
Create a .env.local file in the root of your frontend folder to point the frontend to your backend API:
NEXT_PUBLIC_API_URL=http://localhost:3000

# How to Run the Application
Please follow these steps in order to launch the application successfully.
Step 1: Start the Backend
	1.	Open a terminal and navigate to the backend folder:
        cd backend

	2.	Install the necessary dependencies:
        npm install

	3.	Start the NestJS development server:
        npm run start:dev

(The backend should now be running on http://localhost:3000)

Step 2: Start the Frontend
	1.	Open a new, separate terminal window and navigate to the frontend folder:
        cd frontend

	2.	Install the frontend dependencies:
        npm install

	3.	Start the Next.js development server:
        npm run dev

(The frontend should now be running on http://localhost:3001 or http://localhost:3000 depending on port availability).

Step 3: Access the App
Open your browser and navigate to the frontend URL (e.g., http://localhost:3001). You will be greeted by the landing page where you can create a new account and begin tracking expenses.
Key Features Implemented
•	JWT Authentication: Secure user registration, login, and protected routes.
•	Relational Data Security: Users can only view, edit, and delete their own expenses and custom categories.
•	Lazy Seeding: New users are automatically provided with default categories (Food, Travel, Bills, etc.) upon their first login.
•	Data Integrity: Users cannot delete a category if it is currently linked to an existing expense.
•	Dashboard Analytics: Real-time calculation of Current Month Spend, Total Spend, and Transaction Count.
•	Advanced Data Handling: Instant client-side filtering (by category, date, text, and payment method) and sorting (by amount, date, and creation order).