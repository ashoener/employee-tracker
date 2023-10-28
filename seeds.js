import "dotenv/config.js";
import db from "./lib/db.js";
import Department from "./lib/schemas/department.js";
import Role from "./lib/schemas/role.js";
import Employee from "./lib/schemas/employee.js";

import { faker } from "@faker-js/faker";

await db.sync({ force: true });

await Department.bulkCreate([
  { name: "Engineering" },
  { name: "Sales" },
  { name: "Finance" },
  { name: "Legal" },
]);

const roles = [
  {
    title: "Software Engineer",
    salary: 80_000,
    departmentId: 1,
  },
  {
    title: "Lead Engineer",
    salary: 100_000,
    departmentId: 1,
  },
  {
    title: "Salesperson",
    salary: 80_000,
    departmentId: 2,
  },
  {
    title: "Sales Lead",
    salary: 100_000,
    departmentId: 2,
  },
  {
    title: "Accountant",
    salary: 80_000,
    departmentId: 3,
  },
  {
    title: "Account Manager",
    salary: 100000,
    departmentId: 3,
  },
  {
    title: "Legal Assistant",
    salary: 80_000,
    departmentId: 4,
  },
  {
    title: "Lawyer",
    salary: 100_000,
    departmentId: 4,
  },
];
await Role.bulkCreate(roles);

let employees = faker.helpers.multiple(
  () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    roleId: faker.number.int({ min: 1, max: roles.length }),
  }),
  { count: 20 }
);

await Employee.bulkCreate(employees);

employees = employees.map((e, i) => ({
  id: i + 1,
  managerId:
    e.roleId % 2 == 1
      ? employees.findIndex((other) => e.roleId + 1 == other.roleId) + 1 || null
      : null,
}));

await Employee.bulkCreate(employees, { updateOnDuplicate: ["managerId"] });

console.log("Successfully seeded db");
process.exit(0);
