
const mysql = require('mysql2');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');

require('dotenv').config();

require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Jesus4439!',
  database: 'employeeTracker_db'
});


// connection.connect();
console.log(chalk.blue.bold('======================================================================================================='));
console.log(``);
console.log(chalk.red.bold(figlet.textSync('EMPLOYEE TRACKER')));
console.log(``);
console.log(``);
console.log(chalk.blue.bold(`======================================================================================================`));



const printMenuPrompts = () => {
  inquirer.prompt({
      name: 'choices',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View All Roles',
        'View All Departments',
        'View Employees By Manager',
        'Update Employee Role',
        'Add New Employee',
        'Add New Role',
        'Add New Department',
        chalk.yellow('Update Employee Managers'),
        chalk.yellow('Delete Employee'),
        chalk.yellow('Delete Role'),
        chalk.yellow('Delete Department'),
        'Exit Menu',
      ],



    })
    .then((answers) => {
      const { choices } = answers;
      switch (choices) {
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'View Employees By Manager':
          viewEmployeesByManager();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'Add New Employee':
          addNewEmployee();
          break;
        case 'Add New Role':
          addNewRole();
          break;
        case 'Add New Department':
          addNewDepartment();
          break;
        case 'Update Employee Managers':
          updateEmployeeManagers();
          break;
        case 'Delete Employee':
          deleteEmployee();
          break;
        case 'Delete Role':
          deleteRole();
          break;
        case 'Delete Department':
          deleteDepartment();
          break;
        case 'Exit Menu':
          console.log('Logged out! Type npm start to login')
          connection.end();
      }
    });


};

//SQL SELECT * FROM statements for choices
const viewAllEmployees = () => {
  const query = 'SELECT * FROM employee';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
  })
  printMenuPrompts();
}

const viewAllRoles = () => {
  const query = 'SELECT * FROM role';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
  })
  printMenuPrompts();
}

const viewAllDepartments = () => {
  const query = 'SELECT * FROM department';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
  })
  printMenuPrompts();
}

// BONUS: SQL ORDER BY statement to view employees by manager
const viewEmployeesByManager = () => {
  const query = 'SELECT * FROM employee ORDER BY manager_id DESC';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
  })

  printMenuPrompts();
}

const updateEmployeeRole = () => {
  connection.query('SELECT * FROM employee', (err, employees) => {
    if (err) console.log(err);
    employees = employees.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    connection.query('SELECT * FROM role', (err, roles) => {
      if (err) console.log(err);
      roles = roles.map((role) => {
        return {
          name: role.title,
          value: role.id,
        }
      });
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'selectEmployee',
            message: 'Select employee to update...',
            choices: employees,
          },
          {
            type: 'list',
            name: 'selectNewRole',
            message: 'Select new employee role...',
            choices: roles,
          },
        ])
        .then((data) => {
          connection.query('UPDATE employee SET ? WHERE ?',
            [
              {
                role_id: data.selectNewRole,
              },
              {
                id: data.selectEmployee,
              },
            ],
            function (err) {
              if (err) throw err;
            }
          );
          console.log('Employee role updated');
          viewAllRoles();
        });

    });
  });
};


const addNewEmployee = () => {
  connection.query('SELECT * FROM role', (err, roles) => {
    if (err) console.log(err);
    roles = roles.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'What is the first name of new employee?'
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'What is the last name?'
        },
        {
          type: 'list',
          name: 'role',
          message: 'What is the new role?',
          choices: roles,
        },
        {
          type: 'list',
          name: 'managerId',
          message: 'what is he/she a manager id?',
          choices: [1, 3, 5, 6, 7]
        }
      ])
      .then((data) => {
        console.log(data.role);
        connection.query(
          'INSERT INTO employee SET ?',
          {
            first_name: data.firstName,
            last_name: data.lastName,
            role_id: data.role,
            manager_id: data.managerId
          },
          (err) => {
            if (err) throw err;
            console.log('Updated Employee Roster;');
            viewAllEmployees();

          }
        );
      });

  });

};

const addNewRole = () => {
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) console.log(err);
    departments = departments.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'newRole',
          message: 'What is the new role title?'
        },
        {
          type: 'input',
          name: 'salary',
          message: 'what is the the salary?',
        },
        {
          type: 'list',
          name: 'departmentId',
          message: 'What is the department?',
          choices: departments,
        },
      ])
      .then((data) => {
        connection.query(
          'INSERT INTO role SET ?',
          {
            title: data.newRole,
            salary: data.salary,
            department_id: data.departmentId,
          },
          function (err) {
            if (err) throw err;
          }
        );
        console.log('added new employee role!')
        viewAllRoles();
      });

  });

};

const addNewDepartment = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'newDepartment',
        message: 'What is the Department name?'
      },
    ])
    .then((data) => {
      connection.query('INSERT INTO department SET ?',
        {
          name: data.newDepartment,
        },
        function (err) {
          if (err) throw err;
        }
      );
      console.log('New department added to database')
      viewAllDepartments();
    });
};


connection.connect((err) => {
  if (err) throw err;


  printMenuPrompts();

});
