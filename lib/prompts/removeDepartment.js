import { Op } from "sequelize";

import Employee from "../schemas/employee.js";
import Role from "../schemas/role.js";
import Department from "../schemas/department.js";

import mainPrompt from "./mainPrompt.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

const removeDepartment = async () => {
  try {
    const departments = await Department.findAll();
    if (!departments.length) {
      console.log("There are currently no departments.");
      return mainPrompt();
    }
    // Map departments to a list of choices
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
    // Delete the department
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
};

export default removeDepartment;
