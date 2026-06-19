import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APPTS = path.join(__dirname, "../src/assets/appointments");
const DOCTORS = path.join(__dirname, "../src/assets/doctors");

const BASE_SETTINGS = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".settings-import-map.json"), "utf8"),
);
const BASE_ROLE = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".role-import-map.json"), "utf8"),
);

const REUSE = {
  imgFrame1: "../../assets/appointments/frame1.svg",
  imgXClose: "../../assets/doctors/x-close.svg",
  imgHandle: "../../assets/appointments/toggle-handle.svg",
  imgEllipse3705: "../../assets/appointments/ellipse2.svg",
};

function urlsFromRaw(file) {
  const content = fs.readFileSync(path.join(__dirname, file), "utf8");
  const map = new Map();
  const re = /const (img\w+) = "(https:[^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) map.set(m[1], m[2]);
  return map;
}

async function download(url, targetPath) {
  const http = await import("node:https");
  return new Promise((resolve, reject) => {
    http.default
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location, targetPath).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          fs.writeFileSync(targetPath, Buffer.concat(chunks));
          resolve(targetPath);
        });
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function buildMap(base, rawFile, extraKeys) {
  const urls = urlsFromRaw(rawFile);
  const map = { ...base, ...REUSE };
  let downloaded = 0;

  for (const key of extraKeys) {
    if (map[key]) continue;
    const url = urls.get(key);
    if (!url) continue;
    const name =
      key === "imgXClose"
        ? "x-close-popup.svg"
        : key === "imgFrame1"
          ? "dropdown-field.svg"
          : `${key.replace(/^img/, "").replace(/([A-Z])/g, "-$1").toLowerCase()}.svg`;
    const dir = key === "imgXClose" ? DOCTORS : APPTS;
    const target = path.join(dir, name);
    if (!fs.existsSync(target)) {
      await download(url, target);
      downloaded++;
    }
    map[key] =
      dir === DOCTORS
        ? `../../assets/doctors/${path.basename(target)}`
        : `../../assets/appointments/${path.basename(target)}`;
  }

  return { map, downloaded };
}

const userKeys = [...Object.keys(BASE_SETTINGS), "imgFrame1", "imgXClose"];
const roleKeys = [
  ...Object.keys(BASE_ROLE),
  "imgFrame1",
  "imgXClose",
  "imgHandle",
  "imgEllipse3705",
];

const user = await buildMap(BASE_SETTINGS, "user-new-9801.txt", userKeys);
const role = await buildMap(BASE_ROLE, "role-edit-9570.txt", roleKeys);

fs.writeFileSync(
  path.join(__dirname, ".add-user-import-map.json"),
  JSON.stringify(user.map, null, 2),
);
fs.writeFileSync(
  path.join(__dirname, ".add-role-edit-import-map.json"),
  JSON.stringify(role.map, null, 2),
);

console.log(JSON.stringify({ userDownloaded: user.downloaded, roleDownloaded: role.downloaded }));
