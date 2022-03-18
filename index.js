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
    .then((answers) => {
      const { choices } = answers;

      if (choices === "View all departments") {
        renderDepartments();
      }

      if (choices === "View all roles") {
        showRoles();
      }

      if (choices === "View all employees") {
        renderEmployees();
      }

      if (choices === "Add a department") {
        addDepartment();
      }

      if (choices === "Add a role") {
        addRole();
      }

      if (choices === "Add an employee") {
        addEmployee();
      }

      if (choices === "Update an employee role") {
        updateEmployee();
      }

      if (choices === "Update an employee manager") {
        updateManager();
      }

      if (choices === "View employees by department") {
        employeeByDepartment();
      }

      if (choices === "Delete a department") {
        deleteDepartment();
      }

      if (choices === "Delete a role") {
        deleteRole();
      }

      if (choices === "Delete an employee") {
        deleteEmployee();
      }

      if (choices === "Quit") {
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
    const sql = `INSERT INTO department (name)
                VALUES (?)`;
    connection.query(sql, answers.addDepartment, (err, result) => {
      if (err) throw err;
      console.log('Added ' + answers.addDepartment + " to departments!"); 

      renderDepartments();
  });
});
};

function addRole(){
  connection.query(`SELECT * FROM department;`, (err, res) => {
    if (err) throw err;
    let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
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
      choices: departments
    }
  ]).then((answers) => {
    connection.query(`INSERT INTO role SET ?`, 
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

function addEmployee()
function updateEmployee()
function updateManager()
function employeeByDepartment()
function deleteDepartment()
function deleteRole()
function deleteEmployee()






