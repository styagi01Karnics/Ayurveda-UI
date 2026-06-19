import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "doctors-5-13668.txt");

let c = fs.readFileSync(file, "utf8");
c = c.replace(/data-node-id="1:13616"/g, 'data-node-id="1:13668"');
c = c.replace(/data-name="Doctors 4"/g, 'data-name="Doctors 5"');
c = c.replace(
  'const imgLine452 = "https://placeholder";\n',
  'const imgLine452 = "https://www.figma.com/api/mcp/asset/d24e5b4a-acaa-4028-8f94-1d2899092c95";\n',
);

fs.writeFileSync(file, c);
console.log("Patched doctors-5-13668.txt");
