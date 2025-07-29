# 📘 Routine Management System

## Overview

A **web-based application** for managing and organizing class routines efficiently. Built to serve different roles in an academic environment including Admins, Teachers, and Students. The system allows the creation, modification, viewing, and exporting of class schedules with built-in conflict detection and role-specific interfaces.

## Features

- Role-based access: Admin, Teacher, Student
- Drag-and-drop scheduling interface
- Conflict detection for room, teacher, and time overlaps
- Dynamic routine creation and modification
- View routines by batch, teacher, room, or day
- PDF export of final routine
- Clean and responsive UI

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MySQL (via MySQL Workbench)

## Prerequisites

- Python 3.x
- MySQL server
- Git
- Modern browser (Chrome, Firefox, Edge, etc.)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jamil-safi/Routine_management.git
cd Routine_management
```

### 2. Create and Activate Virtual Environment

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure MySQL

- MySQL server 
- Create a database (e.g., `routine_db`)

### 5. Run the Application

```bash
python app.py
```

Access via browser: [http://127.0.0.1:5000](http://127.0.0.1:5000)



## Contact

Developed by **Jamil Safi** GitHub: [github.com/jamil-safi](https://github.com/jamil-safi)

