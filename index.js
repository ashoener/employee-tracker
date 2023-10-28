import "dotenv/config.js";

import db from "./lib/db.js";
import Department from "./lib/schemas/department.js";
import Role from "./lib/schemas/role.js";
import Employee from "./lib/schemas/employee.js";
import BasePrompt from "./lib/promptsTypes/basePrompt.js";
import ListPrompt from "./lib/promptsTypes/listPrompt.js";

import mainPrompt from "./lib/prompts/mainPrompt.js";
import logo from "asciiart-logo";

console.log(logo({ name: "Employee Tracker" }).render());

const frames = ["|", "/", "—", "\\"];
let frame = 0;
process.stdout.write(`Connecting to database (${frames[frame]})`);
const connectingAnimation = setInterval(() => {
  frame++;
  if (frame > frames.length - 1) frame = 0;
  process.stdout.cursorTo(0);
  process.stdout.write(`Connecting to database (${frames[frame]})`);
}, 150);

await db.sync({ force: false });

process.stdout.clearLine(0);
process.stdout.cursorTo(0);

clearInterval(connectingAnimation);

mainPrompt();
