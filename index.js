/* Importing and requiring mySQL */
const mysql = require("mysql2");

/* Importing and requiring inquirer */
const inquirer = require("inquirer");

/* Importing and requiring console.table to print MySQL rows to the console */
const cTable = require("console.table");

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
          "View employees by department",
          "Delete a department",
          "Delete a role",
          "Delete an employee",
          "Quit",
        ],
      },
    ])
    .then(options => {
      switch (options.selectOptions) {
        case 'View all the Departments':
          renderDepartments();
          break;
        case 'Add a Department':
          showRoles();
          break;
        case 'Delete a Department':
          renderEmployees();
          break;
        case 'View all the Roles':
          addDepartment();
          break;
        case 'Add a Role':
          addRole();
          break;
        case 'Delete a Role':
          addEmployee();
          break;
        case 'View all the Employee':
          updateEmployee();
          break;
        case 'Add a Employee':
          updateManager();
          break;
        case 'Delete a Employee':
          employeeByDepartment();
          break;
        case 'Update a Employee role':
          deleteDepartment();
          break;
        case `Update a Employee manager's name`:
          deleteRole()
          break;
        case 'Show Employee by department':
          deleteEmployee();
          break;
         
        default:
          db.quit();
      }
    });
};

function renderDepartments(){
  console.log("All department...\n");
  db.query(`SELECT * FROM departments ORDER BY departments_id ASC;`, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptMenu()
  })
};

function showRoles(){
  console.log("Showing all roles...\n");
  db.query(`SELECT roles.id, roles.title, roles.salary, departments.names, departments.id FROM roles JOIN departments ON roles.departments_id = departments.id ORDER BY roles.id ASC; `, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptMenu()
  })
};

function renderEmployees(){
  console.log("Showing all employees...\n");
  db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.names, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS Manager FROM LEFT JOIN role ON employees.role_id = roles.id LEFT JOIN employees  manager ON manager.id = employee.manager_id`, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptMenu()
})
};

function addDepartment(){
  inquirer.prompt([
    {
      type: 'input',
      name: 'addDepartment',
      message: 'What is the name of the department you would like to add?'
    }
  ]).then(answers => {
    const sql = `INSERT INTO departments (names)
                VALUES (?)`;
    db.query(sql, answers.addDepartment, (err, result) => {
      if (err) throw err;
      console.log('Added ' + answers.addDepartment + " to departments!"); 

      renderDepartments();
  });
});
};

function addRole(){
  db.query(`SELECT * FROM departments;`, (err, res) => {
    if (err) throw err;
    let department = res.map(departments => ({name: departments.names, value: departments.id }));
  inquirer.prompt([
    {
      type: 'input', 
      name: 'role',
      message: "What role do you want to add?"
    },
    {
      type: 'input', 
      name: 'salary',
      message: "What is the salary of this role?",
    },
    {
      type: 'list',
      name: 'deptName',
      message: 'Which department do you want to add the new role to?',
      choices: department
    }
  ]).then((answers) => {
    db.query(`INSERT INTO roles SET ?`, 
    {
        title: answers.title,
        salary: answers.salary,
        department_id: answers.deptName,
    },
    (err, res) => {
        if (err) throw err;
        console.log(`\n ${answers.title} successfully added to database! \n`);
        promptMenu();
    })
  })
})
};

function addEmployee(){
  db.query(`SELECT * FROM roles;`, (err, res) => {
    if (err) throw err;
    let role = res.map(roles => ({name: roles.title, value: roles.roles_id }));
    db.query(`SELECT * FROM employees;`, (err, res) => {
        if (err) throw err;
        let employee = res.map(employees => ({name: employees.first_name + ' ' + employees.last_name, value: employees.id}));
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the new employee\'s first name?'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the new employee\'s last name?'
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the new employee\'s title?',
                choices: role
            },
            {
                name: 'manager',
                type: 'list',
                message: 'Who is the new employee\'s manager?',
                choices: employee
            }
        ]).then((answers) => {
            db.query(`INSERT INTO employee SET ?`, 
            {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.role,
                manager_id: answers.manager,
            }, 
            (err, res) => {
                if (err) throw err;
            })
            db.query(`INSERT INTO role SET ?`, 
            {
                department_id: answers.dept,
            }, 
            (err, res) => {
                if (err) throw err;
                console.log(`\n ${answers.firstName} ${answers.lastName} successfully added to database! \n`);
                promptMenu();
            })
        })
    })
})
}

function updateEmployee(){
  db.query(`SELECT * FROM roles;`, (err, res) => {
    if (err) throw err;
    let role = res.map(roles => ({name: roles.title, value: roles.id }));
    db.query(`SELECT * FROM employees;`, (err, res) => {
        if (err) throw err;
        let employee = res.map(employees => ({name: employees.first_name + ' ' + employees.last_name, value: employees.id }));
        inquirer.prompt([
            {
                type: 'list',  
                name: 'employee',
                message: 'Which employee would you like to update the role for?',
                choices: employee
            },
            {
                type: 'list',
                name: 'newRole',
                message: 'What should the employee\'s new role be?',
                choices: role
            },
        ]).then((answers) => {
            db.query(`UPDATE employee SET ? WHERE ?`, 
            [
                {
                    role_id: answers.newRole,
                },
                {
                    employee_id: answers.employee,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully updated employee's role in the database! \n`);
                promptMenu();
            })
        });
    });
  });
};

