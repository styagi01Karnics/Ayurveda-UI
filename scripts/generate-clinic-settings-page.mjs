import path from "path";
import { fileURLToPath } from "url";
import { addToAfterLink, generatePage } from "./figma-page-gen.mjs";
import { applySettingsSidebar, applySettingsTabLinks } from "./settings-nav.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const sidebarLinks = [
  ["I1:8957;509:16958", "/patients"],
  ["I1:8957;509:16959", "/doctors"],
  ["I1:8957;509:16960", "/sales"],
  ["I1:8957;509:16961", "/activity-log"],
  ["I1:8957;509:16962", "/treatments"],
  ["I1:8957;509:16963", "/billing"],
  ["I1:8957;509:16964", "/medicines"],
  ["I1:8957;509:16971", "/appointments"],
  ["I1:8957;509:16974", "/dashboard"],
];

function applyNav(code) {
  let c = applySettingsSidebar(code, {
    chevronId: "1:8942",
    arrowExitId: "1:8953",
    sidebarLinks,
  });
  c = applySettingsTabLinks(c, {
    userId: "1:8960",
    rolesId: "1:8961",
    preferencesId: "1:8962",
  });
  c = addToAfterLink(c, "1:9039", "/settings/clinic/delete");
  return c;
}

generatePage({
  rootDir: __dirname,
  rawFile: "clinic-8937.txt",
  importMapPath: path.join(__dirname, ".clinic-import-map.json"),
  innerName: "ClinicSettingsPageInner",
  exportName: "ClinicSettingsPage",
  outPath: path.join(ROOT, "src/pages/settings/ClinicSettingsPage.tsx"),
  applyNav,
  frameHeight: 1131,
  exportProps:
    "{ showToast = false, showDeletePopup = false }: { showToast?: boolean; showDeletePopup?: boolean }",
  exportBody: "void showToast; void showDeletePopup;",
});
