import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { normalizeFigmaTypography } from "./figma-normalize.mjs";
import { applyPatientNav, applyTabNav, EDIT_ROUTES } from "./doctors-patient-nav.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const BASE_IMPORT_MAP = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".doctors-2-import-map.json"), "utf8"),
);

const EXTENDED_IMPORTS = {
  imgIconFolder: "../../assets/appointments/book/icon-folder.svg",
  imgIconEllipsis: "../../assets/appointments/book/icon-ellipsis.svg",
  imgIconPdf: "../../assets/appointments/book/icon-pdf.svg",
  imgLine439: "../../assets/appointments/line439.svg",
  imgLine452: "../../assets/doctors/line452.svg",
};

const IMPORT_MAP = { ...BASE_IMPORT_MAP, ...EXTENDED_IMPORTS };

function stripAssetConsts(code) {
  return code.replace(/^const img\w+ = "https:[^"]+";\n/gm, "");
}

function extractUsedVars(code) {
  const vars = new Set();
  const re = /src=\{(\w+)\}/g;
  let m;
  while ((m = re.exec(code)) !== null) vars.add(m[1]);
  return [...vars].filter((v) => IMPORT_MAP[v]);
}

function buildImports(usedVars) {
  const lines = ['import { Link } from "react-router-dom";'];
  for (const v of usedVars.sort()) {
    lines.push(`import ${v} from "${IMPORT_MAP[v]}";`);
  }
  return lines.join("\n");
}

function generatePage({
  rawFile,
  innerName,
  exportName,
  outPath,
  activeTab,
  frameHeight,
}) {
  let raw = fs.readFileSync(path.join(__dirname, rawFile), "utf8");
  const footerIdx = raw.indexOf("SUPER CRITICAL:");
  if (footerIdx >= 0) raw = raw.slice(0, footerIdx);

  let body = raw.replace(/export default function \w+\(\)/, `function ${innerName}()`);
  body = stripAssetConsts(body);
  body = applyTabNav(body, activeTab);
  body = applyPatientNav(body, { editRoute: EDIT_ROUTES[activeTab] });
  body = normalizeFigmaTypography(body);
  body = body.replace(/font-\['IBM_Plex_Sans:Regular'\]/g, "font-['Inter']");

  const usedVars = extractUsedVars(body);
  const output = `${buildImports(usedVars)}

${body}

export default function ${exportName}() {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[${frameHeight}px] w-[1440px] shrink-0 overflow-visible">
        <${innerName} />
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(outPath, output);
  console.log("Wrote", outPath, "vars:", usedVars.length);
}

const pages = [
  {
    rawFile: "doctors-2-12069.txt",
    innerName: "DoctorPatientDetailsPageInner",
    exportName: "DoctorPatientDetailsPage",
    outPath: path.join(ROOT, "src/pages/doctors/DoctorPatientDetailsPage.tsx"),
    activeTab: "personal",
    frameHeight: 1184,
  },
  {
    rawFile: "doctors-3-12660.txt",
    innerName: "DoctorPatientMedicalAssessmentPageInner",
    exportName: "DoctorPatientMedicalAssessmentPage",
    outPath: path.join(ROOT, "src/pages/doctors/DoctorPatientMedicalAssessmentPage.tsx"),
    activeTab: "medical",
    frameHeight: 1480,
  },
  {
    rawFile: "doctors-4-13416.txt",
    innerName: "DoctorPatientTreatmentPageInner",
    exportName: "DoctorPatientTreatmentPage",
    outPath: path.join(ROOT, "src/pages/doctors/DoctorPatientTreatmentPage.tsx"),
    activeTab: "treatment",
    frameHeight: 1184,
  },
  {
    rawFile: "doctors-5-13668.txt",
    innerName: "DoctorPatientBillingPageInner",
    exportName: "DoctorPatientBillingPage",
    outPath: path.join(ROOT, "src/pages/doctors/DoctorPatientBillingPage.tsx"),
    activeTab: "billing",
    frameHeight: 1184,
  },
];

for (const page of pages) {
  generatePage(page);
}
