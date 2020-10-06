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

// updates single employee role
function updateRoles() {
    connection.query(`SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee;`, function (err, res) {
      if (err) throw err;
      inquirer.prompt({
        name: "employee",
        type: "list",
        message: "Which Employee:",
        choices: res
        }).then(answer => {
            connection.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = "${answer.employee}";`, function (err, res) {
              if (err) throw err;
              const employeeId = res[0].id;
              const query = `SELECT title FROM role`;
              connection.query(query, function (err, res) {
                if (err) throw err;
                let choicesArray = res.map(item => { return item.title });
                inquirer.prompt({
                  name: "newRole",
                  type: "list",
                  message: "Which Role:",
                  choices: choicesArray
                  }).then(answer => {
                      const query = `SELECT id FROM role WHERE title = "${answer.newRole}";`;
                      connection.query(query, function (err, res) {
                        if (err) throw err;
                        const roleId = res[0].id;
                        const query = `UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId};`
                        connection.query(query, function (err, res) {
                          if (err) throw err;
                          console.log("** Role Updated **")
                          runApp();
                        })
                      })
                    })
              })
            })
          })
    })
  }

// creates a new employee row
function addEmployees() {
    const query = `SELECT title FROM role`;
    connection.query(query, function (err, res) {
      if (err) throw err;
      let choicesArray = res.map(item => { return item.title });
      inquirer.prompt([
        {
        name: "firstName",
        type: "input",
        message: "First Name:"
        },
        {
        name: "lastName",
        type: "input",
        message: "Last Name:"
        },
        {
        name: "role",
        type: "list",
        message: "Which Role:",
        choices: choicesArray
        }
    ]).then(answer => {
        const firstName = answer.firstName;
        const lastName = answer.lastName;
        const query = `SELECT id FROM role WHERE title = "${answer.role}";`;
        connection.query(query, function (err, res) {
          if (err) throw err;
          const savedId = res[0].id;
          const query = "SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee;";
          connection.query(query, function (err, res) {
            if (err) throw err;
            let choicesArray = res.map(item => { return item });
            choicesArray.push({ name: "None" });
            inquirer.prompt([{
              name: "managerName",
              type: "list",
              message: "Employee Manager:",
              choices: choicesArray
              }]).then(answer => {
                  if (answer.managerName === "None") {
                  connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ("${firstName}", "${lastName}", ${savedId});`, function (err, res) {
                    if (err) throw err;
                    console.log("** Employee Created **")
                    runApp();
                  })} else {
                        const query = `SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = "${answer.managerName}";`;
                        connection.query(query, function (err, res) {
                        if (err) throw err;
                        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${savedId}, ${res[0].id});`, function (err, res) {
                          if (err) throw err;
                          console.log("** Employee Created **")
                          runApp();
                        })
                      })
                    }
                })
          })
        })
    })
})
}