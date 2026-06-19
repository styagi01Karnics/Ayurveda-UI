import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentDir =
  "C:/Users/DELL/.cursor/projects/e-Rabitron-Github-Ayurvedaa-Ayurveda-UI/agent-tools";

function extract(file, nodeId, outName) {
  const content = fs.readFileSync(path.join(agentDir, file), "utf8");
  const start = content.indexOf("const img");
  if (start < 0) throw new Error(`No code in ${file}`);
  let end = content.indexOf("SUPER CRITICAL:", start);
  if (end < 0) end = content.length;
  const slice = content.slice(start, end).trim();
  if (!slice.includes(`data-node-id="${nodeId}"`)) {
    throw new Error(`Node ${nodeId} not found in ${file}`);
  }
  fs.writeFileSync(path.join(__dirname, outName), `${slice}\n`);
  console.log(`Saved ${outName} (${slice.length} chars)`);
}

extract("298113ee-2832-46e3-9708-74ff03bb5aa1.txt", "1:12660", "doctors-3-12660.txt");
extract("2692d739-ef2c-4fbe-b567-f18401fdb07e.txt", "1:13416", "doctors-4-13416.txt");

for (const file of fs.readdirSync(agentDir)) {
  if (!file.endsWith(".txt")) continue;
  const content = fs.readFileSync(path.join(agentDir, file), "utf8");
  if (!content.includes('data-node-id="1:13668"')) continue;
  const start = content.indexOf("const img");
  if (start < 0) continue;
  let end = content.indexOf("SUPER CRITICAL:", start);
  if (end < 0) end = content.length;
  fs.writeFileSync(
    path.join(__dirname, "doctors-5-13668.txt"),
    `${content.slice(start, end).trim()}\n`,
  );
  console.log(`Saved doctors-5-13668.txt from ${file}`);
  break;
}
