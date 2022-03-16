/* Importing and requiring mySQL */
const mysql = require('mysql2');

/* Importing and requiring inquirer */
const inquirer = require('inquirer');

/* Importing and requiring console.table to print MySQL rows to the console */
const cTable = require('console.table');

/* Connect to database */
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'company_db'
    },
  );