function updateManager(){
  db.query(`SELECT * FROM employees;`, (err, res) => {
    if (err) throw err;
    let employee = res.map(employees => ({name: employees.first_name + ' ' + employees.last_name, value: employees.id }));
    inquirer.prompt([
        {
            type: 'list',  
            name: 'employee',
            message: 'Which employee would you like to update the manager for?',
            choices: employee
        },
        {
            type: 'list',
            name: 'newManager',
            message: 'Who should the employee\'s new manager be?',
            choices: employee
        },
    ]).then((answers) => {
        db.query(`UPDATE employee SET ? WHERE ?`, 
        [
            {
                manager_id: answers.newManager,
            },
            {
                employee_id: answers.employee,
            },
        ], 
        (err, res) => {
            if (err) throw err;
            console.log(`\n Successfully updated employee's manager in the database! \n`);
            promptMenu();
        })
    });
  });
};

function employeeByDepartment(){
  console.log('Showing employee by departments...\n');
  const sql = `SELECT employees.first_name, 
                      employees.last_name, 
                      departments.name AS department
               FROM employees 
               LEFT JOIN roles ON employees.role_id = roles.id 
               LEFT JOIN departments ON roles.department_id = departments.id`;

  db.promise().query(sql, (err, res) => {
    if (err) throw err; 
    console.table(res); 
    promptMenu();
  });  
}

function deleteDepartment(){
  db.query(`SELECT * FROM departments ORDER BY departments.id ASC;`, (err, res) => {
    if (err) throw err;
    let department = res.map(departments => ({name: departments.name, value: departments.id }));
    inquirer.prompt([
        {
        type: 'list',
        name: 'deptName',
        message: 'Which department would you like to remove?',
        choices: department
        },
    ]).then((answers) => {
        db.query(`DELETE FROM departments WHERE ?`, 
        [
            {
                department_id: answers.deptName,
            },
        ], 
        (err, res) => {
            if (err) throw err;
            console.log(`\n Successfully removed the department from the database! \n`);
            promptMenu();
        })
    });
  });
};

function deleteRole(){
  db.query(`SELECT * FROM roles ORDER BY roles.id ASC;`, (err, res) => {
    if (err) throw err;
    let role = res.map(roles => ({name: roles.title, value: roles.id }));
    inquirer.prompt([
        {
        type: 'list',
        name: 'title',
        message: 'Which role would you like to remove?',
        choices: role
        },
    ]).then((answers) => {
        db.query(`DELETE FROM role WHERE ?`, 
        [
            {
                role_id: answers.title,
            },
        ], 
        (err, res) => {
            if (err) throw err;
            console.log(`\n Successfully removed the role from the database! \n`);
            promptMenu();
        })
    });
  });
};

function deleteEmployee(){
  db.query(`SELECT * FROM employees ORDER BY employees.id ASC;`, (err, res) => {
    if (err) throw err;
    let employee = res.map(employees => ({name: employees.first_name + ' ' + employees.last_name, value: employees.id }));
    inquirer.prompt([
        {
            type: 'list',  
            name: 'employee',
            message: 'Which employee would you like to remove?',
            choices: employee
        },
    ]).then((answers) => {
        db.query(`DELETE FROM employee WHERE ?`, 
        [
            {
                employee_id: answers.employee,
            },
        ], 
        (err, res) => {
            if (err) throw err;
            console.log(`\n Successfully removed the employee from the database! \n`);
            promptMenu();
        })
    });
  });
};






