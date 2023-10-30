import Role from "../schemas/role.js";
import Department from "../schemas/department.js";

import mainPrompt from "./mainPrompt.js";

const viewAllRoles = async () => {
  const roles = await Role.findAll({
    attributes: {
      exclude: ["departmentId"],
    },
    include: [
      {
        model: Department,
        attributes: ["name"],
      },
    ],
  });
  console.table(
    roles.map((r, i) => ({
      Title: r.title,
      Salary: r.salary,
      Department: r.Department.name,
    }))
  );
  return mainPrompt();
};

export default viewAllRoles;
