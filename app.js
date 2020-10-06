// node modules
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// db connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Holiday15!",
    database: "employee_tracker"
})