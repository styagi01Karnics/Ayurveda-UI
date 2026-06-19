import path from "path";
import { fileURLToPath } from "url";
import { generatePage } from "./figma-page-gen.mjs";
import {
  applyInactivePatientsNav,
  applyPatientDetailsNav,
} from "./patients-nav.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const sidebarLinks = [
  ["I1:6037;509:17174", "/doctors"],
  ["I1:6037;509:17175", "/sales"],
  ["I1:6037;509:17176", "/activity-log"],
  ["I1:6037;509:17177", "/treatments"],
  ["I1:6037;509:17178", "/billing"],
  ["I1:6037;509:17179", "/medicines"],
  ["I1:6037;509:17180", "/settings"],
  ["I1:6037;509:17184", "/appointments"],
  ["I1:6037;509:17187", "/dashboard"],
];

function applyInactiveNav(code) {
  let c = applyInactivePatientsNav(code);
  for (const [id, to] of sidebarLinks) {
    c = c.replace(
      new RegExp(`<a([^>]*data-node-id="${id}"[^>]*)>([\\s\\S]*?)<\\/a>`, "g"),
      `<Link to="${to}"$1>$2</Link>`,
    );
  }
  return c;
}

generatePage({
  rootDir: __dirname,
  rawFile: "patients-inactive-6017.txt",
  importMapPath: path.join(__dirname, ".patients-import-map.json"),
  innerName: "InactivePatientsPageInner",
  exportName: "InactivePatientsPage",
  outPath: path.join(ROOT, "src/pages/patients/InactivePatientsPage.tsx"),
  applyNav: applyInactiveNav,
});

generatePage({
  rootDir: __dirname,
  rawFile: "patients-details-14154.txt",
  importMapPath: path.join(__dirname, ".patients-import-map.json"),
  innerName: "PatientDetailsPageInner",
  exportName: "PatientDetailsPage",
  outPath: path.join(ROOT, "src/pages/patients/PatientDetailsPage.tsx"),
  applyNav: (code) => applyPatientDetailsNav(code, { activeTab: "personal" }),
  frameHeight: 1084,
});
