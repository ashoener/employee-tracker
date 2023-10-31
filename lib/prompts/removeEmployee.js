import Employee from "../schemas/employee.js";

import mainPrompt from "./mainPrompt.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

const removeEmployee = async () => {
  try {
    const employees = await Employee.findAll();
    if (!employees.length) {
      console.log("There are currently no employees.");
      return mainPrompt();
    }
    // Map employees to a list of choices
    const employeeChoices = employees.map((e, i) => ({
      name: e.name,
      value: e.id,
    }));
    const response = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee would you like to remove?",
        choices: employeeChoices,
      },
    ]);
    // Delete the employee
    const employee = await Employee.findByPk(response.employeeId);
    await employee.destroy();
    console.log(`Removed ${employee.name}`);
    return mainPrompt();
  } catch (e) {
    if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
      console.clear();
      return mainPrompt();
    }
  }
};

export default removeEmployee;
