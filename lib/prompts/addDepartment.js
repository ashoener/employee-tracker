import { Op } from "sequelize";

import Employee from "../schemas/employee.js";
import Role from "../schemas/role.js";
import Department from "../schemas/department.js";

import mainPrompt from "./mainPrompt.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

const addDepartment = async () => {
  try {
    const response = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the department?",
      },
    ]);
    // Add the new department
    const department = await Department.create(response);
    console.log(`Added department ${department.name}`);
    return mainPrompt();
  } catch (e) {
    if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
      console.clear();
      return mainPrompt();
    }
  }
};

export default addDepartment;
