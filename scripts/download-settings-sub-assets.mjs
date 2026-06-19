import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APPTS = path.join(__dirname, "../src/assets/appointments");
const BASE_MAP = JSON.parse(fs.readFileSync(path.join(__dirname, ".settings-import-map.json"), "utf8"));

const RAW_FILES = ["clinic-8937.txt", "role-9427.txt", "preferences-9518.txt"];

const REUSE = {
  ...BASE_MAP,
  imgEdit: "../../assets/doctors/edit.svg",
  imgLine449: "../../assets/doctors/line449.svg",
  imgLine450: "../../assets/doctors/line450.svg",
  imgBounds: "../../assets/appointments/book-btn-bg.svg",
};

const DOWNLOAD_NAMES = {
  imgHandle: "toggle-handle.svg",
  imgDelete: "delete.svg",
  imgDelete1: "delete-filled.svg",
  imgPeople: "people.svg",
  imgEllipse3706: "ellipse3.svg",
  imgLine469: "line469.svg",
  imgLine474: "line474.svg",
  imgFrame1: "frame1.svg",
  imgFrame2: "frame2.svg",
  imgFrame3: "frame3.svg",
};

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    mod
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchBuffer(res.headers.location).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

function extFromMagic(buf) {
  const hex = buf.slice(0, 4).toString("hex").toUpperCase();
  if (hex.startsWith("3C737667") || buf.slice(0, 5).toString("utf8").includes("svg")) return ".svg";
  if (hex.startsWith("89504E47")) return ".png";
  if (hex.startsWith("FFD8FF")) return ".jpg";
  return ".svg";
}

async function downloadAsset(url, targetPath) {
  const buf = await fetchBuffer(url);
  const ext = path.extname(targetPath) || extFromMagic(buf);
  const finalPath = path.extname(targetPath) ? targetPath : targetPath + ext;
  fs.writeFileSync(finalPath, buf);
  return finalPath;
}

const urlByVar = new Map();
for (const file of RAW_FILES) {
  const content = fs.readFileSync(path.join(__dirname, file), "utf8");
  const re = /const (img\w+) = "(https:[^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    if (!urlByVar.has(m[1])) urlByVar.set(m[1], m[2]);
  }
}

async function buildMap(extraKeys = []) {
  const map = { ...BASE_MAP, ...REUSE };
  let downloaded = 0;

  for (const key of extraKeys) {
    if (map[key]) continue;
    if (REUSE[key]) {
      map[key] = REUSE[key];
      continue;
    }
    const url = urlByVar.get(key);
    if (!url) continue;
    const fileName = DOWNLOAD_NAMES[key] || `${key.replace(/^img/, "").replace(/([A-Z])/g, "-$1").toLowerCase()}.svg`;
    const target = path.join(APPTS, fileName);
    if (!fs.existsSync(target)) {
      await downloadAsset(url, target);
      downloaded++;
    }
    map[key] = `../../assets/appointments/${path.basename(target)}`;
  }

  for (const [key, relPath] of Object.entries(BASE_MAP)) {
    if (!map[key]) map[key] = relPath;
  }

  return { map, downloaded };
}

const clinicKeys = [
  ...Object.keys(BASE_MAP),
  "imgLine472",
  "imgLine474",
  "imgDelete",
  "imgDelete1",
  "imgFrame1",
  "imgFrame2",
  "imgFrame3",
];

const roleKeys = [
  ...Object.keys(BASE_MAP),
  "imgBounds",
  "imgPeople",
  "imgEllipse3706",
  "imgEdit",
  "imgLine469",
  "imgLine449",
  "imgLine450",
];

const preferencesKeys = [...Object.keys(BASE_MAP), "imgHandle", "imgLine449", "imgLine450"];

const clinic = await buildMap(clinicKeys);
const role = await buildMap(roleKeys);
const preferences = await buildMap(preferencesKeys);

fs.writeFileSync(path.join(__dirname, ".clinic-import-map.json"), JSON.stringify(clinic.map, null, 2));
fs.writeFileSync(path.join(__dirname, ".role-import-map.json"), JSON.stringify(role.map, null, 2));
fs.writeFileSync(path.join(__dirname, ".preferences-import-map.json"), JSON.stringify(preferences.map, null, 2));

console.log(
  JSON.stringify({
    clinicDownloaded: clinic.downloaded,
    roleDownloaded: role.downloaded,
    preferencesDownloaded: preferences.downloaded,
  }),
);
