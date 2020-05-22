
var inquirer = require("inquirer");
var mysql = require("mysql");
const util = require("util");
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
   connection.query = util.promisify(connection.query);
  
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
          "Add new role",
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

          case "View departments":
            viewAlldepartments();
            break;

          case "Add new employee":
            addNewEmployee()
            break;
          
          case "Add new department":
            addNewdepartment()
            break;

          case "Add new role":
            addNewrole()
            break;

          case "Update employee role":
              updateRole()
              break;

        }
      })
  }

  async function viewAllemployees(){
    var query = allEmployes()
    var employees = await connection.query(query)
    console.table(employees);
    runSearch();
  }

  async function viewAllroles(){
    var query = allroles()
    const roles = await connection.query(query)
    console.table(roles)
    runSearch()
  }

  async function viewAlldepartments(){
    var query = allDepartments()
    const department = await connection.query(query)
      console.table(department);
      runSearch();
  }

  async function addNewEmployee(){
  var rolesQuery = allroles()
   var roles = await connection.query(rolesQuery)
   var employeesQuery = allEmployes()
   var employees = await connection.query(employeesQuery)
  
   const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));
  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
    inquirer.prompt([{
      name:"firstname",
      type: "input",
      message: "What is employee's First name?"
    },
  {
    name:"lastname",
      type: "input",
      message: "What is employee's Last name?"
  },
  {
  name:"role",
  type: "list",
  message: "What is the role of employee?",
  choices: roleChoices

  },
  {
    name:"ManagerDetails",
    type: "list",
    message: "Who is the employees Manager",
    choices: managerChoices
  
    }])
  .then(function(answer){
    var query = "INSERT INTO employee(first_name, last_name,role_id, manager_id) values( ? , ?, ?, ?);"
    connection.query(query, [answer.firstname, answer.lastname, answer.role, answer.ManagerDetails], function (err, res) {
      if (err)throw err;
      console.log("Added a new employee")
      runSearch();
    })
  })
  }

  function addNewdepartment(){
    inquirer.prompt({
      name:"new_department",
      type: "input",
      message: "Which department do you want to add?"
    })
    .then(function(answer){
      var query = "INSERT INTO department(name) VALUES (?);"
      connection.query(query, [answer.new_department], function(err, res){
        if(err) throw err;
        console.log("Added new Deparment")
        runSearch();
      })
    })

  }

  async function addNewrole(){
    var departmentsQuery = allDepartments();
    var department = await connection.query(departmentsQuery)
    
    const departmentChoices = department.map(({ id, name }) => ({
      name: name,
      value: id
    }));

    inquirer.prompt([{
      name:"role",
      type: "input",
      message: "What is name of the role?"
    },
    {
      name:"salary",
      type: "input",
      message: "What is the salary for this role?"
    },
    {
      name:"departmentID",
      type: "list",
      message:"Which department does this role belong?",
      choices: departmentChoices
    }
  
  ])
  .then(function(answer){
    var query = "INSERT INTO role(title, salary, department_id) values( ? , ?, ?);"
    connection.query(query, [answer.role, answer.salary, answer.departmentID], function(err, res){
      if(err) throw err;
      console.log("New role is added");
      runSearch();
    })
  })
  }

  async function updateRole(){
    var employeeQuery = allEmployes();
    var employee = await connection.query(employeeQuery);
    var rolesQuery = allroles()
   var roles = await connection.query(rolesQuery)
  
    const employeeChoices = employee.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));

    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id
    }));

    inquirer.prompt([{
      name:"employee",
      type: "list",
      message:"Which employee role do you wnat to change",
      choices: employeeChoices
    },
    {
      name:"role",
      type: "list",
      message:"Which role do you want to assign to the selected employee",
      choices: roleChoices
    }
  ])
  .then(function(answer){
    console.log(answer)
    var query = "UPDATE employee SET role_id = ? WHERE id = ?;"
    connection.query(query, [answer.role, answer.employee], function(err, res){
      if(err) throw err;
      console.log("The employee role is changed")
      runSearch();
    })
  })

  }

  function allroles() {
    var query = " SELECT role.id, role.title, department.name, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    return query
  }

  function allEmployes() {
    var query = " SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    return query
  }

  function allDepartments(){
    var query = " SELECT * FROM department;"
    return query
  }
  