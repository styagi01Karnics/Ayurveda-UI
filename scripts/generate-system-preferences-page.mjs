import path from "path";
import { fileURLToPath } from "url";
import { generatePage } from "./figma-page-gen.mjs";
import { applySettingsSidebar, applySettingsTabLinks } from "./settings-nav.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const sidebarLinks = [
  ["I1:9538;509:16958", "/patients"],
  ["I1:9538;509:16959", "/doctors"],
  ["I1:9538;509:16960", "/sales"],
  ["I1:9538;509:16961", "/activity-log"],
  ["I1:9538;509:16962", "/treatments"],
  ["I1:9538;509:16963", "/billing"],
  ["I1:9538;509:16964", "/medicines"],
  ["I1:9538;509:16971", "/appointments"],
  ["I1:9538;509:16974", "/dashboard"],
];

function applyNav(code) {
  let c = applySettingsSidebar(code, {
    chevronId: "1:9523",
    arrowExitId: "1:9534",
    sidebarLinks,
  });
  return applySettingsTabLinks(c, {
    clinicId: "1:9540",
    userId: "1:9541",
    rolesId: "1:9542",
  });
}

generatePage({
  rootDir: __dirname,
  rawFile: "preferences-9518.txt",
  importMapPath: path.join(__dirname, ".preferences-import-map.json"),
  innerName: "SystemPreferencesPageInner",
  exportName: "SystemPreferencesPage",
  outPath: path.join(ROOT, "src/pages/settings/SystemPreferencesPage.tsx"),
  applyNav,
});
