import path from "path";
import { fileURLToPath } from "url";
import { applyCommonNav, generatePage } from "./figma-page-gen.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const sidebarLinks = [
  ["I1:8805;509:17012", "/patients"],
  ["I1:8805;509:17013", "/doctors"],
  ["I1:8805;509:17014", "/sales"],
  ["I1:8805;509:17017", "/treatments"],
  ["I1:8805;509:17018", "/billing"],
  ["I1:8805;509:17019", "/medicines"],
  ["I1:8805;509:17020", "/settings"],
  ["I1:8805;509:17025", "/appointments"],
  ["I1:8805;509:17028", "/dashboard"],
];

function applyNav(code) {
  return applyCommonNav(code, {
    chevronId: "1:8790",
    arrowExitId: "1:8801",
    breadcrumbLabel: "Activity Logs",
    sidebarLinks,
  });
}

generatePage({
  rootDir: __dirname,
  rawFile: "activity-log-8785.txt",
  importMapPath: path.join(__dirname, ".activity-log-import-map.json"),
  innerName: "ActivityLogPageInner",
  exportName: "ActivityLogPage",
  outPath: path.join(ROOT, "src/pages/activity/ActivityLogPage.tsx"),
  applyNav,
});
