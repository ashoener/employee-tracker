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
import addRole from "./addRole.js";
import updateRole from "./updateRole.js";
import removeRole from "./removeRole.js";
import viewAllDepartments from "./viewAllDepartments.js";
import addDepartment from "./addDepartment.js";

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
  ["Add Role", addRole],
  ["Update Role", updateRole],
  ["Remove Role", removeRole],
  ["View All Departments", viewAllDepartments],
  ["Add Department", addDepartment],
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
