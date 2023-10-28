import ListPrompt from "../promptsTypes/listPrompt.js";
import Department from "../schemas/department.js";
import Employee from "../schemas/employee.js";
import Role from "../schemas/role.js";

import inquirer from "inquirer";

export default async function mainPrompt() {
  return new ListPrompt("What would you like to do?", [
    [
      "View All Employees",
      async () => {
        const employees = await Employee.findAll({
          attributes: {
            exclude: ["managerId", "RoleId"],
          },
          include: [
            {
              model: Role,
              attributes: ["title", "salary"],
              include: [
                {
                  model: Department,
                  attributes: ["name"],
                },
              ],
            },
            {
              model: Employee,
              attributes: ["firstName", "lastName"],
              as: "Manager",
            },
          ],
        });
        console.table(
          employees.map((e, i) => ({
            Name: e.name,
            Title: e.Role.title,
            Department: e.Role.Department.name,
            Salary: e.Role.salary,
            Manager: e.Manager ? e.Manager.name : "None",
          }))
        );
        return mainPrompt();
      },
    ],
    [
      "Add Employee",
      async () => {
        const roles = await Role.findAll();
        const roleChoices = roles.map((r, i) => ({
          name: r.title,
          value: r.id,
        }));
        const employees = await Employee.findAll();
        const managerChoices = employees.map((e, i) => ({
          name: e.name,
          value: e.id,
        }));
        managerChoices.unshift({ name: "None", value: null });
        const employee = await inquirer.prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleChoices,
          },
          {
            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
            choices: managerChoices,
          },
        ]);
        const newEmployee = await Employee.create(employee);
        console.log(`Added employee ${newEmployee.name}`);
        return mainPrompt();
      },
    ],
    [
      "Update Employee Role",
      async () => {
        const employees = await Employee.findAll();
        const employeeChoices = employees.map((e, i) => ({
          name: e.name,
          value: e.id,
        }));
        const roles = await Role.findAll();
        const roleChoices = roles.map((r, i) => ({
          name: r.title,
          value: r.id,
        }));
        const response = await inquirer.prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee would you like to update?",
            choices: employeeChoices,
          },
          {
            type: "list",
            name: "roleId",
            message: "What is the employee's new role?",
            choices: roleChoices,
          },
        ]);
        const employee = await Employee.findByPk(response.employeeId);
        const role = await Role.findByPk(response.roleId);
        await employee.setRole(role);
        console.log(`Updated ${employee.name}'s role to ${role.title}`);
        return mainPrompt();
      },
    ],
    [
      "Update Employee Manager",
      async () => {
        const employees = await Employee.findAll();
        const employeeChoices = employees.map((e, i) => ({
          name: e.name,
          value: e.id,
        }));
        const { employeeId } = await inquirer.prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee would you like to update?",
            choices: employeeChoices,
          },
        ]);
        const { managerId } = await inquirer.prompt([
          {
            type: "list",
            name: "managerId",
            message: "Who is the employee's new manager?",
            choices: employeeChoices.filter((m) => m.value != employeeId),
          },
        ]);
        const employee = await Employee.findByPk(employeeId);
        const manager = await Employee.findByPk(managerId);
        console.log(manager.toJSON());
        await employee.setManager(manager);
        console.log(`Updated ${employee.name}'s manager to ${manager.name}`);
        return mainPrompt();
      },
    ],
    [
      "View All Roles",
      async () => {
        const roles = await Role.findAll({
          attributes: {
            exclude: ["departmentId"],
          },
          include: [
            {
              model: Department,
              attributes: ["name"],
            },
          ],
        });
        console.table(
          roles.map((r, i) => ({
            Title: r.title,
            Salary: r.salary,
            Department: r.Department.name,
          }))
        );
        return mainPrompt();
      },
    ],
    [
      "Add Role",
      async () => {
        const departments = await Department.findAll();
        const departmentChoices = departments.map((d, i) => ({
          name: d.name,
          value: d.id,
        }));
        const response = await inquirer.prompt([
          {
            type: "input",
            name: "title",
            message: "What is the title of the role?",
          },
          {
            type: "number",
            name: "salary",
            message: "What is the salary of the role?",
          },
          {
            type: "list",
            name: "departmentId",
            message: "What department is the role in?",
            choices: departmentChoices,
          },
        ]);
        const role = await Role.create(response);
        console.log(`Added role ${role.title}`);
        return mainPrompt();
      },
    ],
    [
      "View All Departments",
      async () => {
        const departments = await Department.findAll();
        console.table(departments.map((d, i) => d.toJSON()));
        return mainPrompt();
      },
    ],
    [
      "Add Department",
      async () => {
        const response = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "What is the name of the department?",
          },
        ]);
        const department = await Department.create(response);
        console.log(`Added department ${department.name}`);
        return mainPrompt();
      },
    ],
    ["Quit", () => {}],
  ]).prompt();
}
