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

// node server
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    runApp();
  })

  // select action
function runApp() {
    inquirer.prompt({
      name: "Options",
      type: "list",
      choices: ["Add Department", "Add Roles", "Add Employees", "View Departments","View Roles", "View Employees", "Update Roles", "Exit"]
    }).then(answer => {
          switch (answer.Options) {
            case "View Departments":
            viewDepartments();
            break;
            case "View Roles":
            viewRoles();
            break;
            case "View Employees":
            viewEmployees();
            break;
            case "Add Department":
            addDepartment();
            break;
            case "Add Roles":
            addRoles();
            break;
            case "Update Roles":
            updateRoles();
            break;
            case "Add Employees":
            addEmployees();
            break;
            case "Exit":
            process.exit();
          }
        })
  }