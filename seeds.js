import "dotenv/config.js";
import db from "./lib/db.js";
import Department from "./lib/schemas/department.js";
import Role from "./lib/schemas/role.js";
import Employee from "./lib/schemas/employee.js";

import { faker } from "@faker-js/faker";

// Seeding animation
const frames = ["|", "/", "—", "\\"];
let frame = 0;
process.stdout.write(`Seeding (${frames[frame]})`);
const connectingAnimation = setInterval(() => {
  frame++;
  if (frame > frames.length - 1) frame = 0;
  process.stdout.cursorTo(0);
  process.stdout.write(`Seeding (${frames[frame]})`);
}, 150);

await db.sync({ force: true });

// Create base departments
await Department.bulkCreate([
  { name: "Engineering" },
  { name: "Sales" },
  { name: "Finance" },
  { name: "Legal" },
]);

// Base roles
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
// Add roles to db
await Role.bulkCreate(roles);

let employees = faker.helpers.multiple(
  () => ({
    // Generate a random name
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    // Select a random role
    roleId: faker.number.int({ min: 1, max: roles.length }),
  }),
  { count: 20 }
);

// Add employees to DB
await Employee.bulkCreate(employees);

employees = employees.map((e, i) => ({
  id: i + 1,
  // If the role is an odd number, then it is a lower role.
  // The next role in the list is the manager, so find the first employee with that role
  managerId:
    e.roleId % 2 == 1
      ? employees.findIndex((other) => e.roleId + 1 == other.roleId) + 1 || null
      : null,
}));

// Update all the employees managers
await Employee.bulkCreate(employees, { updateOnDuplicate: ["managerId"] });

// Clean up seeding animation
clearInterval(connectingAnimation);

process.stdout.clearLine(0);
process.stdout.cursorTo(0);

console.log("Successfully seeded db");
process.exit(0);
