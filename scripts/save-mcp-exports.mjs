import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentDir = path.join(__dirname, "../../agent-tools");

function extract(nodeId, fnPattern, outName) {
  for (const file of fs.readdirSync(agentDir)) {
    if (!file.endsWith(".txt")) continue;
    const content = fs.readFileSync(path.join(agentDir, file), "utf8");
    if (!content.includes(`data-node-id="${nodeId}"`) || !content.includes("imgChevron")) continue;
    const start = content.indexOf("const img");
    if (start < 0) continue;
    let end = content.indexOf("SUPER CRITICAL:", start);
    if (end < 0) end = content.length;
    fs.writeFileSync(path.join(__dirname, outName), content.slice(start, end).trim());
    console.log(`Saved ${outName} from ${file}`);
    return true;
  }
  return false;
}

const ok =
  extract("1:8484", "Medicnes1", "medicines-8484.txt") &&
  extract("1:8675", "Sales", "sales-8675.txt") &&
  extract("1:8785", "ActivityLog", "activity-log-8785.txt");

if (!ok) {
  console.error("Could not find fresh MCP exports with imgChevron format");
  process.exit(1);
}
