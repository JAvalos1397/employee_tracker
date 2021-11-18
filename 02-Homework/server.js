const inquirer = require("inquirer")
const mysql = require("mysql2")
const cTable = require('console.table')
const dotenv = require('dotenv')
dotenv.config()

const connection = mysql.createConnection({
    host: "localhost",
    port: 3001,
    user: 'root',
    password: 'password',
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
    StartPrompt();
}

function StartPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'what would you like to do?',
            choices: [
                "View All Employees?",
                "View All Employee's By Roles?",
                "View all8 Emplyees By Deparments",
                "Update Employee",
                "Add Employee?",
                "Add Role?",
                "Add Department?",
                "Update an employee role",
                "Update an employee manager",
                "View employees by department",
                "Delete a department",
                "Delete a role",
                "Delete an employee",
                "View department budgets",
                "No Action"
            ]
        }
    ])
        .then((answers) => {
            const { choices } = answers;

            if (choices === "View all departments") {
                viewDepartments();
            }
            if (choices === "View all roles") {
                viewRoles();
            }
            if (choices === "View all employees") {
                viewEmployees();
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
                employeeDepartment();
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
            if (choices === "View department budgets") {
                viewBudget();
            }
            if (choices === "No Action") {
                connection.end()
            };
        });
};
//get all deparment in db
function viewDepartments() {
    var query = 'SELECT * FROM department';
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table('All Departments:', res);
        options();
    })
};

//get all roles in db
function viewRoles() {
    var query = 'SELECT * FROM role';
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table('All Roles:', res);
        options();
    })
};

//get all employees in db
function viewEmployees() {
    var query = 'SELECT * FROM employee';
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(res.length + ' employees found!');
        console.table('All Employees:', res);
        options();
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
                options();
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
                    'INSERT INTO role SET ?',
                    {
                        title: answer.new_role,
                        salary: answer.salary,
                        department_id: department_id
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log('Your new role has been added!');
                        console.table('All Roles:', res);
                        options();
                    })
            })
    })
};

function addEmployee() {
    connection.query('SELECT * FROM role', function (err, res) {
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
                    type: 'input',
                    message: "What is the employee's manager's ID? "
                },
                {
                    name: 'role',
                    type: 'list',
                    choices: function () {
                        var roleArray = [];
                        for (let i = 0; i < res.length; i++) {
                            roleArray.push(res[i].title);
                        }
                        return roleArray;
                    },
                    message: "What is this employee's role? "
                }
            ]).then(function (answer) {
                let role_id;
                for (let a = 0; a < res.length; a++) {
                    if (res[a].title == answer.role) {
                        role_id = res[a].id;
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
                        options();
                    })
            })
    })
};