import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentDir = "C:/Users/DELL/.cursor/projects/e-Rabitron-Github-Ayurvedaa-Ayurveda-UI/agent-tools";

function saveExport(srcFile, nodeId, outName) {
  const content = fs.readFileSync(path.join(agentDir, srcFile), "utf8");
  if (!content.includes(`data-node-id="${nodeId}"`)) {
    throw new Error(`Node ${nodeId} not in ${srcFile}`);
  }
  const constStart = content.indexOf("const img");
  const exportStart = content.indexOf("export default function");
  const start = constStart >= 0 ? constStart : exportStart;
  let end = content.indexOf("SUPER CRITICAL:", start);
  if (end < 0) {
    end = content.indexOf("\n}\n", exportStart);
    if (end >= 0) end += 2;
    else end = content.length;
  }
  fs.writeFileSync(path.join(__dirname, outName), `${content.slice(start, end).trim()}\n`);
  console.log("Wrote", outName);
}

saveExport("3fb232e8-483f-452a-ae80-6f9ea7e84612.txt", "1:8937", "clinic-8937.txt");
saveExport("52400ad8-aaf6-4f0c-8642-3dc61eeabb7d.txt", "1:9427", "role-9427.txt");
