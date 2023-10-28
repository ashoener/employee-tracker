import "dotenv/config.js";

import db from "./lib/db.js";
import Department from "./lib/schemas/department.js";
import Role from "./lib/schemas/role.js";
import Employee from "./lib/schemas/employee.js";
import BasePrompt from "./lib/promptsTypes/basePrompt.js";
import ListPrompt from "./lib/promptsTypes/listPrompt.js";

const frames = ["|", "/", "—", "\\"];
let frame = 0;
const connectingAnimation = setInterval(() => {
  process.stdout.cursorTo(0);
  process.stdout.write(`Connecting to database (${frames[frame]})`);
  frame++;
  if (frame > frames.length - 1) frame = 0;
}, 150);
await db.sync({ force: false });
process.stdout.clearLine(0);
clearInterval(connectingAnimation);

import mainPrompt from "./lib/prompts/mainPrompt.js";
import logo from "asciiart-logo";

console.log(logo({ name: "Employee Tracker" }).render());

mainPrompt();
