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
            Manager: e.Manager ? e.name : "None",
          }))
        );
        return mainPrompt();
      },
    ],
    ["Add Employee", () => {}],
    ["Update Employee Role", () => {}],
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
    ["Add Department", () => {}],
    ["Quit", () => {}],
  ]).prompt();
}
