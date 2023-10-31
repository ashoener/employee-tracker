import { Op } from "sequelize";

import Employee from "../schemas/employee.js";
import Role from "../schemas/role.js";
import Department from "../schemas/department.js";

import mainPrompt from "./mainPrompt.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

const viewManagerEmployees = async () => {
  try {
    // Get a list of all employees that have a manager, and group them by manager
    const managers = (
      await Employee.findAll({
        where: {
          managerId: {
            [Op.ne]: null,
          },
        },
        group: ["managerId"],
        attributes: ["managerId"],
        include: [
          {
            model: Employee,
            as: "Manager",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      })
    ).map((e) => e.Manager);
    if (!managers.length) {
      console.log("There are currently no assigned managers.");
      return mainPrompt();
    }

    // Map managers to a list of choices
    const managerChoices = managers.map((e, i) => ({
      name: e.name,
      value: e.id,
    }));
    const { managerId } = await inquirer.prompt([
      {
        type: "list",
        name: "managerId",
        message: "Which manager's employees would you like to view?",
        choices: managerChoices,
      },
    ]);

    // Get all employees that have the selected manager
    const managerEmployees = await Employee.findAll({
      where: {
        managerId: managerId,
      },
      include: [
        {
          model: Role,
          attributes: ["title", "salary"],
          include: [
            {
              model: Department,
              attributes: ["name"],
            },
          ],
        },
        {
          model: Employee,
          attributes: ["firstName", "lastName"],
          as: "Manager",
        },
      ],
    });
    // Display the employees
    console.table(
      managerEmployees.map((e, i) => ({
        Name: e.name,
        Title: e.Role.title,
        Department: e.Role.Department.name,
        Salary: e.Role.salary,
      }))
    );
    return mainPrompt();
  } catch (e) {
    if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
      console.clear();
      return mainPrompt();
    }
  }
};

export default viewManagerEmployees;
