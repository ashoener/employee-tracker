import Role from "../schemas/role.js";

import mainPrompt from "./mainPrompt.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

const removeRole = async () => {
  try {
    const roles = await Role.findAll();
    if (!roles.length) {
      console.log("There are currently no roles.");
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
        message: "Which role would you like to remove?",
        choices: roleChoices,
      },
    ]);
    // Delete the role
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
};

export default removeRole;
