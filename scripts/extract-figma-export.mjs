import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentDir =
  "C:/Users/DELL/.cursor/projects/e-Rabitron-Github-Ayurvedaa-Ayurveda-UI/agent-tools";
const [nodeId, outName] = process.argv.slice(2);

if (!nodeId || !outName) {
  console.error("Usage: node extract-figma-export.mjs <nodeId> <outFile>");
  process.exit(1);
}

for (const file of fs.readdirSync(agentDir)) {
  if (!file.endsWith(".txt")) continue;
  const content = fs.readFileSync(path.join(agentDir, file), "utf8");
  if (!content.includes(`data-node-id="${nodeId}"`) || !content.includes("export default function")) continue;

  const constStart = content.indexOf("const img");
  const exportStart = content.indexOf("export default function");
  const start = constStart >= 0 ? constStart : exportStart;

  let end = content.indexOf("SUPER CRITICAL:", start);
  if (end < 0) {
    const close = content.indexOf("\n}\n", exportStart);
    end = close >= 0 ? close + 2 : content.length;
  }

  fs.writeFileSync(path.join(__dirname, outName), content.slice(start, end).trim() + "\n");
  console.log(`Saved ${outName} from ${file}`);
  process.exit(0);
}

console.error(`No export found for node ${nodeId}`);
process.exit(1);
