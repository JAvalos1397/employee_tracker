const inquirer = require("inquirer")
const mysql = require("mysql2")
const cTable = require('console.table')

const connection = mysql.createConnection({
    host: "localhost",
    port: 3001,
    user: 'root',
    password: 'password',
    database: 'employeeTrackerDB'
});

connection.connect(function (er) {
    if (er) throw er
    console.log(`Connected as ID ${connection.threadId}`)
    StartPrompt
});

afterConnection = () => {
    console.log("====================================")
    console.log("||                                ||")
    console.log("||        EMPLOYEE TRACKER        ||")
    console.log("||                                ||")
    console.log("====================================")
    promptUser();
}

function startPrompt() {
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
                showDepartments();
            }
            if (choices === "View all roles") {
                showRoles();
            }
            if (choices === "View all employees") {
                showEmployees();
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

showEmployees = () => {
    console.log('Showing all employees...\n');
    const sql =`SELECT employee.id,
                employee.first_name,
                employee.last_name,
                role.title,
                department.name AS department,
                role.salary,
                CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    connection.promise().query(sql,(er, rows) => {
        if (er) throw er;
        console.table(rows)
        promptUser()
    })
                
}