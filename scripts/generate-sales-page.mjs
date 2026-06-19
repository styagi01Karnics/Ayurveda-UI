import path from "path";
import { fileURLToPath } from "url";
import { applyCommonNav, generatePage } from "./figma-page-gen.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const sidebarLinks = [
  ["I1:8695;509:17039", "/patients"],
  ["I1:8695;509:17040", "/doctors"],
  ["I1:8695;509:17043", "/activity-log"],
  ["I1:8695;509:17044", "/treatments"],
  ["I1:8695;509:17045", "/billing"],
  ["I1:8695;509:17046", "/medicines"],
  ["I1:8695;509:17047", "/settings"],
  ["I1:8695;509:17052", "/appointments"],
  ["I1:8695;509:17055", "/dashboard"],
];

function applyNav(code) {
  return applyCommonNav(code, {
    chevronId: "1:8680",
    arrowExitId: "1:8691",
    breadcrumbLabel: "Sales",
    sidebarLinks,
  });
}

generatePage({
  rootDir: __dirname,
  rawFile: "sales-8675.txt",
  importMapPath: path.join(__dirname, ".sales-import-map.json"),
  innerName: "SalesPageInner",
  exportName: "SalesPage",
  outPath: path.join(ROOT, "src/pages/sales/SalesPage.tsx"),
  applyNav,
});
