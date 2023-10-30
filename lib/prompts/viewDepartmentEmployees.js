import Employee from "../schemas/employee.js";
import Role from "../schemas/role.js";
import Department from "../schemas/department.js";

import mainPrompt from "./mainPrompt.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";

const viewDepartmentEmployees = async () => {
  try {
    const departments = await Department.findAll();
    if (!departments.length) {
      console.log("There are currently no departments.");
      return mainPrompt();
    }
    const departmentChoices = departments.map((d, i) => ({
      name: d.name,
      value: d.id,
    }));
    const { departmentId } = await inquirer.prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Which department's employees would you like to view?",
        choices: departmentChoices,
      },
    ]);

    const departmentEmployees = await Employee.findAll({
      include: [
        {
          model: Role,
          attributes: ["title", "salary"],
          where: {
            departmentId: departmentId,
          },
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
      departmentEmployees.map((e, i) => ({
        Name: e.name,
        Title: e.Role.title,
        Salary: e.Role.salary,
        Manager: e.Manager?.name || "None",
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

export default viewDepartmentEmployees;
