import path from "path";
import { fileURLToPath } from "url";
import { addToAfterLink, generatePage } from "./figma-page-gen.mjs";
import { applySettingsSidebar, applySettingsTabLinks } from "./settings-nav.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const sidebarLinks = [
  ["I1:9447;509:16958", "/patients"],
  ["I1:9447;509:16959", "/doctors"],
  ["I1:9447;509:16960", "/sales"],
  ["I1:9447;509:16961", "/activity-log"],
  ["I1:9447;509:16962", "/treatments"],
  ["I1:9447;509:16963", "/billing"],
  ["I1:9447;509:16964", "/medicines"],
  ["I1:9447;509:16971", "/appointments"],
  ["I1:9447;509:16974", "/dashboard"],
];

function applyNav(code) {
  let c = applySettingsSidebar(code, {
    chevronId: "1:9432",
    arrowExitId: "1:9443",
    sidebarLinks,
  });
  c = applySettingsTabLinks(c, {
    clinicId: "1:9452",
    userId: "1:9453",
    preferencesId: "1:9455",
  });
  c = c.replace(
    /<a className="absolute block cursor-pointer inset-\[8\.4%_22\.22%_88\.48%_67\.43%\]" data-node-id="1:9448" data-name="Bounds">([\s\S]*?)<\/a>\s*<p className="(\[[^\]]+\][^"]*)" data-node-id="1:9449">([\s\S]*?)<\/p>\s*<div className="(-translate-x-1\/2 -translate-y-1\/2 absolute h-\[14px\][^"]+)" data-node-id="1:9450" data-name="Add">([\s\S]*?)<\/div>/,
    `<Link to="/settings/roles/edit" className="absolute contents cursor-pointer left-[951px] top-[86px]" data-node-id="1:9448">
        <div className="absolute inset-[8.4%_22.22%_88.48%_67.43%]" data-name="Bounds">$1</div>
        <p className="$2 pointer-events-none" data-node-id="1:9449">$3</p>
        <div className="$4 pointer-events-none" data-node-id="1:9450" data-name="Add">$5</div>
      </Link>`,
  );
  c = c.replace(
    /<div className="(-translate-x-1\/2 -translate-y-1\/2 absolute left-\[calc\(50%[^\]]+\)\] size-\[16px\] top-\[calc\(50%-306\.5px\)\])" data-node-id="(1:951[234])" data-name="Edit">([\s\S]*?)<\/div>/g,
    `<Link to="/settings/roles/edit" className="$1 block cursor-pointer" data-node-id="$2" data-name="Edit">$3</Link>`,
  );
  return c;
}

generatePage({
  rootDir: __dirname,
  rawFile: "role-9427.txt",
  importMapPath: path.join(__dirname, ".role-import-map.json"),
  innerName: "RoleManagementPageInner",
  exportName: "RoleManagementPage",
  outPath: path.join(ROOT, "src/pages/settings/RoleManagementPage.tsx"),
  applyNav,
});
