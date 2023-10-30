import Employee from "../schemas/employee.js";
import Role from "../schemas/role.js";

import mainPrompt from "./mainPrompt.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

const addEmployee = async () => {
  try {
    const roles = await Role.findAll();
    if (!roles.length) {
      console.log(
        "There are currently no roles. Please create a role and try again."
      );
      return mainPrompt();
    }
    const roleChoices = roles.map((r, i) => ({
      name: r.title,
      value: r.id,
    }));
    const employees = await Employee.findAll();
    const managerChoices = employees.map((e, i) => ({
      name: e.name,
      value: e.id,
    }));
    managerChoices.unshift({ name: "None", value: null });
    const employee = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices,
      },
      {
        type: "list",
        name: "managerId",
        message: "Who is the employee's manager?",
        choices: managerChoices,
      },
    ]);
    const newEmployee = await Employee.create(employee);
    console.log(`Added employee ${newEmployee.name}`);
    return mainPrompt();
  } catch (e) {
    if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
      console.clear();
      return mainPrompt();
    }
  }
};

export default addEmployee;
