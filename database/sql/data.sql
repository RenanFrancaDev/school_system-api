-- Insert 3 Teachers
INSERT INTO users (full_name, email, password, type, registration, birth_date, created_at, updated_at) VALUES
('teacher1', 'teacher1@email.com', '$scrypt$n=16384,r=8,p=1$kXfRZmbJqYLwVtTdNNH7Fg$5WZ8vj2zrJmQYh6bNcL3xKvP9tGwE7aS1fR4zD8VqM', 'teacher', 'T001', '1980-01-01', NOW(), NOW()),
('teacher2', 'teacher2@email.com', '$scrypt$n=16384,r=8,p=1$kXfRZmbJqYLwVtTdNNH7Fg$5WZ8vj2zrJmQYh6bNcL3xKvP9tGwE7aS1fR4zD8VqM', 'teacher', 'T002', '1980-01-02', NOW(), NOW()),
('teacher3', 'teacher3@email.com', '$scrypt$n=16384,r=8,p=1$kXfRZmbJqYLwVtTdNNH7Fg$5WZ8vj2zrJmQYh6bNcL3xKvP9tGwE7aS1fR4zD8VqM', 'teacher', 'T003', '1980-01-03', NOW(), NOW()),

-- Insert 10 Student
INSERT INTO users (full_name, email, password, type, registration, birth_date, created_at, updated_at) VALUES
('student1', 'student1@email.com', '$scrypt$n=16384,r=8,p=1$kXfRZmbJqYLwVtTdNNH7Fg$5WZ8vj2zrJmQYh6bNcL3xKvP9tGwE7aS1fR4zD8VqM', 'student', 'S001', '2005-01-01', NOW(), NOW()),
('student2', 'student2@email.com', '$scrypt$n=16384,r=8,p=1$kXfRZmbJqYLwVtTdNNH7Fg$5WZ8vj2zrJmQYh6bNcL3xKvP9tGwE7aS1fR4zD8VqM', 'student', 'S002', '2005-01-02', NOW(), NOW()),
('student3', 'student3@email.com', '$scrypt$n=16384,r=8,p=1$kXfRZmbJqYLwVtTdNNH7Fg$5WZ8vj2zrJmQYh6bNcL3xKvP9tGwE7aS1fR4zD8VqM', 'student', 'S003', '2005-01-03', NOW(), NOW()),
('student4', 'student4@email.com', '$scrypt$n=16384,r=8,p=1$kXfRZmbJqYLwVtTdNNH7Fg$5WZ8vj2zrJmQYh6bNcL3xKvP9tGwE7aS1fR4zD8VqM', 'student', 'S004', '2005-01-04', NOW(), NOW()),
('student5', 'student5@email.com', '$scrypt$n=16384,r=8,p=1$kXfRZmbJqYLwVtTdNNH7Fg$5WZ8vj2zrJmQYh6bNcL3xKvP9tGwE7aS1fR4zD8VqM', 'student', 'S005', '2005-01-05', NOW(), NOW()),
('student6', 'student6@email.com', '$scrypt$n=16384,r=8,p=1$kXfRZmbJqYLwVtTdNNH7Fg$5WZ8vj2zrJmQYh6bNcL3xKvP9tGwE7aS1fR4zD8VqM', 'student', 'S006', '2005-01-06', NOW(), NOW()),
('student7', 'student7@email.com', '$scrypt$n=16384,r=8,p=1$kXfRZmbJqYLwVtTdNNH7Fg$5WZ8vj2zrJmQYh6bNcL3xKvP9tGwE7aS1fR4zD8VqM', 'student', 'S007', '2005-01-07', NOW(), NOW()),
('student8', 'student8@email.com', '$scrypt$n=16384,r=8,p=1$kXfRZmbJqYLwVtTdNNH7Fg$5WZ8vj2zrJmQYh6bNcL3xKvP9tGwE7aS1fR4zD8VqM', 'student', 'S008', '2005-01-08', NOW(), NOW()),
('student9', 'student9@email.com', '$scrypt$n=16384,r=8,p=1$kXfRZmbJqYLwVtTdNNH7Fg$5WZ8vj2zrJmQYh6bNcL3xKvP9tGwE7aS1fR4zD8VqM', 'student', 'S009', '2005-01-09', NOW(), NOW()),
('student10', 'student10@email.com', '$scrypt$n=16384,r=8,p=1$kXfRZmbJqYLwVtTdNNH7Fg$5WZ8vj2zrJmQYh6bNcL3xKvP9tGwE7aS1fR4zD8VqM', 'student', 'S010', '2005-01-10', NOW(), NOW());