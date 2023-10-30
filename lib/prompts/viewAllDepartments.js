import Department from "../schemas/department.js";

import mainPrompt from "./mainPrompt.js";

const viewAllDepartments = async () => {
  const departments = await Department.findAll();
  console.table(departments.map((d, i) => d.toJSON()));
  return mainPrompt();
};

export default viewAllDepartments;
