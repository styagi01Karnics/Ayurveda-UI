import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentDir = path.join(__dirname, "../../agent-tools");
const outPath = path.join(__dirname, "preferences-9518.txt");

for (const file of fs.readdirSync(agentDir)) {
  if (!file.endsWith(".txt")) continue;
  const content = fs.readFileSync(path.join(agentDir, file), "utf8");
  if (!content.includes('data-node-id="1:9518"') || !content.includes("imgHandle")) continue;

  const start = content.indexOf("const img");
  let end = content.indexOf("SUPER CRITICAL:", start);
  if (end < 0) end = content.length;

  fs.writeFileSync(outPath, content.slice(start, end).trim() + "\n");
  console.log("Saved preferences-9518.txt from", file);
  process.exit(0);
}

console.error("No preferences export found in agent-tools");
process.exit(1);
