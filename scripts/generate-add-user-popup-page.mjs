import path from "path";
import { fileURLToPath } from "url";
import { addToAfterLink, generatePage } from "./figma-page-gen.mjs";
import {
  applySettingsSidebar,
  pTabToLink,
  wireSidebarPItems,
} from "./settings-nav.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const sidebarPItems = [
  ["I1:9821;509:16958", "/patients", "Patients"],
  ["I1:9821;509:16959", "/doctors", "Doctors"],
  ["I1:9821;509:16960", "/sales", "Sales"],
  ["I1:9821;509:16961", "/activity-log", "Activity Logs"],
  ["I1:9821;509:16962", "/treatments", "Treatments"],
  ["I1:9821;509:16963", "/billing", "Billing"],
  ["I1:9821;509:16964", "/medicines", "Medicines"],
  ["I1:9821;509:16971", "/appointments", "Appointments"],
  ["I1:9821;509:16974", "/dashboard", "Dashboard"],
];

function applyNav(code) {
  let c = applySettingsSidebar(code, {
    chevronId: "1:9806",
    arrowExitId: "1:9817",
    sidebarLinks: [],
  });
  c = wireSidebarPItems(c, sidebarPItems);
  c = pTabToLink(c, "1:9823", "/settings/clinic");
  c = pTabToLink(c, "1:9825", "/settings/roles");
  c = pTabToLink(c, "1:9826", "/settings/preferences");
  c = addToAfterLink(c, "1:9911", "/settings");
  return c;
}

generatePage({
  rootDir: __dirname,
  rawFile: "user-new-9801.txt",
  importMapPath: path.join(__dirname, ".add-user-import-map.json"),
  innerName: "AddUserPopupPageInner",
  exportName: "AddUserPopupPage",
  outPath: path.join(ROOT, "src/pages/settings/AddUserPopupPage.tsx"),
  applyNav,
});
