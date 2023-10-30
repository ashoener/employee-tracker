import Employee from "../schemas/employee.js";

import mainPrompt from "./mainPrompt.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

const updateEmployeeManager = async () => {
  try {
    const employees = await Employee.findAll();
    if (!employees.length) {
      console.log("There are currently no employees.");
      return mainPrompt();
    }
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
    const managers = employeeChoices.filter((m) => m.value != employeeId);
    if (!managers.length) {
      console.log(
        "There are no managers available to assign to that employee."
      );
      return mainPrompt();
    }
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
    await employee.setManager(manager);
    console.log(`Updated ${employee.name}'s manager to ${manager.name}`);
    return mainPrompt();
  } catch (e) {
    if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
      console.clear();
      return mainPrompt();
    }
  }
};

export default updateEmployeeManager;
