import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentDir =
  "C:/Users/DELL/.cursor/projects/e-Rabitron-Github-Ayurvedaa-Ayurveda-UI/agent-tools";

function sliceExport(content) {
  const start = content.indexOf("const img");
  if (start < 0) throw new Error("No const img in export");
  let end = content.indexOf("SUPER CRITICAL:", start);
  if (end < 0) {
    const exportStart = content.indexOf("export default function", start);
    const close = content.indexOf("\n}\n", exportStart);
    end = close >= 0 ? close + 2 : content.length;
  }
  return `${content.slice(start, end).trim()}\n`;
}

function saveNewest(nodeId, outName) {
  let best = null;
  for (const file of fs.readdirSync(agentDir)) {
    if (!file.endsWith(".txt")) continue;
    const full = path.join(agentDir, file);
    const content = fs.readFileSync(full, "utf8");
    if (
      !content.includes(`data-node-id="${nodeId}"`) ||
      !content.includes("export default function")
    ) {
      continue;
    }
    const mtime = fs.statSync(full).mtimeMs;
    if (!best || mtime > best.mtime) best = { file, content, mtime };
  }
  if (!best) throw new Error(`No MCP export found for node ${nodeId}`);
  fs.writeFileSync(path.join(__dirname, outName), sliceExport(best.content));
  console.log(`Saved ${outName} from ${best.file} (${best.content.length} chars)`);
}

const exports = [
  ["1:12660", "doctors-3-12660.txt"],
  ["1:13416", "doctors-4-13416.txt"],
  ["1:13668", "doctors-5-13668.txt"],
];

for (const [nodeId, outName] of exports) {
  try {
    saveNewest(nodeId, outName);
  } catch (err) {
    console.warn(String(err.message));
  }
}
