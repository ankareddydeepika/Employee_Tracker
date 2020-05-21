
var inquirer = require("inquirer");
var mysql = require("mysql");
require("console.table");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Deepika",
    database: "employees"
  });
  connection.connect(function(err) {
      if (err) throw err;
      runSearch();
    });
  function runSearch(){
      inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices:[
          "View all employees",
          "View roles",
          "View departments",
          "Add new employee",
          "Add new department",
          "Update roles",
          "Update employee role"
        ]
      })
      .then(function(answer){
        switch (answer.action) {
          case "View all employees":
            viewAllemployees();
            break;

          case "View roles":
            viewAllroles();
            break;
        }
      })
  }

  function viewAllemployees(){
    var query = " SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    connection.query(query, function(err, res){
      if(err) throw err;
      console.table(res);
      runSearch();
    })
  }

  function viewAllroles(){
    var query = " SELECT role.id, role.title, department.name, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    connection.query(query, function(err, res){
      if(err) throw err;
      console.table(res);
      runSearch();
    })
  }
