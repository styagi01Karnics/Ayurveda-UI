import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../src/assets/appointments");

const assets = {
  "pill.svg": "beae1f8b-b415-4993-808c-e3b4c1590816",
  "checkbox.svg": "98ca8da0-c3ad-40a8-a5d5-75b305bd2c33",
};

function download(id, file) {
  return new Promise((resolve, reject) => {
    https
      .get(`https://www.figma.com/api/mcp/asset/${id}`, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          fs.writeFileSync(path.join(outDir, file), Buffer.concat(chunks));
          console.log("wrote", file);
          resolve();
        });
      })
      .on("error", reject);
  });
}

for (const [file, id] of Object.entries(assets)) {
  await download(id, file);
}
