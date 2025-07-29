CREATE DATABASE routines;
USE routines;



-- techers table 
CREATE TABLE teachers (
    teacher_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    designation VARCHAR(50),
    dept_name VARCHAR(50),
    is_coordinator BOOLEAN DEFAULT FALSE
);



-- Batches Table
CREATE TABLE batches (
    batch_id INT PRIMARY KEY AUTO_INCREMENT,
    level INT NOT NULL,
    term INT NOT NULL,
    batch INT NOT NULL,
    UNIQUE(batch , level , term)
);


--  Courses Table
CREATE TABLE courses (
	course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(20) NOT NULL,
    course_title VARCHAR(100),
    credit DECIMAL(4 , 2) NOT NULL ,
    level INT,
    term INT,
    is_sessional BOOLEAN DEFAULT FALSE
);

-- classroom table
CREATE TABLE classrooms (
    room_id INT PRIMARY KEY ,
    room_name VARCHAR(50) NOT NULL
);

-- table to store usable classrooms or labs for a course
CREATE TABLE corresponding_classrooms(
    course_id INT NOT NULL,
    room_id INT NOT NUll,
    PRIMARY KEY (course_id, room_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (room_id) REFERENCES classrooms(room_id)
);

-- routine
CREATE TABLE routines (
    routine_id INT PRIMARY KEY AUTO_INCREMENT,
    batch_id INT,
    active_status BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id)
);

