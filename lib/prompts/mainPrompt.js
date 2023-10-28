import ListPrompt from "../promptsTypes/listPrompt.js";
import Department from "../schemas/department.js";
import Employee from "../schemas/employee.js";
import Role from "../schemas/role.js";

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
    ["View All Roles", () => {}],
    ["Add Role", () => {}],
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
