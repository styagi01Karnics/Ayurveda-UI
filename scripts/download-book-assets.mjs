import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const APPTS = path.join(ROOT, "src/assets/appointments");
const BOOK = path.join(APPTS, "book");
const AGENT = "C:/Users/DELL/.cursor/projects/e-Rabitron-Github-Ayurvedaa-Ayurveda-UI/agent-tools";

fs.mkdirSync(BOOK, { recursive: true });

const REUSE_MAP = {
  imgRectangle1: "sidebar-bg.png",
  imgLogo21: "logo.png",
  imgDoctor: "doctor.svg",
  imgPerson: "person.svg",
  imgBriefcaseMedical: "briefcase.svg",
  imgSettings: "settings.svg",
  imgHistory: "history.svg",
  imgDocumentBulletList: "document.svg",
  imgDataHistogram: "histogram.svg",
  imgHeartPulse: "heart.svg",
  imgGrid: "grid.svg",
  imgCalendarPerson: "calendar-person.svg",
  imgImage: "avatar.png",
  imgEllipse3704: "ellipse.svg",
  imgLine477: "line477.svg",
  imgChevron: "chevron.svg",
  imgFrame: "close.svg",
  imgGroup: "arrow-group.svg",
  imgArrowExit: "arrow-exit.svg",
  imgAlert: "alert.svg",
  imgBounds: "book-btn-bg.svg",
  imgAdd: "add.svg",
  imgLine355: "line355.svg",
  imgBounds1: "tab-follow-ups.svg",
  imgBounds2: "search-bg.svg",
  imgSearch: "search.svg",
  imgBounds3: "filter-bg.svg",
  imgBounds4: "date-bg.svg",
  imgChevron1: "chevron1.svg",
  imgCalendar: "calendar-icon.svg",
  imgLine340: "line340.svg",
  imgLine439: "line439.svg",
  imgLine472: "line472.svg",
  imgAppsList: "apps-list.svg",
  imgCalendar1: "popup-calendar.svg",
  imgLine453: "line453.svg",
};

const NEW_NAMES = {
  imgFrame1: "chevron-select.svg",
  imgFrame2: "chevron-section.svg",
  imgFrame3: "calendar-field.svg",
  imgFrame4: "tag-close.svg",
  imgFrame5: "chevron-field.svg",
  imgSize16ThemeRegular: "delete-icon.svg",
  imgIconFolder: "icon-folder.svg",
  imgIconEllipsis: "icon-ellipsis.svg",
  imgIconPdf: "icon-pdf.svg",
  imgGroup2085663478: "confirm-success.svg",
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

const figmaFiles = [
  "afc521c8-3710-469c-a5c8-58881a61028a.txt",
  "86d44e4a-6e2c-4f5f-b71e-de1bdd2b6cb1.txt",
];

const urlByVar = new Map();
let downloaded = 0;

for (const file of figmaFiles) {
  const content = fs.readFileSync(path.join(AGENT, file), "utf8");
  const re = /const (img\w+) = "(https:[^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const [, varName, url] = m;
    if (!urlByVar.has(varName)) urlByVar.set(varName, url);
  }
}

// Confirm page assets from MCP response saved separately if needed
const confirmSnippet = fs.existsSync(path.join(AGENT, "confirm-7435.txt"))
  ? fs.readFileSync(path.join(AGENT, "confirm-7435.txt"), "utf8")
  : "";
if (confirmSnippet) {
  const re = /const (img\w+) = "(https:[^"]+)"/g;
  let m;
  while ((m = re.exec(confirmSnippet)) !== null) {
    const [, varName, url] = m;
    if (!urlByVar.has(varName)) urlByVar.set(varName, url);
  }
}

const importMap = {};

for (const [varName, url] of urlByVar) {
  if (REUSE_MAP[varName]) {
    importMap[varName] = `../../assets/appointments/${REUSE_MAP[varName]}`;
    continue;
  }
  const baseName = NEW_NAMES[varName] || `${varName.replace(/^img/, "").replace(/([A-Z])/g, "-$1").toLowerCase()}.svg`;
  const target = path.join(BOOK, baseName);
  if (!fs.existsSync(target)) {
    await downloadAsset(url, target);
    downloaded++;
  }
  importMap[varName] = `../../assets/appointments/book/${path.basename(target)}`;
}

// Download confirm-only asset if missing
if (!importMap.imgGroup2085663478) {
  const url = "https://www.figma.com/api/mcp/asset/7a151cb8-a986-4c6a-b009-f11b110f2e75";
  const target = path.join(BOOK, "confirm-success.svg");
  if (!fs.existsSync(target)) {
    await downloadAsset(url, target);
    downloaded++;
  }
  importMap.imgGroup2085663478 = "../../assets/appointments/book/confirm-success.svg";
}

fs.writeFileSync(path.join(__dirname, ".book-import-map.json"), JSON.stringify(importMap, null, 2));
console.log(JSON.stringify({ downloaded, totalVars: Object.keys(importMap).length, bookDir: BOOK }));