-- table to store assigned teacher to a course in a specific routine for a batch
CREATE TABLE routine_course_teachers (
    routine_id INT,
    course_id INT,
    teacher_id INT,
    PRIMARY KEY (routine_id, course_id , teacher_id),
    FOREIGN KEY (routine_id) REFERENCES routines(routine_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

CREATE TABLE periods (
    period_id INT PRIMARY KEY AUTO_INCREMENT,
    routine_id INT,
    course_id INT,
    room_id INT,
    start_time TIME,
    end_time TIME,
    day_of_week ENUM('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
    section CHAR NOT NULL, 
    FOREIGN KEY (routine_id) REFERENCES routines(routine_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (room_id) REFERENCES classrooms(room_id)
);

-- batchs to which a teacher is assigned as course co-ordinators
CREATE TABLE course_coordinator_batches(
    teacher_id INT,
    batch_id INT,
    PRIMARY KEY(teacher_id, batch_id),
    FOREIGN KEY(teacher_id) REFERENCES teachers(teacher_id),
    FOREIGN KEY(batch_id) REFERENCES batches(batch_id)
);


-- ** Sample Data ** --


INSERT INTO batches (batch, level, term)
VALUES
(2019, 1, 1), (2019, 1, 2),
(2019, 2, 1), (2019, 2, 2),
(2019, 3, 1), (2019, 3, 2),
(2019, 4, 1), (2019, 4, 2),

(2020, 1, 1), (2020, 1, 2),
(2020, 2, 1), (2020, 2, 2),
(2020, 3, 1), (2020, 3, 2),
(2020, 4, 1), (2020, 4, 2),

(2021, 1, 1), (2021, 1, 2),
(2021, 2, 1), (2021, 2, 2),
(2021, 3, 1), (2021, 3, 2),
(2021, 4, 1), (2021, 4, 2),

(2022, 1, 1), (2022, 1, 2),
(2022, 2, 1), (2022, 2, 2),
(2022, 3, 1), (2022, 3, 2),
(2022, 4, 1), (2022, 4, 2),

(2023, 1, 1), (2023, 1, 2),
(2023, 2, 1), (2023, 2, 2),
(2023, 3, 1), (2023, 3, 2),
(2023, 4, 1), (2023, 4, 2),

(2024, 1, 1), (2024, 1, 2),
(2024, 2, 1), (2024, 2, 2),
(2024, 3, 1), (2024, 3, 2),
(2024, 4, 1), (2024, 4, 2);

INSERT INTO courses (course_code, course_title, credit , level, term, is_sessional)
VALUES
('CSE-141', 'Structured Programming', 3.0, 1, 1, FALSE),
('CSE-142', 'Structured Programming (Sessional)', 1.5, 1, 1, TRUE),
('CSE-100', 'Computer Fundamentals and Ethics', 0.75, 1, 1, TRUE),
('EE-181', 'Basic Electrical Engineering', 3.0, 1, 1, FALSE),
('EE-182', 'Basic Electrical Engineering (Sessional)', 1.5, 1, 1, TRUE),
('Hum-141', 'English', 2.0, 1, 1, FALSE),
('Math-141', 'Differential and Integral Calculus', 3.0, 1, 1, FALSE),
('Phy-141', 'Physics', 3.0, 1, 1, FALSE),
('Phy-142', 'Physics (Sessional)', 1.5, 1, 1, TRUE),
('CSE-111', 'Discrete Mathematics', 3.0, 1, 2, FALSE),
('CSE-143', 'Object Oriented Programming', 3.0, 1, 2, FALSE),
('CSE-144', 'Object Oriented Programming (Sessional)', 1.5, 1, 2, TRUE),
('Chem-141', 'Chemistry', 3.0, 1, 2, FALSE),
('Chem-142', 'Chemistry (Sessional)', 0.75, 1, 2, TRUE),
('EE-183', 'Electronic Devices and Circuits', 4.0, 1, 2, FALSE),
('EE-184', 'Electronic Devices and Circuits (Sessional)', 0.75, 1, 2, TRUE),
('Hum-144', 'English Skill Development (Sessional)', 1.5, 1, 2, TRUE),
('Math-143', 'Co-ordinate Geometry and Differential Equation', 3.0, 1, 2, FALSE),
('CSE-221', 'Digital Logic Design', 3.0, 2, 1, FALSE),
('CSE-222', 'Digital Logic Design (Sessional)', 1.5, 2, 1, TRUE),
('CSE-231', 'Applied Statistics', 3.0, 2, 1, FALSE),
('CSE-241', 'Data Structures', 3.0, 2, 1, FALSE),
('CSE-242', 'Data Structures (Sessional)', 1.5, 2, 1, TRUE),
('CSE-200', 'Competitive Programming (Sessional)', 0.75, 2, 1, TRUE),
('Hum-243', 'Engineering Economics', 3.0, 2, 1, FALSE),
('ME-246', 'Engineering Drawing & CAD (Sessional)', 1.5, 2, 1, TRUE),
('Math-241', 'Fourier Analysis and Laplace Transformation', 3.0, 2, 1, FALSE),
('CSE-223', 'Digital Signal Processing', 3.0, 2, 2, FALSE),
('CSE-224', 'Digital Signal Processing (Sessional)', 0.75, 2, 2, TRUE),
('CSE-202', 'Software Development with JAVA (Sessional)', 1.5, 2, 2, TRUE),
('CSE-251', 'Algorithms Design and Analysis', 3.0, 2, 2, FALSE),
('CSE-252', 'Algorithms Design and Analysis (Sessional)', 1.5, 2, 2, TRUE),
('EE-283', 'Electrical Drives and Instrumentation', 3.0, 2, 2, FALSE),
('EE-284', 'Electrical Drives and Instrumentation (Sessional)', 0.75, 2, 2, TRUE),
('Math-243', 'Vector Calculus, Linear Algebra and Complex Variables', 3.0, 2, 2, FALSE),
('CSE-313', 'Data Communication', 3.0, 3, 1, FALSE),
('CSE-314', 'Data Communication (Sessional)', 0.75, 3, 1, TRUE),
('CSE-326', 'Internet Programming (Sessional)', 1.5, 3, 1, TRUE),
('CSE-331', 'Theory of Computing', 2.0, 3, 1, FALSE),
('CSE-333', 'Microprocessors and Interfacing', 3.0, 3, 1, FALSE),
('CSE-334', 'Microprocessors and Interfacing (Sessional)', 1.5, 3, 1, TRUE),
('CSE-336', 'Operating Systems (Sessional)', 1.5, 3, 1, TRUE),
('CSE-354', 'System Analysis and Design (Sessional)', 0.75, 3, 1, TRUE),
('CSE-355', 'System Analysis and Design', 3.0, 3, 1, FALSE),
('CSE-311', 'Computer Networks', 3.0, 3, 2, FALSE),
('CSE-312', 'Computer Networks (Sessional)', 0.75, 3, 2, TRUE),
('CSE-300', 'Software Development Project (Sessional)', 0.75, 3, 2, TRUE),
('CSE-321', 'Computer Architecture', 3.0, 3, 2, FALSE),
('CSE-345', 'Artificial Intelligence', 3.0, 3, 2, FALSE),
('CSE-346', 'Artificial Intelligence with Python (Sessional)', 1.5, 3, 2, TRUE),
('CSE-347', 'Introduction to Mathematical Programming', 3.0, 3, 2, FALSE),
('CSE-302', 'Technical Writing and Presentation (Sessional)', 0.75, 3, 2, TRUE),
('CSE-356', 'Software Engineering (Sessional)', 0.75, 3, 2, TRUE),
('CSE-357', 'Software Engineering', 3.0, 3, 2, FALSE),
('CSE-435', 'Information Security', 3.0, 4, 1, FALSE),
('CSE-436', 'Information Security (Sessional)', 0.75, 4, 1, TRUE),
('CSE-437', 'Fundamentals of Internet of Things', 3.0, 4, 1, FALSE),
('CSE-438', 'Fundamentals of Internet of Things (Sessional)', 0.75, 4, 1, TRUE),
('CSE-445', 'Machine Learning', 3.0, 4, 1, FALSE),
('CSE-446', 'Machine Learning (Sessional)', 0.75, 4, 1, TRUE),
('CSE-402', 'Project & Thesis', 1.0, 4, 1, TRUE),
('CSE-400', 'Industrial Attachment (Sessional)', 1.5, 4, 1, TRUE),
('CSE-431', 'Compiler Design', 3.0, 4, 2, FALSE),
('CSE-432', 'Compiler Design (Sessional)', 1.50, 4, 2, TRUE),
('CSE-457', 'Computer Graphics', 3.0, 4, 2, FALSE),
('CSE-458', 'Computer Graphics (Sessional)', 0.75, 4, 2, TRUE),
('CSE-490', 'Project & Thesis', 3.0, 4, 2, TRUE),
('Hum-445', 'Engineering Management', 2.0, 4, 2, FALSE),
('Hum-447', 'Financial, Cost and Managerial Accounting', 2.0, 4, 2, FALSE),
('CSE-411', 'Simulation and Modeling', 3.0, 4, 1, FALSE),
('CSE-412', 'Simulation and Modeling (Sessional)', 0.75, 4, 1, TRUE),
('CSE-453', 'Digital Image Processing', 3.0, 4, 1, FALSE),
('CSE-454', 'Digital Image Processing (Sessional)', 0.75, 4, 1, TRUE),
('CSE-455', 'Embedded System Design', 3.0, 4, 1, FALSE),
('CSE-456', 'Embedded System Design (Sessional)', 0.75, 4, 1, TRUE),
('CSE-459', 'High Performance Computing', 3.0, 4, 1, FALSE),
('CSE-460', 'High Performance Computing (Sessional)', 0.75, 4, 1, TRUE),
('CSE-463', 'Algorithm Engineering', 3.0, 4, 1, FALSE),
('CSE-464', 'Algorithm Engineering (Sessional)', 0.75, 4, 1, TRUE),
('CSE-465', 'Data Mining', 3.0, 4, 1, FALSE),
('CSE-466', 'Data Mining (Sessional)', 0.75, 4, 1, TRUE),
('CSE-467', 'Mobile Applications Development', 3.0, 4, 1, FALSE),
('CSE-468', 'Mobile Applications Development (Sessional)', 0.75, 4, 1, TRUE),
('CSE-469', 'Numerical Analysis', 3.0, 4, 1, FALSE),
('CSE-470', 'Numerical Analysis (Sessional)', 0.75, 4, 1, TRUE),
('CSE-441', 'Multimedia Theory', 3.0, 4, 1, FALSE),
('CSE-442', 'Multimedia Theory (Sessional)', 0.75, 4, 1, TRUE),
('CSE-443', 'Neural Networks and Fuzzy Logic', 3.0, 4, 1, FALSE),
('CSE-444', 'Neural Networks and Fuzzy Logic (Sessional)', 0.75, 4, 1, TRUE),
('CSE-447', 'Human Computer Interaction', 3.0, 4, 1, FALSE),
('CSE-448', 'Human Computer Interaction (Sessional)', 0.75, 4, 1, TRUE),
('CSE-449', 'Communication Engineering', 3.0, 4, 1, FALSE),
('CSE-450', 'Communication Engineering (Sessional)', 0.75, 4, 1, TRUE),
('CSE-451', 'Communication Engineering (Sessional)', 0.75, 4, 1, TRUE),
('EE-481', 'Control System Engineering', 3.0, 4, 1, FALSE),
('CSE-443', 'Neural Networks and Fuzzy Logic', 3.0, 4, 1, FALSE),
('CSE-444', 'Neural Networks and Fuzzy Logic (Sessional)', 0.75, 4, 1, TRUE),
('CSE-415', 'Network Planning', 3.0, 4, 2, FALSE),
('CSE-416', 'Network Planning (Sessional)', 0.75, 4, 2, TRUE),
('CSE-417', 'Parallel & Distributed Processing', 3.0, 4, 2, FALSE),
('CSE-418', 'Parallel & Distributed Processing (Sessional)', 0.75, 4, 2, TRUE),
('CSE-419', 'VLSI Design', 3.0, 4, 2, FALSE),
('CSE-420', 'VLSI Design (Sessional)', 0.75, 4, 2, TRUE),
('CSE-421', 'Fault Tolerant Systems', 3.0, 4, 2, FALSE),
('CSE-422', 'Fault Tolerant Systems (Sessional)', 0.75, 4, 2, TRUE),
('CSE-423', 'Computational Geometry', 3.0, 4, 2, FALSE),
('CSE-424', 'Computational Geometry (Sessional)', 0.75, 4, 2, TRUE),
('CSE-425', 'Mobile and Wireless Networking', 3.0, 4, 2, FALSE),
('CSE-426', 'Mobile and Wireless Networking (Sessional)', 0.75, 4, 2, TRUE),
('CSE-427', 'Basic Graph Theory', 3.0, 4, 2, FALSE),
('CSE-428', 'Basic Graph Theory (Sessional)', 0.75, 4, 2, TRUE),
('CSE-429', 'High Performance Database', 3.0, 4, 2, FALSE),
('CSE-430', 'High Performance Database (Sessional)', 0.75, 4, 2, TRUE),
('CSE-431', 'Introduction to Bioinformatics', 3.0, 4, 2, FALSE),
('CSE-432', 'Introduction to Bioinformatics (Sessional)', 0.75, 4, 2, TRUE),
('CSE-433', 'Semantics of Programming Languages', 3.0, 4, 2, FALSE),
('CSE-434', 'Semantics of Programming Languages (Sessional)', 0.75, 4, 2, TRUE),
('CSE-435', 'Software Architecture', 3.0, 4, 2, FALSE),
('CSE-436', 'Software Architecture (Sessional)', 0.75, 4, 2, TRUE),
('CSE-437', 'Cyber Security and Forensics', 3.0, 4, 2, FALSE),
('CSE-438', 'Cyber Security and Forensics (Sessional)', 0.75, 4, 2, TRUE),
('CSE-439', 'Data Science', 3.0, 4, 2, FALSE),
('CSE-449', 'Data Science (Sessional)', 0.75, 4, 2, TRUE),
('CSE-441', 'Natural Language Processing', 3.0, 4, 2, FALSE),
('CSE-442', 'Natural Language Processing (Sessional)', 0.75, 4, 2, TRUE),
('CSE-443', 'Robotics Science and System', 3.0, 4, 2, FALSE),
('CSE-444', 'Robotics Science and System (Sessional)', 0.75, 4, 2, TRUE),
('CSE-445', 'Distributed Systems and Cloud Computing', 3.0, 4, 2, FALSE),
('CSE-446', 'Distributed Systems and Cloud Computing (Sessional)', 0.75, 4, 2, TRUE),
('CSE-447', 'Big Data', 3.0, 4, 2, FALSE),
('CSE-448', 'Big Data (Sessional)', 0.75, 4, 2, TRUE),
('Hum-411', 'Business Law', 2.0, 4, 2, FALSE),
('Hum-413', 'Sociology for Science and Technology', 2.0, 4, 2, FALSE),
('Hum-415', 'Government', 2.0, 4, 2, FALSE),
('Hum-417', 'Entrepreneurship for IT Business', 2.0, 4, 2, FALSE);



INSERT INTO classrooms (room_id, room_name) VALUES
(3101, 'Classroom'),
(3102, 'Classroom'),
(3103, 'Classroom'),
(3104, 'Classroom'),
(3105, 'Classroom'),
(3106, 'Classroom'),
(3107, 'Classroom'),
(3108, 'Classroom'),
(3109, 'Classroom'),
(3110, 'Classroom'),
(3201, 'Classroom'),
(3202, 'Classroom'),
(3203, 'Classroom'),
(3204, 'Classroom'),
(3205, 'Classroom'),
(3206, 'Classroom'),
(3207, 'Classroom'),
(3208, 'Classroom'),
(3209, 'Classroom'),
(3210, 'Classroom'),
(3211, 'Classroom'),
(3301, 'Classroom'),
(3302, 'Computer Laboratory'),
(3303, 'Networking & Communication Laboratory'),
(3304, 'Microprocessor & Interfacing Laboratory'),
(3305, 'Classroom'),
(3306, 'Classroom'),
(3307, 'Classroom'),
(3308, 'Classroom'),
(3309, 'Classroom'),
(3310, 'Classroom'),
(3311, 'Classroom'),
(3401, 'Multimedia Laboratory'),
(3402, 'Hardware & Networking Laboratory'),
(3403, 'Electronics & Circuit Laboratory'),
(3404, 'Compiler Laboratory'),
(3405, 'Classroom'),
(3406, 'Classroom'),
(3407, 'Classroom'),
(3408, 'Classroom'),
(3409, 'Classroom'),
(3410, 'Classroom'),
(3411, 'Classroom'),
(3501, 'Robotics Lab'),
(3502, 'Mobile Games & Apps Development Centre'),
(3503, 'FAB LAB CUET'),
(3504, 'Classroom'),
(3505, 'Classroom'),
(3506, 'Classroom'),
(3507, 'Classroom'),
(3508, 'Classroom'),
(3509, 'Classroom'),
(3510, 'Classroom'),
(3511, 'Classroom'),
(3601, 'Classroom'),
(3602, 'Classroom'),
(3603, 'Classroom'),
(3604, 'Classroom'),
(3605, 'Classroom'),
(3606, 'Classroom'),
(3607, 'Classroom'),
(3608, 'Classroom'),
(3609, 'Classroom'),
(3610, 'Classroom'),
(3611, 'Classroom');


INSERT INTO corresponding_classrooms (course_id, room_id) VALUES
(2, 3201),  -- CSE-142 (Structured Programming (Sessional)) -> Computer Laboratory
(2, 3401),  -- CSE-142 -> Multimedia Laboratory
(4, 3202),  -- CSE-144 (Object Oriented Programming (Sessional)) -> Networking & Communication Laboratory
(4, 3402),  -- CSE-144 -> Hardware & Networking Laboratory
(14, 3203), -- Chem-142 (Chemistry (Sessional)) -> Microprocessor & Interfacing Laboratory
(14, 3501), -- Chem-142 -> Robotics Lab
(16, 3204), -- EE-184 (Electronic Devices and Circuits (Sessional)) -> Multimedia Laboratory
(16, 3403), -- EE-184 -> Electronics & Circuit Laboratory
(18, 3205), -- Hum-144 (English Skill Development (Sessional)) -> Hardware & Networking Laboratory
(18, 3502), -- Hum-144 -> Mobile Games & Apps Development Centre
(20, 3206), -- CSE-222 (Digital Logic Design (Sessional)) -> Electronics & Circuit Laboratory
(20, 3404), -- CSE-222 -> Compiler Laboratory
(24, 3207), -- CSE-242 (Data Structures (Sessional)) -> Compiler Laboratory
(24, 3503), -- CSE-242 -> FAB LAB CUET
(26, 3208), -- ME-246 (Engineering Drawing & CAD (Sessional)) -> Robotics Lab
(26, 3401), -- ME-246 -> Multimedia Laboratory
(30, 3209), -- CSE-224 (Digital Signal Processing (Sessional)) -> Mobile Games & Apps Development Centre
(30, 3402), -- CSE-224 -> Hardware & Networking Laboratory
(32, 3210), -- CSE-202 (Software Development with JAVA (Sessional)) -> FAB LAB CUET
(32, 3501), -- CSE-202 -> Robotics Lab
(34, 3211), -- CSE-252 (Algorithms Design and Analysis (Sessional)) -> Networking & Communication Laboratory
(34, 3403), -- CSE-252 -> Electronics & Circuit Laboratory
(36, 3302), -- EE-284 (Electrical Drives and Instrumentation (Sessional)) -> Computer Laboratory
(36, 3502), -- EE-284 -> Mobile Games & Apps Development Centre
(38, 3303), -- CSE-314 (Data Communication (Sessional)) -> Networking & Communication Laboratory
(38, 3404), -- CSE-314 -> Compiler Laboratory
(40, 3304), -- CSE-326 (Internet Programming (Sessional)) -> Microprocessor & Interfacing Laboratory
(40, 3503), -- CSE-326 -> FAB LAB CUET
(42, 3305), -- CSE-334 (Microprocessors and Interfacing (Sessional)) -> Hardware & Networking Laboratory
(42, 3401), -- CSE-334 -> Multimedia Laboratory
(44, 3306), -- CSE-336 (Operating Systems (Sessional)) -> Electronics & Circuit Laboratory
(44, 3501), -- CSE-336 -> Robotics Lab
(46, 3307), -- CSE-354 (System Analysis and Design (Sessional)) -> Compiler Laboratory
(46, 3402), -- CSE-354 -> Hardware & Networking Laboratory
(48, 3308), -- CSE-312 (Computer Networks (Sessional)) -> Robotics Lab
(48, 3502), -- CSE-312 -> Mobile Games & Apps Development Centre
(50, 3309), -- CSE-300 (Software Development Project (Sessional)) -> FAB LAB CUET
(50, 3403), -- CSE-300 -> Electronics & Circuit Laboratory
(52, 3310), -- CSE-346 (Artificial Intelligence with Python (Sessional)) -> Multimedia Laboratory
(52, 3503), -- CSE-346 -> FAB LAB CUET
(54, 3311), -- CSE-302 (Technical Writing and Presentation (Sessional)) -> Networking & Communication Laboratory
(54, 3404), -- CSE-302 -> Compiler Laboratory
(56, 3405), -- CSE-356 (Software Engineering (Sessional)) -> Microprocessor & Interfacing Laboratory
(56, 3501), -- CSE-356 -> Robotics Lab
(58, 3406), -- CSE-436 (Information Security (Sessional)) -> Computer Laboratory
(58, 3502), -- CSE-436 -> Mobile Games & Apps Development Centre
(60, 3407), -- CSE-438 (Fundamentals of Internet of Things (Sessional)) -> Hardware & Networking Laboratory
(60, 3401), -- CSE-438 -> Multimedia Laboratory
(62, 3408), -- CSE-446 (Machine Learning (Sessional)) -> Electronics & Circuit Laboratory
(62, 3503), -- CSE-446 -> FAB LAB CUET
(64, 3409), -- CSE-432 (Compiler Design (Sessional)) -> Compiler Laboratory
(64, 3402), -- CSE-432 -> Hardware & Networking Laboratory
(66, 3410), -- CSE-458 (Computer Graphics (Sessional)) -> Robotics Lab
(66, 3501), -- CSE-458 -> Robotics Lab
(68, 3411), -- CSE-412 (Simulation and Modeling (Sessional)) -> Networking & Communication Laboratory
(68, 3403), -- CSE-412 -> Electronics & Circuit Laboratory
(70, 3504), -- CSE-454 (Digital Image Processing (Sessional)) -> Multimedia Laboratory
(70, 3502), -- CSE-454 -> Mobile Games & Apps Development Centre
(72, 3505), -- CSE-456 (Embedded System Design (Sessional)) -> Microprocessor & Interfacing Laboratory
(72, 3404), -- CSE-456 -> Compiler Laboratory
(74, 3506), -- CSE-460 (High Performance Computing (Sessional)) -> Computer Laboratory
(74, 3503), -- CSE-460 -> FAB LAB CUET
(76, 3507), -- CSE-464 (Algorithm Engineering (Sessional)) -> Hardware & Networking Laboratory
(76, 3401), -- CSE-464 -> Multimedia Laboratory
(78, 3508), -- CSE-466 (Data Mining (Sessional)) -> Electronics & Circuit Laboratory
(78, 3501), -- CSE-466 -> Robotics Lab
(80, 3509), -- CSE-468 (Mobile Applications Development (Sessional)) -> Mobile Games & Apps Development Centre
(80, 3402), -- CSE-468 -> Hardware & Networking Laboratory
(82, 3510), -- CSE-470 (Numerical Analysis (Sessional)) -> Compiler Laboratory
(82, 3502), -- CSE-470 -> Mobile Games & Apps Development Centre
(84, 3511), -- CSE-442 (Multimedia Theory (Sessional)) -> Multimedia Laboratory
(84, 3403), -- CSE-442 -> Electronics & Circuit Laboratory
(86, 3601), -- CSE-444 (Neural Networks and Fuzzy Logic (Sessional)) -> Networking & Communication Laboratory
(86, 3503), -- CSE-444 -> FAB LAB CUET
(88, 3602), -- CSE-448 (Big Data (Sessional)) -> Computer Laboratory
(88, 3404), -- CSE-448 -> Compiler Laboratory
(90, 3603), -- CSE-450 (Communication Engineering (Sessional)) -> Hardware & Networking Laboratory
(90, 3501), -- CSE-450 -> Robotics Lab
(92, 3604), -- CSE-416 (Network Planning (Sessional)) -> Microprocessor & Interfacing Laboratory
(92, 3401), -- CSE-416 -> Multimedia Laboratory
(94, 3605), -- CSE-418 (Parallel & Distributed Processing (Sessional)) -> Electronics & Circuit Laboratory
(94, 3502), -- CSE-418 -> Mobile Games & Apps Development Centre
(96, 3606), -- CSE-420 (VLSI Design (Sessional)) -> Compiler Laboratory
(96, 3402), -- CSE-420 -> Hardware & Networking Laboratory
(98, 3607), -- CSE-422 (Fault Tolerant Systems (Sessional)) -> Robotics Lab
(98, 3503), -- CSE-422 -> FAB LAB CUET
(100, 3608), -- CSE-424 (Computational Geometry (Sessional)) -> Networking & Communication Laboratory
(100, 3403), -- CSE-424 -> Electronics & Circuit Laboratory
(102, 3609), -- CSE-426 (Mobile and Wireless Networking (Sessional)) -> Mobile Games & Apps Development Centre
(102, 3501), -- CSE-426 -> Robotics Lab
(104, 3610), -- CSE-428 (Basic Graph Theory (Sessional)) -> Microprocessor & Interfacing Laboratory
(104, 3404), -- CSE-428 -> Compiler Laboratory
(106, 3611), -- CSE-430 (High Performance Database (Sessional)) -> Computer Laboratory
(106, 3502); -- CSE-430 -> Mobile Games & Apps Development Centre


-- password - 123
INSERT INTO teachers (name, email, password, designation, dept_name, is_coordinator) VALUES
('Md. Rashadur Rahman', 'rashadur@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', TRUE),
('Dr. Pranab Kumar Dhar', 'pranabdhar81@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Professor', 'cse', FALSE),
('Dr. Kaushik Deb', 'debkaushik99@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Professor', 'cse', FALSE),
('Dr. Mohammed Moshiul Hoque', 'moshiul_240@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Professor', 'cse', FALSE),
('Prof. Dr. Mohammad Shamsul Arefin', 'sarefin@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Professor', 'cse', FALSE),
('Dr. Asaduzzaman', 'asad@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Professor', 'cse', FALSE),
('Dr. Md. Mokammel Haque', 'mokammel@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Professor', 'cse', FALSE),
('Dr. Abu Hasnat Mohammad Ashfak Habib', 'ashfak@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Professor', 'cse', FALSE),
('Muhammad Kamal Hossen', 'mkhossen@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Mohammad Obaidur Rahman', 'obaidur_91@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Tahmina Khanam', 'tahmina_iict@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Lamia Alam', 'lamia_alam@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Shayla Sharmin', 'shayla_sharmin@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Animesh Chandra Roy', 'animesh_roy@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Md. Sabir Hossain', 'sabir.cse@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Md. Shafiul Alam Forhad', 'forhad0904063@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Md. Mynul Hasan', 'mynul@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Annesha Das', 'annesha@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Ashim Dey', 'ashim@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Omar Sharif', 'omar.sharif@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Sabiha Anan', 'sabiha.anan@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', TRUE),
('Md. Atiqul Islam Rizvi', 'atiqul.rizvi@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Hasan Murad', 'hasanmurad@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', TRUE),
('Saadman Sakib', 'saadman@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Shuhena Salam Aonty', 'shuhena@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Md. Al-Mamun Provath', 'am.provath@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', TRUE),
('Maisha Fahmida', 'maisha.fahmida@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Afroza Akter', 'afroza@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Atiya Masuda Siddika', 'atiya.siddika@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE),
('Ayesha Banu', 'ayesha.banu@cuet.ac.bd', '$2b$12$I8gzQ.ENgMU1.jP9wYtLpeLbRssSmwtZ24IgvFHoOBPkyxXtQfq7O', 'Assistant Professor', 'cse', FALSE);


-- assigning 'rashadur@cuet.ac.bd' as course teacher of all the batch from (19 - 24) for testing
insert into course_coordinator_batches ( teacher_id , batch_id) VALUES
(1 , 1) , (1 , 2) , (1 , 3) , (1 , 4) , (1 , 5) , (1 , 6) , (1 , 7) , (1 , 8) , (1 , 9) , (1 , 10) , (1 , 11) , (1 , 12) , (1 , 13) , (1 , 14) , 
(1 , 15) , (1 , 16), (1 , 17) , (1 , 18) , (1 , 19) , (1 , 20) , (1 , 21) , (1 , 22) , (1 , 23) , (1 , 24) , (1 , 25) , (1 , 26) , (1 , 27) , 
(1 , 28) , (1 , 29) , (1 , 30) , (1 , 31) , (1 , 32), (1 , 33) , (1 , 34) , (1 , 35) , (1 , 36) , (1 , 37) , (1 , 38) , 
( 1, 39) , (1 , 40) , (1 , 41) , (1 , 42) , (1 , 43) , (1 , 44) , (1 , 45) , (1 , 46) , (1 , 47) , (1 , 48);
