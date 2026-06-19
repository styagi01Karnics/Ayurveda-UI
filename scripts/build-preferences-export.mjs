import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentDir = "C:/Users/DELL/.cursor/projects/e-Rabitron-Github-Ayurvedaa-Ayurveda-UI/agent-tools";
const outPath = path.join(__dirname, "preferences-9518.txt");

if (!fs.existsSync(agentDir)) {
  console.error("agent-tools directory not found");
  process.exit(1);
}

for (const file of fs.readdirSync(agentDir)) {
  if (!file.endsWith(".txt")) continue;
  const content = fs.readFileSync(path.join(agentDir, file), "utf8");
  if (!content.includes('data-node-id="1:9518"') || !content.includes("imgHandle")) continue;
  const start = content.indexOf("const img");
  let end = content.indexOf("SUPER CRITICAL:", start);
  if (end < 0) end = content.length;
  fs.writeFileSync(outPath, `${content.slice(start, end).trim()}\n`);
  console.log("Wrote preferences-9518.txt from", file);
  process.exit(0);
}

console.error("No MCP export with node 1:9518 found. Saving inline fallback...");

const header = fs.readFileSync(path.join(__dirname, "preferences-9518.txt"), "utf8").trim();
if (!header.includes("imgHandle")) {
  console.error("Header missing imgHandle");
  process.exit(1);
}

const bodyPath = path.join(__dirname, "preferences-9518-body.txt");
if (!fs.existsSync(bodyPath)) {
  console.error("Missing preferences-9518-body.txt fallback");
  process.exit(1);
}

const body = fs.readFileSync(bodyPath, "utf8").trim();
fs.writeFileSync(outPath, `${header}\n\nexport default function SystemPreferenceSettings() {\n${body}\n}\n`);
console.log("Wrote preferences-9518.txt from header + body fallback");
