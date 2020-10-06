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

  // displays all departments
function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      console.table(res);
      runApp();
    })
  }
  
  // displays all roles
  function viewRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
      console.table(res);
      runApp();
    })
  }
  
  // displays all employees
  function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
      if (err) throw err;
      console.table(res);
      runApp();
    })
  }

  // create/add single department
function addDepartment() {
    inquirer.prompt({
      name: "addDepartment",
      type: "input",
      message: "Department Name:"
    }).then(answer => {
        let query = `INSERT INTO department (name) VALUES ("${answer.addDepartment}");`;
        connection.query(query, function (err, res) {
          if (err) throw err;
          console.log("** Department Created **")
          runApp();
        })
    })
  }
  
  // create/add single role 
  function addRoles() {
    const query = `SELECT name FROM department`;
    connection.query(query, function (err, res) {
      if (err) throw err;
      inquirer.prompt([
        {
        name: "title",
        type: "input",
        message: "Role Title:"
        }, 
        {
        name: "salary",
        type: "input",
        message: "Salary:"
        }, 
        {
        name: "department",
        type: "list",
        message: "Which Department:",
        choices: res
        }
        ]).then(answer => {
            console.log(answer.department);
            const query = `SELECT id FROM department WHERE name = "${answer.department}";`;
            connection.query(query, function (err, res) {
              if (err) throw err;
              const savedId = res[0].id;
              connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.title}", ${answer.salary}, ${savedId});`, function (err, res) {
              console.log("** Role Created **")
              runApp();
              })
            })
        })
    })
  }