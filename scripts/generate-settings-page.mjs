import path from "path";
import { fileURLToPath } from "url";
import { addToAfterLink, generatePage } from "./figma-page-gen.mjs";
import { applySettingsSidebar, applySettingsTabLinks } from "./settings-nav.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const sidebarLinks = [
  ["I1:9380;509:16958", "/patients"],
  ["I1:9380;509:16959", "/doctors"],
  ["I1:9380;509:16960", "/sales"],
  ["I1:9380;509:16961", "/activity-log"],
  ["I1:9380;509:16962", "/treatments"],
  ["I1:9380;509:16963", "/billing"],
  ["I1:9380;509:16964", "/medicines"],
  ["I1:9380;509:16971", "/appointments"],
  ["I1:9380;509:16974", "/dashboard"],
];

function applyNav(code) {
  let c = applySettingsSidebar(code, {
    chevronId: "1:9365",
    arrowExitId: "1:9376",
    sidebarLinks,
  });
  c = applySettingsTabLinks(c, {
    clinicId: "1:9382",
    rolesId: "1:9384",
    preferencesId: "1:9385",
  });
  c = addToAfterLink(c, "1:9416", "/settings/users/role-change");
  c = c.replace(
    /<a className="absolute block cursor-pointer inset-\[8\.4%_22\.22%_88\.48%_68\.54%\]" data-node-id="1:9424" data-name="Bounds">([\s\S]*?)<\/a>\s*<p className="(\[[^\]]+\][^"]*)" data-node-id="1:9425">([\s\S]*?)<\/p>\s*<div className="(-translate-x-1\/2 -translate-y-1\/2 absolute h-\[14px\][^"]+)" data-node-id="1:9426" data-name="Add">([\s\S]*?)<\/div>/,
    `<Link to="/settings/users/new" className="absolute contents cursor-pointer left-[987px] top-[86px]" data-node-id="1:9424">
        <div className="absolute inset-[8.4%_22.22%_88.48%_68.54%]" data-name="Bounds">$1</div>
        <p className="$2 pointer-events-none" data-node-id="1:9425">$3</p>
        <div className="$4 pointer-events-none" data-node-id="1:9426" data-name="Add">$5</div>
      </Link>`,
  );
  return c;
}

const userManagementAlias = `
export function UserManagementPage({ showRolePopup = false }: { showRolePopup?: boolean }) {
  void showRolePopup;
  return <SettingsPage />;
}
`;

generatePage({
  rootDir: __dirname,
  rawFile: "settings-9360.txt",
  importMapPath: path.join(__dirname, ".settings-import-map.json"),
  innerName: "SettingsPageInner",
  exportName: "SettingsPage",
  outPath: path.join(ROOT, "src/pages/settings/SettingsPage.tsx"),
  applyNav,
  extraExports: userManagementAlias,
});
