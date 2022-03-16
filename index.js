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

const promptMenu = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "selectOptions",
      message: "What would you like to do?",
      choices: [
        "View all the departments",
        "Add a department",
        "Delete a department",
        "View all the roles",
        "Add a role",
        "Delete a role",
        "View all the employee",
        "Add an employee",
        "Delete an employee",
        "Update an employee role",
        `Update an employee manager's name`,
        "Show employee by department",
        "Quit",
      ],
    },
  ]);
};
