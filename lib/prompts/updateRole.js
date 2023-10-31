import Role from "../schemas/role.js";

import mainPrompt from "./mainPrompt.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

const updateRole = async () => {
  try {
    const roles = await Role.findAll();
    if (!roles.length) {
      console.log(
        "There are currently no roles. Please create a role and try again."
      );
      return mainPrompt();
    }
    // Map roles to a list of choices
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
          i === "" ? roles.find((r) => r.id == a.roleId).title : i, // If the user leaves the title blank, use the old title
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
          isNaN(i) ? roles.find((r) => r.id == a.roleId).salary : i, // If the user leaves the salary blank, use the old salary
      },
    ]);
    // Update the role
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
};

export default updateRole;
