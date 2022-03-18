DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE departments(
    id INT NOT NULL AUTO_INCREMENT,
    names VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE roles(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL (7,2) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id)
    REFERENCES departments(id),
    ON DELETE SET NULL
);


CREATE TABLE employees(
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id)
    REFERENCES roles(id),
    manager_id INT NOT NULL,
    FOREIGN KEY (manager_id)
    REFERENCES employees(id)
    ON DELETE CASCADE
);

