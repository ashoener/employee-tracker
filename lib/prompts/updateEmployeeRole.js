import Employee from "../schemas/employee.js";
import Role from "../schemas/role.js";

import mainPrompt from "./mainPrompt.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

const updateEmployeeRole = async () => {
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
  } catch (e) {
    if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
      console.clear();
      return mainPrompt();
    }
  }
};

export default updateEmployeeRole;
