import "dotenv/config.js";

import db from "./lib/db.js";
import Department from "./lib/schemas/department.js";
import Role from "./lib/schemas/role.js";
import Employee from "./lib/schemas/employee.js";

await db.sync({ force: false });
console.log(`Connected to db ${process.env.DB_NAME}`);
