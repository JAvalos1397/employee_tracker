const inquirer = require("inquirer")
const mysql = require("mysql2")
const cTable = require('console.table')
require('dotenv').config()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employeeTrackerDB'
});

connection.connect(function (err) {
    if (err) throw err
    console.log(`Connected as ID ${connection.threadId}`)
    afterConnection()
});

afterConnection = () => {
    console.log("====================================")
    console.log("||                                ||")
    console.log("||        EMPLOYEE TRACKER        ||")
    console.log("||                                ||")
    console.log("====================================")
    startPrompt();
}

function startPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'what would you like to do?',
            choices: [
                "Show all departments",
                "Show all roles",
                "Show all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update employee",
                "No Action"
            ]
        }
    ])
        .then((answers) => {
            const { choices } = answers;

            if (choices === "Show all departments") {
                ShowDepartments();
            }
            else if (choices === "Show all roles") {
                ShowRoles();
            }
            else if (choices === "Show all employees") {
                ShowEmployees();
            }
            else if (choices === "Add a department") {
                addDepartment();
            }
            else if (choices === "Add a role") {
                addRole();
            }
            else if (choices === "Add an employee") {
                addEmployee();
            }
            else if (choices === "Update employee") {
                UpdateEmployee();
            }
            else {
                connection.end()
            };
        });
};
//get all deparment in db
function ShowDepartments() {
    console.log('Showing all departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        startPrompt();
    });
};

//get all roles in db
function ShowRoles() {
    var query = 'SELECT * FROM roles';
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table('All Roles:', res);
        startPrompt();
    })
};

//get all employees in db
function ShowEmployees() {
    var query = 'SELECT * FROM employee';
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(res.length + ' employees found!');
        console.table('All Employees:', res);
        startPrompt();
    })
};

function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'newDepartment',
                type: 'input',
                message: 'Which department would you like to add?'
            }
        ]).then(function (answer) {
            connection.query(
                'INSERT INTO department SET ?',
                {
                    name: answer.newDepartment
                });
            var query = 'SELECT * FROM department';
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log('Your department has been added!');
                console.table('All Departments:', res);
                startPrompt();
            })
        })
};

function addRole() {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'new_role',
                    type: 'input',
                    message: "What new role would you like to add?"
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary of this role? (Enter a number)'
                },
                {
                    name: 'Department',
                    type: 'list',
                    choices: function () {
                        var deptArry = [];
                        for (let i = 0; i < res.length; i++) {
                            deptArry.push(res[i].name);
                        }
                        return deptArry;
                    },
                }
            ]).then(function (answer) {
                let department_id;
                for (let a = 0; a < res.length; a++) {
                    if (res[a].name == answer.Department) {
                        department_id = res[a].id;
                    }
                }

                connection.query(
                    'INSERT INTO roles SET ?',
                    {
                        title: answer.new_role,
                        salary: answer.salary,
                        department_id: department_id
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log('Your new role has been added!');
                        startPrompt();
                    })
            })
    })
};

function addEmployee() {
    connection.query('SELECT * FROM roles', function (err, roles) {
        if (err) throw err;
        connection.query('SELECT * FROM employee', function (err, employee) {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: 'first_name',
                        type: 'input',
                        message: "What is the employee's fist name? ",
                    },
                    {
                        name: 'last_name',
                        type: 'input',
                        message: "What is the employee's last name? "
                    },
                    {
                        name: 'manager_id',
                        type: 'list',
                        message: "What is the employee's manager's ID?",
                        choices: function () {
                            var employeeArray = [];
                            for (let i = 0; i < employee.length; i++) {
                                employeeArray.push({
                                    name: employee[i].first_name + ' ' + employee[i].last_name,
                                    value: employee[i].id
                                });
                            }
                            return employeeArray;
                        }
                    },
                    {
                        name: 'role',
                        type: 'list',
                        choices: function () {
                            var roleArray = [];
                            for (let i = 0; i < roles.length; i++) {
                                roleArray.push(roles[i].title);
                            }
                            return roleArray;
                        },
                        message: "What is this employee's role? "
                    }
                ]).then(function (answer) {
                    // console.log(answer);
                    let role_id;
                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].title == answer.role) {
                            role_id = roles[i].id;
                            console.log(role_id)
                        }
                    }
                    connection.query(
                        'INSERT INTO employee SET ?',
                        {
                            first_name: answer.first_name,
                            last_name: answer.last_name,
                            manager_id: answer.manager_id,
                            role_id: role_id,
                        },
                        function (err) {
                            if (err) throw err;
                            console.log('Your employee has been added!');
                            startPrompt();
                        })
                })
        })

    })
};

function UpdateEmployee() {
    connection.query('SELECT * FROM employee', function (err, employee) {
        if (err) throw err;
        connection.query('SELECT * FROM roles', function (err, roles) {
        if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: 'employeeID',
                        type: 'list',
                        message: "Choose Employee to update",
                        choices: function () {
                            var employeeArray = [];
                            for (let i = 0; i < employee.length; i++) {
                                employeeArray.push({
                                    name: employee[i].first_name + ' ' + employee[i].last_name,
                                    value: employee[i].id
                                });
                            }
                            return employeeArray;
                        }
                    },
                    {
                        name: 'role',
                        type: 'list',
                        message: "Choose new role",
                        choices: function () {
                            var rolesArray = [];
                            for (let i = 0; i < roles.length; i++) {
                                rolesArray.push({
                                    value: roles[i].id,
                                    name: roles[i].title,
                                    
                                });
                            }
                            return rolesArray;
                        },
                    }
                        
                ])
                .then((answer) => {
                    console.log('employee id',answer.employeeID)
                    console.log('role id',answer.role)
                    connection.query(
                        `UPDATE employee SET role_id =
                        ${answer.role} 
                        WHERE id =${answer.employeeID}`,
                        function (err) {
                            if (err) throw err;
                            console.log('Your employee has been updated!');
                            startPrompt();
                        }
                    )
                    
                })
        })
    })
};