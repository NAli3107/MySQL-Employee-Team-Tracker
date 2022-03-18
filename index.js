/* Importing and requiring mySQL */
const mysql = require("mysql2");

/* Importing and requiring inquirer */
const inquirer = require("inquirer");

/* Importing and requiring console.table to print MySQL rows to the console */
require("console.table");

/* Connect to database */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "company_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log(`Connected to the company_db database.`);
  promptMenu();
});

/* Inquirer prompts to render questions.*/
const promptMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "selectOptions",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Update an employee manager",
          "Delete a department",
          "Delete a role",
          "Delete an employee",
          "Quit",
        ],
      },
    ])
    .then((options) => {
      switch (options.selectOptions) {
        case "View all departments":
          renderDepartments();
          break;
        case "View all roles":
          showRoles();
          break;
        case "View all employees":
          renderEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployee();
          break;
        case "Update an employee manager":
          updateManager();
          break;
        case "Delete a department":
          deleteDepartment();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;

        default:
          db.end();
      }
    });
};

/* Function to show all departments */
function renderDepartments() {
  console.log("Showing all departments...\n");
  db.query(`SELECT * FROM departments`, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptMenu();
  });
}

/* Function to show all roles */
function showRoles() {
  console.log("Showing all roles...\n");
  db.query(
    `SELECT * FROM roles LEFT JOIN departments ON roles.department_id = departments.id `,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      promptMenu();
    }
  );
}

/* Function to show all employees */
function renderEmployees() {
  console.log("Showing all employees...\n");
  db.query(
    `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.id`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      promptMenu();
    }
  );
}

/* Function to add a department */
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "What is the name of the department you would like to add?",
      },
    ])
    .then((answers) => {
      const sql = `INSERT INTO departments (names)
                VALUES (?)`;
      db.query(sql, answers.addDepartment, (err, result) => {
        if (err) throw err;
        console.log("Added " + answers.addDepartment + " to departments!");

        renderDepartments();
      });
    });
}

/* Function to add a role */
function addRole() {
  db.query(`SELECT * FROM departments;`, (err, res) => {
    if (err) throw err;
    let department = res.map((departments) => ({
      name: departments.names,
      value: departments.id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "role",
          message: "What role do you want to add?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of this role?",
        },
        {
          type: "list",
          name: "deptName",
          message: "Which department do you want to add the new role to?",
          choices: department,
        },
      ])
      .then((answers) => {
        db.query(
          `INSERT INTO roles SET ?`,
          {
            title: answers.role,
            salary: answers.salary,
            department_id: answers.deptName,
          },
          (err, res) => {
            if (err) throw err;
            console.log(
              `\n ${answers.role} successfully added to database! \n`
            );
            promptMenu();
          }
        );
      });
  });
}

/* Function to add an employee */
function addEmployee() {
  db.query(`SELECT * FROM roles;`, (err, res) => {
    if (err) throw err;
    let role = res.map((roles) => ({ name: roles.title, value: roles.id }));
    db.query(`SELECT * FROM employees;`, (err, res) => {
      if (err) throw err;
      let employee = res.map((employees) => ({
        name: employees.first_name + " " + employees.last_name,
        value: employees.id,
      }));
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is the new employee's first name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the new employee's last name?",
          },
          {
            type: "list",
            name: "role",
            message: "What is the new employee's title?",
            choices: role,
          },
          {
            type: "list",
            name: "manager",
            message: "Who is the new employee's manager?",
            choices: employee,
          },
        ])
        .then((answers) => {
          db.query(
            `INSERT INTO employees SET ?`,
            {
              first_name: answers.firstName,
              last_name: answers.lastName,
              role_id: answers.role,
              manager_id: answers.manager,
            },
            (err, res) => {
              if (err) throw err;
              console.log(
                `\n ${answers.firstName} ${answers.lastName} successfully added to database! \n`
              );
              promptMenu();
            }
          );
        });
    });
  });
}

/* Function to update an employee */
function updateEmployee() {
  db.query(`SELECT * FROM roles;`, (err, res) => {
    if (err) throw err;
    let role = res.map((roles) => ({ name: roles.title, value: roles.id }));
    db.query(`SELECT * FROM employees;`, (err, res) => {
      if (err) throw err;
      let employee = res.map((employees) => ({
        name: employees.first_name + " " + employees.last_name,
        value: employees.id,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to update the role for?",
            choices: employee,
          },
          {
            type: "list",
            name: "newRole",
            message: "What should the employee's new role be?",
            choices: role,
          },
        ])
        .then((answers) => {
          db.query(
            `UPDATE employees SET ? WHERE ?`,
            [
              {
                role_id: answers.newRole,
              },
              {
                id: answers.employee,
              },
            ],
            (err, res) => {
              if (err) throw err;
              console.log(
                `\n Successfully updated employee's role in the database! \n`
              );
              promptMenu();
            }
          );
        });
    });
  });
}

/* Function to update manager */
function updateManager() {
  db.query(`SELECT * FROM employees;`, (err, res) => {
    if (err) throw err;
    let employee = res.map((employees) => ({
      name: employees.first_name + " " + employees.last_name,
      value: employees.id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to update the manager for?",
          choices: employee,
        },
        {
          type: "list",
          name: "newManager",
          message: "Who should the employee's new manager be?",
          choices: employee,
        },
      ])
      .then((answers) => {
        db.query(
          `UPDATE employees SET ? WHERE ?`,
          [
            {
              manager_id: answers.newManager,
            },
            {
              id: answers.employee,
            },
          ],
          (err, res) => {
            if (err) throw err;
            console.log(
              `\n Successfully updated employee's manager in the database! \n`
            );
            promptMenu();
          }
        );
      });
  });
}

/* Function to delete departments */
function deleteDepartment() {
  db.query(`SELECT * FROM departments`, (err, res) => {
    if (err) throw err;
    let department = res.map((departments) => ({
      name: departments.name,
      value: departments.id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "deptName",
          message: "Which department would you like to delete?",
          choices: department,
        },
      ])
      .then((answers) => {
        db.query(
          `DELETE FROM departments WHERE ?`,
          [
            {
              id: answers.deptName,
            },
          ],
          (err, res) => {
            if (err) throw err;
            console.log(
              `\n Successfully removed the department from the database! \n`
            );
            promptMenu();
          }
        );
      });
  });
}

/* Function to delete role */
function deleteRole() {
  db.query(`SELECT * FROM roles`, (err, res) => {
    if (err) throw err;
    let role = res.map((roles) => ({ name: roles.title, value: roles.id }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "title",
          message: "Which role would you like to delete?",
          choices: role,
        },
      ])
      .then((answers) => {
        db.query(
          `DELETE FROM roles WHERE ?`,
          [
            {
              id: answers.title,
            },
          ],
          (err, res) => {
            if (err) throw err;
            console.log(
              `\n Successfully removed the role from the database! \n`
            );
            promptMenu();
          }
        );
      });
  });
}

/* Function to delete employees */
function deleteEmployee() {
  db.query(`SELECT * FROM employees`, (err, res) => {
    if (err) throw err;
    let employee = res.map((employees) => ({
      name: employees.first_name + " " + employees.last_name,
      value: employees.id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to delete?",
          choices: employee,
        },
      ])
      .then((answers) => {
        db.query(
          `DELETE FROM employees WHERE ?`,
          [
            {
              id: answers.employee,
            },
          ],
          (err, res) => {
            if (err) throw err;
            console.log(
              `\n Successfully removed the employee from the database! \n`
            );
            promptMenu();
          }
        );
      });
  });
}
