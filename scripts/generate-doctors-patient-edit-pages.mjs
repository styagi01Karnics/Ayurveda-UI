import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { normalizeFigmaTypography } from "./figma-normalize.mjs";
import { applyPatientEditNav, applyTabNav } from "./doctors-patient-nav.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const BASE_IMPORT_MAP = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".doctors-patient-edit-import-map.json"), "utf8"),
);

const FRAME_ICON_OVERRIDES = {
  personal: {
    imgFrame1: "../../assets/doctors/tag-close.svg",
    imgFrame2: "../../assets/doctors/dropdown-chevron.svg",
    imgFrame3: "../../assets/doctors/section-close.svg",
    imgFrame4: "../../assets/appointments/book/calendar-field.svg",
  },
  medical: {
    imgFrame1: "../../assets/doctors/section-close.svg",
    imgFrame2: "../../assets/doctors/dropdown-chevron.svg",
    imgFrame3: "../../assets/doctors/tag-close.svg",
    imgFrame4: "../../assets/appointments/book/calendar-field.svg",
  },
  treatment: {
    imgFrame1: "../../assets/doctors/section-close.svg",
    imgFrame2: "../../assets/doctors/dropdown-chevron.svg",
    imgFrame3: "../../assets/appointments/book/calendar-field.svg",
  },
  billing: {
    imgFrame1: "../../assets/doctors/section-close.svg",
    imgFrame2: "../../assets/doctors/dropdown-chevron.svg",
    imgFrame3: "../../assets/appointments/book/calendar-field.svg",
  },
};

function stripAssetConsts(code) {
  return code.replace(/^const img\w+ = "https:[^"]+";\n/gm, "");
}

function inlineDeleteIcons(code) {
  let c = code.replace(/^type DeleteProps[\s\S]*?^function Delete\([\s\S]*?\n\}\n\n/m, "");
  c = c.replace(
    /<Delete className="([^"]*)"\s*\/>/g,
    '<div className="$1"><img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSize16ThemeRegular} /></div>',
  );
  return c;
}

function extractUsedVars(code, importMap) {
  const vars = new Set();
  const re = /src=\{(\w+)\}/g;
  let m;
  while ((m = re.exec(code)) !== null) vars.add(m[1]);
  return [...vars].filter((v) => importMap[v]);
}

function buildImports(usedVars, importMap) {
  const lines = ['import { Link } from "react-router-dom";'];
  for (const v of usedVars.sort()) {
    lines.push(`import ${v} from "${importMap[v]}";`);
  }
  return lines.join("\n");
}

function generatePage({
  rawFile,
  innerName,
  exportName,
  outPath,
  activeTab,
  viewRoute,
  frameHeight,
}) {
  const importMap = {
    ...BASE_IMPORT_MAP,
    ...FRAME_ICON_OVERRIDES[activeTab],
  };

  let raw = fs.readFileSync(path.join(__dirname, rawFile), "utf8");
  const footerIdx = raw.indexOf("SUPER CRITICAL:");
  if (footerIdx >= 0) raw = raw.slice(0, footerIdx);

  let body = raw.replace(/export default function \w+\(\)/, `function ${innerName}()`);
  body = stripAssetConsts(body);
  body = inlineDeleteIcons(body);
  body = applyTabNav(body, activeTab);
  body = applyPatientEditNav(body, { viewRoute });
  body = normalizeFigmaTypography(body);
  body = body.replace(/font-\['IBM_Plex_Sans:Regular'\]/g, "font-['Inter']");

  const usedVars = extractUsedVars(body, importMap);
  const output = `${buildImports(usedVars, importMap)}

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
    rawFile: "doctors-2-edit-13946.txt",
    innerName: "DoctorPatientDetailsEditPageInner",
    exportName: "DoctorPatientDetailsEditPage",
    outPath: path.join(ROOT, "src/pages/doctors/DoctorPatientDetailsEditPage.tsx"),
    activeTab: "personal",
    viewRoute: "/doctors/1",
    frameHeight: 1293,
  },
  {
    rawFile: "doctors-3-edit-12820.txt",
    innerName: "DoctorPatientMedicalAssessmentEditPageInner",
    exportName: "DoctorPatientMedicalAssessmentEditPage",
    outPath: path.join(ROOT, "src/pages/doctors/DoctorPatientMedicalAssessmentEditPage.tsx"),
    activeTab: "medical",
    viewRoute: "/doctors/1/medical-assessment",
    frameHeight: 2404,
  },
  {
    rawFile: "doctors-4-edit-13534.txt",
    innerName: "DoctorPatientTreatmentEditPageInner",
    exportName: "DoctorPatientTreatmentEditPage",
    outPath: path.join(ROOT, "src/pages/doctors/DoctorPatientTreatmentEditPage.tsx"),
    activeTab: "treatment",
    viewRoute: "/doctors/1/treatment",
    frameHeight: 1184,
  },
  {
    rawFile: "doctors-5-edit-13790.txt",
    innerName: "DoctorPatientBillingEditPageInner",
    exportName: "DoctorPatientBillingEditPage",
    outPath: path.join(ROOT, "src/pages/doctors/DoctorPatientBillingEditPage.tsx"),
    activeTab: "billing",
    viewRoute: "/doctors/1/billing",
    frameHeight: 1184,
  },
];

for (const page of pages) {
  generatePage(page);
}
