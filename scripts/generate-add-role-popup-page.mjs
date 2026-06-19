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
  ["I1:9590;509:16958", "/patients", "Patients"],
  ["I1:9590;509:16959", "/doctors", "Doctors"],
  ["I1:9590;509:16960", "/sales", "Sales"],
  ["I1:9590;509:16961", "/activity-log", "Activity Logs"],
  ["I1:9590;509:16962", "/treatments", "Treatments"],
  ["I1:9590;509:16963", "/billing", "Billing"],
  ["I1:9590;509:16964", "/medicines", "Medicines"],
  ["I1:9590;509:16971", "/appointments", "Appointments"],
  ["I1:9590;509:16974", "/dashboard", "Dashboard"],
];

function applyNav(code) {
  let c = applySettingsSidebar(code, {
    chevronId: "1:9575",
    arrowExitId: "1:9586",
    sidebarLinks: [],
  });
  c = wireSidebarPItems(c, sidebarPItems);
  c = pTabToLink(c, "1:9595", "/settings/clinic");
  c = pTabToLink(c, "1:9596", "/settings");
  c = pTabToLink(c, "1:9598", "/settings/preferences");
  c = addToAfterLink(c, "1:9711", "/settings/roles");
  return c;
}

generatePage({
  rootDir: __dirname,
  rawFile: "role-edit-9570.txt",
  importMapPath: path.join(__dirname, ".add-role-edit-import-map.json"),
  innerName: "AddRolePopupPageInner",
  exportName: "AddRolePopupPage",
  outPath: path.join(ROOT, "src/pages/settings/AddRolePopupPage.tsx"),
  applyNav,
});
