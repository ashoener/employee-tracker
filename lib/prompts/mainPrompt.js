import { Op, Sequelize } from "sequelize";
import ListPrompt from "../promptsTypes/listPrompt.js";
import Department from "../schemas/department.js";
import Employee from "../schemas/employee.js";
import Role from "../schemas/role.js";

import inquirer from "inquirer";
import InterruptedPrompt from "inquirer-interrupted-prompt";
import viewAllEmployees from "./viewAllEmployees.js";
import viewManagerEmployees from "./viewManagerEmployees.js";

InterruptedPrompt.fromAll(inquirer);

const prompt = new ListPrompt("What would you like to do?", [
  ["View All Employees", viewAllEmployees],
  ["View Employees By Manager", viewManagerEmployees],
  [
    "View Employees By Department",
    async () => {
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
    },
  ],
  [
    "Add Employee",
    async () => {
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
    },
  ],
  [
    "Remove Employee",
    async () => {
      try {
        const employees = await Employee.findAll();
        if (!employees.length) {
          console.log("There are currently no employees.");
          return mainPrompt();
        }
        const employeeChoices = employees.map((e, i) => ({
          name: e.name,
          value: e.id,
        }));
        const response = await inquirer.prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee would you like to remove?",
            choices: employeeChoices,
          },
        ]);
        const employee = await Employee.findByPk(response.employeeId);
        await employee.destroy();
        console.log(`Removed ${employee.name}`);
        return mainPrompt();
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
    },
  ],
  [
    "Update Employee Role",
    async () => {
      try {
        const employees = await Employee.findAll();
        if (!employees.length) {
          console.log("There are currently no employees.");
          return mainPrompt();
        }
        const employeeChoices = employees.map((e, i) => ({
          name: e.name,
          value: e.id,
        }));
        const roles = await Role.findAll();
        const roleChoices = roles.map((r, i) => ({
          name: r.title,
          value: r.id,
        }));
        const response = await inquirer.prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee would you like to update?",
            choices: employeeChoices,
          },
          {
            type: "list",
            name: "roleId",
            message: "What is the employee's new role?",
            choices: roleChoices,
          },
        ]);
        const employee = await Employee.findByPk(response.employeeId);
        const role = await Role.findByPk(response.roleId);
        await employee.setRole(role);
        console.log(`Updated ${employee.name}'s role to ${role.title}`);
        return mainPrompt();
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
    },
  ],
  [
    "Update Employee Manager",
    async () => {
      try {
        const employees = await Employee.findAll();
        if (!employees.length) {
          console.log("There are currently no employees.");
          return mainPrompt();
        }
        const employeeChoices = employees.map((e, i) => ({
          name: e.name,
          value: e.id,
        }));
        const { employeeId } = await inquirer.prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee would you like to update?",
            choices: employeeChoices,
          },
        ]);
        const managers = employeeChoices.filter((m) => m.value != employeeId);
        if (!managers.length) {
          console.log(
            "There are no managers available to assign to that employee."
          );
          return mainPrompt();
        }
        const { managerId } = await inquirer.prompt([
          {
            type: "list",
            name: "managerId",
            message: "Who is the employee's new manager?",
            choices: employeeChoices.filter((m) => m.value != employeeId),
          },
        ]);
        const employee = await Employee.findByPk(employeeId);
        const manager = await Employee.findByPk(managerId);
        await employee.setManager(manager);
        console.log(`Updated ${employee.name}'s manager to ${manager.name}`);
        return mainPrompt();
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
    },
  ],
  [
    "View All Roles",
    async () => {
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
    },
  ],
  [
    "Add Role",
    async () => {
      try {
        const departments = await Department.findAll();
        if (!departments.length) {
          console.log(
            "There are currently no departments. Please create a department and try again."
          );
          return mainPrompt();
        }
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
        const role = await Role.create(response);
        console.log(`Added role ${role.title}`);
        return mainPrompt();
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
    },
  ],
  [
    "Update Role",
    async () => {
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
        const response = await inquirer.prompt([
          {
            type: "list",
            name: "roleId",
            message: "Which role would you like to update?",
            choices: roleChoices,
          },
          {
            type: "input",
            name: "title",
            message:
              "What is the new title of the role? Leave blank to keep old value",
            filter: (i, a) =>
              i === "" ? roles.find((r) => r.id == a.roleId).title : i,
          },
          {
            type: "number",
            name: "salary",
            message:
              "What is the new salary of the role? Leave blank to keep old value",
            validate: (i) => {
              if (isNaN(i)) return true;
              if (i && i > 0) return true;
              return "Salary must be greater than 0";
            },
            filter: (i, a) =>
              isNaN(i) ? roles.find((r) => r.id == a.roleId).salary : i,
          },
        ]);
        const role = await Role.findByPk(response.roleId);
        await role.update(response);
        console.log(`Updated role ${role.title}`);
        return mainPrompt();
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
    },
  ],
  [
    "Remove Role",
    async () => {
      try {
        const roles = await Role.findAll();
        if (!roles.length) {
          console.log("There are currently no roles.");
          return mainPrompt();
        }
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
    },
  ],
  [
    "View All Departments",
    async () => {
      const departments = await Department.findAll();
      console.table(departments.map((d, i) => d.toJSON()));
      return mainPrompt();
    },
  ],
  [
    "Add Department",
    async () => {
      try {
        const response = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "What is the name of the department?",
          },
        ]);
        const department = await Department.create(response);
        console.log(`Added department ${department.name}`);
        return mainPrompt();
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
    },
  ],
  [
    "Remove Department",
    async () => {
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
        const response = await inquirer.prompt([
          {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to remove?",
            choices: departmentChoices,
          },
        ]);
        const department = await Department.findByPk(response.departmentId);
        await department.destroy();
        console.log(`Removed ${department.name}`);
        return mainPrompt();
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
    },
  ],
  [
    "View Department Budget",
    async () => {
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
            message: "Which department would you like to view the budget of?",
            choices: departmentChoices,
          },
        ]);
        const departmentName = departmentChoices.find(
          (d) => d.value === departmentId
        ).name;
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
        const totalBudget = salaries.reduce((acc, s) => acc + s.budget, 0);
        console.log(`The total budget for ${departmentName} is ${totalBudget}`);
        return mainPrompt();
      } catch (e) {
        if (e === InterruptedPrompt.EVENT_INTERRUPTED) {
          console.clear();
          return mainPrompt();
        }
      }
    },
  ],
  ["Quit", () => process.exit(0)],
]);

export default async function mainPrompt() {
  return prompt.prompt();
}
