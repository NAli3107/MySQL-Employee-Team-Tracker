USE company_db;

INSERT INTO departments (names)
VALUES
('Human Resources'),
('Marketing & Sales'),
('Engineering'),
('Accounting & Finance'),
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
('HR administrator'),
('Sales Manager'),
('Finanical Analyst'),
('Software Engineer'),
('Full Stack Developer'),
('Accountant'),
('Finanical Analyst'),
('Lawyer');

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
('Nadira', 'Ali', 1, NULL),
('Sumaya', 'Gure', 2, 1),
('Fatumo', 'Abdullahi', 3, NULL),
('Humma', 'Nosh', 4, 2),
('Farhah', 'Din', 5, NULL),
('Kenny', 'Hung', 6, 3),
('John', 'Smith', 7, NULL),
('Oliver', 'Williams', 8, NULL);

