import Role from "../schemas/role.js";
import Department from "../schemas/department.js";

import mainPrompt from "./mainPrompt.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

const addRole = async () => {
  try {
    const departments = await Department.findAll();
    if (!departments.length) {
      console.log(
        "There are currently no departments. Please create a department and try again."
      );
      return mainPrompt();
    }
    // Map departments to a list of choices
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
    // Create the role
    const role = await Role.create(response);
    console.log(`Added role ${role.title}`);
    return mainPrompt();
  } catch (e) {
    if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
      console.clear();
      return mainPrompt();
    }
  }
};

export default addRole;
