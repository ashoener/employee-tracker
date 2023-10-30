import { Op, Sequelize } from "sequelize";

import Employee from "../schemas/employee.js";
import Role from "../schemas/role.js";
import Department from "../schemas/department.js";

import mainPrompt from "./mainPrompt.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

const viewManagerEmployees = async () => {
  try {
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
