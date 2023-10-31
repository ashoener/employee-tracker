import Employee from "../schemas/employee.js";
import Role from "../schemas/role.js";
import Department from "../schemas/department.js";

import mainPrompt from "./mainPrompt.js";

const viewAllEmployees = async () => {
  // Get all employees, excluding managerId and RoleId columns
  const employees = await Employee.findAll({
    attributes: {
      exclude: ["managerId", "RoleId"],
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
  // Log the employees as a table
  console.table(
    employees.map((e, i) => ({
      Name: e.name,
      Title: e.Role?.title || "None",
      Department: e.Role?.Department?.name || "None",
      Salary: e.Role?.salary || "N/A",
      Manager: e.Manager?.name || "None",
    }))
  );
  return mainPrompt();
};

export default viewAllEmployees;
