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
          "Quit",
        ],
      },
    ])
    .then(options => {
      switch (options.selectOptions) {
        case 'View all departments':
          renderDepartments();
          break;
        case 'View all roles':
          showRoles();
          break;
        case 'View all employees':
          renderEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployee();
          break;
         
        default:
          db.end();
      }
    });
};

function renderDepartments(){
  console.log("All department...\n");
  db.query(`SELECT * FROM departments`, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptMenu()
  })
};

function showRoles(){
  console.log("Showing all roles...\n");
  db.query(`SELECT * FROM roles LEFT JOIN departments ON roles.department_id = departments.id `, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptMenu()
  })
};

function renderEmployees(){
  console.log("Showing all employees...\n");
  db.query(`SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.id`, (err, res) => {
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
        title: answers.role,
        salary: answers.salary,
        department_id: answers.deptName,
    },
    (err, res) => {
        if (err) throw err;
        console.log(`\n ${answers.role} successfully added to database! \n`);
        promptMenu();
    })
  })
})
};

function addEmployee(){
  db.query(`SELECT * FROM roles;`, (err, res) => {
    if (err) throw err;
    let role = res.map(roles => ({name: roles.title, value: roles.id }));
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
                type: 'list',
                name: 'manager',
                message: 'Who is the new employee\'s manager?',
                choices: employee
            }
        ]).then((answers) => {
            db.query(`INSERT INTO employees SET ?`, 
            {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.role,
                manager_id: answers.manager,
            }, 
            // (err, res) => {
            //     if (err) throw err;
            // })
            // db.query(`INSERT INTO roles SET ?`, 
            // {
            //     department_id: answers.deptName,
            // }, 
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
            db.query(`UPDATE employees SET ? WHERE ?`, 
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
                console.log(`\n Successfully updated employee's role in the database! \n`);
                promptMenu();
            })
        });
    });
  });
};








