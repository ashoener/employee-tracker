import { Op, Sequelize } from "sequelize";
import ListPrompt from "../promptsTypes/listPrompt.js";
import Department from "../schemas/department.js";
import Employee from "../schemas/employee.js";
import Role from "../schemas/role.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";
import viewAllEmployees from "./viewAllEmployees.js";
import viewManagerEmployees from "./viewManagerEmployees.js";
import viewDepartmentEmployees from "./viewDepartmentEmployees.js";
import addEmployee from "./addEmployee.js";
import removeEmployee from "./removeEmployee.js";
import updateEmployeeRole from "./updateEmployeeRole.js";
import updateEmployeeManager from "./updateEmployeeManager.js";
import viewAllRoles from "./viewAllRoles.js";

InterruptedPrompt.fromAll(inquirer);

const prompt = new ListPrompt("What would you like to do?", [
  ["View All Employees", viewAllEmployees],
  ["View Employees By Manager", viewManagerEmployees],
  ["View Employees By Department", viewDepartmentEmployees],
  ["Add Employee", addEmployee],
  ["Remove Employee", removeEmployee],
  ["Update Employee Role", updateEmployeeRole],
  ["Update Employee Manager", updateEmployeeManager],
  ["View All Roles", viewAllRoles],
  [
    "Add Role",
    async () => {
      try {
        const departments = await Department.findAll();
        if (!departments.length) {
          console.log(
            "There are currently no departments. Please create a department and try again."
          );
          return mainPrompt();
        }
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
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
    },
  ],
  [
    "Update Role",
    async () => {
      try {
        const roles = await Role.findAll();
        if (!roles.length) {
          console.log(
            "There are currently no roles. Please create a role and try again."
          );
          return mainPrompt();
        }
        const roleChoices = roles.map((r, i) => ({
          name: r.title,
          value: r.id,
        }));
        const response = await inquirer.prompt([
          {
            type: "list",
            name: "roleId",
            message: "Which role would you like to update?",
            choices: roleChoices,
          },
          {
            type: "input",
            name: "title",
            message:
              "What is the new title of the role? Leave blank to keep old value",
            filter: (i, a) =>
              i === "" ? roles.find((r) => r.id == a.roleId).title : i,
          },
          {
            type: "number",
            name: "salary",
            message:
              "What is the new salary of the role? Leave blank to keep old value",
            validate: (i) => {
              if (isNaN(i)) return true;
              if (i && i > 0) return true;
              return "Salary must be greater than 0";
            },
            filter: (i, a) =>
              isNaN(i) ? roles.find((r) => r.id == a.roleId).salary : i,
          },
        ]);
        const role = await Role.findByPk(response.roleId);
        await role.update(response);
        console.log(`Updated role ${role.title}`);
        return mainPrompt();
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
    },
  ],
  [
    "Remove Role",
    async () => {
      try {
        const roles = await Role.findAll();
        if (!roles.length) {
          console.log("There are currently no roles.");
          return mainPrompt();
        }
        const roleChoices = roles.map((r, i) => ({
          name: r.title,
          value: r.id,
        }));
        const response = await inquirer.prompt([
          {
            type: "list",
            name: "roleId",
            message: "Which role would you like to remove?",
            choices: roleChoices,
          },
        ]);
        const role = await Role.findByPk(response.roleId);
        await role.destroy();
        console.log(`Removed ${role.title}`);
        return mainPrompt();
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
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
      try {
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
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
    },
  ],
  [
    "Remove Department",
    async () => {
      try {
        const departments = await Department.findAll();
        if (!departments.length) {
          console.log("There are currently no departments.");
          return mainPrompt();
        }
        const departmentChoices = departments.map((d, i) => ({
          name: d.name,
          value: d.id,
        }));
        const response = await inquirer.prompt([
          {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to remove?",
            choices: departmentChoices,
          },
        ]);
        const department = await Department.findByPk(response.departmentId);
        await department.destroy();
        console.log(`Removed ${department.name}`);
        return mainPrompt();
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
    },
  ],
  [
    "View Department Budget",
    async () => {
      try {
        const departments = await Department.findAll();
        if (!departments.length) {
          console.log("There are currently no departments.");
          return mainPrompt();
        }
        const departmentChoices = departments.map((d, i) => ({
          name: d.name,
          value: d.id,
        }));
        const { departmentId } = await inquirer.prompt([
          {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to view the budget of?",
            choices: departmentChoices,
          },
        ]);
        const departmentName = departmentChoices.find(
          (d) => d.value === departmentId
        ).name;
        const salaries = await Employee.findAll({
          where: Sequelize.where(
            Sequelize.col("Role->Department.id"),
            "=",
            departmentId
          ),
          include: [
            {
              model: Role,
              attributes: ["title", "salary"],
              include: [{ model: Department, attributes: ["id"] }],
            },
          ],
          attributes: [
            [Sequelize.fn("sum", Sequelize.col("Role.salary")), "budget"],
          ],
          group: ["Role.salary", "Role.id"],
          raw: true,
        });
        const totalBudget = salaries.reduce((acc, s) => acc + s.budget, 0);
        console.log(`The total budget for ${departmentName} is ${totalBudget}`);
        return mainPrompt();
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
    },
  ],
  ["Quit", () => process.exit(0)],
]);

export default async function mainPrompt() {
  return prompt.prompt();
}
