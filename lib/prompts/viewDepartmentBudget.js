import { Sequelize } from "sequelize";

import Employee from "../schemas/employee.js";
import Role from "../schemas/role.js";
import Department from "../schemas/department.js";

import mainPrompt from "./mainPrompt.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

const viewDepartmentBudget = async () => {
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
    const { departmentId } = await inquirer.prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Which department would you like to view the budget of?",
        choices: departmentChoices,
      },
    ]);
    // Find the department's name
    const departmentName = departmentChoices.find(
      (d) => d.value === departmentId
    ).name;
    // Find the total budget of the department
    const salaries = await Employee.findAll({
      where: Sequelize.where(
        Sequelize.col("Role->Department.id"),
        "=",
        departmentId
      ),
      include: [
        {
          model: Role,
          attributes: ["title", "salary"],
          include: [{ model: Department, attributes: ["id"] }],
        },
      ],
      attributes: [
        [Sequelize.fn("sum", Sequelize.col("Role.salary")), "budget"],
      ],
      group: ["Role.salary", "Role.id"],
      raw: true,
    });
    // Sum the salaries
    const totalBudget = salaries.reduce((acc, s) => acc + s.budget, 0);
    console.log(`The total budget for ${departmentName} is ${totalBudget}`);
    return mainPrompt();
  } catch (e) {
    console.log(e);
    if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
      console.clear();
      return mainPrompt();
    }
  }
};

export default viewDepartmentBudget;
