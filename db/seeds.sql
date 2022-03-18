USE company_db;

INSERT INTO departments (id, names)
VALUES
(1,'Human Resources'),
(2,'Marketing & Sales'),
(3,'Engineering'),
(4,'Accounting & Finance'),
(5,'Legal');

INSERT INTO roles (id, title, salary, department_id)
VALUES
(1,'HR administrator', 25640, 1),
(2,'Sales Manager', 34508, 2),
(3,'Finanical Analyst', 45689, 4),
(4,'Software Engineer', 55689, 3),
(5,'Full Stack Developer', 57689, 3),
(6,'Accountant', 59023, 4),
(7,'Finanical Analyst', 25647, 4),
(8,'Lawyer', 68935, 5);

INSERT INTO employees(id, first_name, last_name, role_id, manager_id)
VALUES
(1,'Nadira', 'Ali', 1, NULL),
(2,'Sumaya', 'Gure', 2, 1),
(3,'Fatumo', 'Abdullahi', 3, NULL),
(4,'Humma', 'Nosh', 4, 2),
(5,'Farhah', 'Din', 5, NULL),
(6,'Kenny', 'Hung', 6, 3),
(7,'John', 'Smith', 7, NULL),
(8,'Oliver', 'Williams', 8, NULL);

