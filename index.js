import "dotenv/config.js";

import db from "./lib/db.js";
import Department from "./lib/schemas/department.js";
import Role from "./lib/schemas/role.js";
import Employee from "./lib/schemas/employee.js";
import BasePrompt from "./lib/promptsTypes/basePrompt.js";
import ListPrompt from "./lib/promptsTypes/listPrompt.js";

await db.sync({ force: false });
console.log(`Connected to db ${process.env.DB_NAME}`);

import mainPrompt from "./lib/prompts/mainPrompt.js";

mainPrompt();
