import path from "path";
import { fileURLToPath } from "url";
import { addToAfterLink, applyCommonNav, generatePage } from "./figma-page-gen.mjs";
import { wireSidebarPItems } from "./settings-nav.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const sidebarPItems = [
  ["I1:10782;509:17066", "/patients", "Patients"],
  ["I1:10782;509:17067", "/doctors", "Doctors"],
  ["I1:10782;509:17068", "/sales", "Sales"],
  ["I1:10782;509:17069", "/activity-log", "Activity Logs"],
  ["I1:10782;509:17070", "/treatments", "Treatments"],
  ["I1:10782;509:17071", "/billing", "Billing"],
  ["I1:10782;509:17074", "/settings", "Settings"],
  ["I1:10782;509:17078", "/appointments", "Appointments"],
  ["I1:10782;509:17081", "/dashboard", "Dashboard"],
];

const modalComponentBlock = `
      <div className="absolute inset-0 z-[100]" data-name="add-medicine-modal-layer">
        <Link
          to="/medicines"
          className="absolute inset-0 block cursor-pointer bg-[rgba(49,49,49,0.45)]"
          data-node-id="1:10854"
          aria-label="Close"
        />
        <div className="absolute inset-0 pointer-events-none" data-node-id="1:10855">
          <AddMedicineFormModal />
        </div>
      </div>`;

function applyModalPolish(code) {
  let c = code;

  if (!c.includes("AddMedicineFormModal")) {
    c = c.replace(
      'import { Link } from "react-router-dom";',
      'import { Link } from "react-router-dom";\nimport { AddMedicineFormModal } from "../../components/medicines/AddMedicineFormModal";',
    );
  }

  c = c.replace(
    /<div className="absolute bg-\[rgba\(49,49,49,0\.45\)\] h-\[1017px\] left-0 top-0 w-\[1440px\]" data-node-id="1:10854" \/>[\s\S]*?(?=\n    <\/div>\n  \);)/,
    modalComponentBlock.trim(),
  );

  c = c.replace(
    /import imgAdd from[^\n]+\n/g,
    "",
  );
  c = c.replace(
    /import imgFrame1 from[^\n]+\n/g,
    "",
  );
  c = c.replace(
    /import imgFrame2 from[^\n]+\n/g,
    "",
  );
  c = c.replace(
    /import imgGroup3754 from[^\n]+\n/g,
    "",
  );

  c = c.replace(
    /overflow-x-auto bg-\[#fffef7\]/,
    "overflow-x-auto overflow-y-auto bg-[#fffef7]",
  );

  return c;
}

function applyNav(code) {
  let c = applyCommonNav(code, {
    chevronId: "1:10767",
    arrowExitId: "1:10778",
    breadcrumbLabel: "Medicines",
    sidebarLinks: [],
  });
  c = wireSidebarPItems(c, sidebarPItems);
  c = applyModalPolish(c);
  return c;
}

generatePage({
  rootDir: __dirname,
  rawFile: "medicines-add-10762.txt",
  importMapPath: path.join(__dirname, ".add-medicine-import-map.json"),
  innerName: "AddMedicinePopupPageInner",
  exportName: "AddMedicinePopupPage",
  outPath: path.join(ROOT, "src/pages/medicines/AddMedicinePopupPage.tsx"),
  applyNav,
});
