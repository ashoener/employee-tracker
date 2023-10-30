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
import removeDepartment from "./removeDepartment.js";
import viewDepartmentBudget from "./viewDepartmentBudget.js";

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
  ["Remove Department", removeDepartment],
  ["View Department Budget", viewDepartmentBudget],
  ["Quit", () => process.exit(0)],
]);

export default async function mainPrompt() {
  return prompt.prompt();
}
