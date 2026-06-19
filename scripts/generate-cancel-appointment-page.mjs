import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { normalizeFigmaTypography } from "./figma-normalize.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const importMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".cancel-appointment-import-map.json"), "utf8"),
);

function stripAssetConsts(code) {
  return code.replace(/^const img\w+ = "https:[^"]+";\n/gm, "");
}

function extractUsedVars(code) {
  const vars = new Set();
  const re = /src=\{(\w+)\}/g;
  let m;
  while ((m = re.exec(code)) !== null) vars.add(m[1]);
  return [...vars].filter((v) => importMap[v]);
}

function buildImports(usedVars) {
  const lines = ['import { Link } from "react-router-dom";'];
  for (const v of usedVars.sort()) {
    lines.push(`import ${v} from "${importMap[v]}";`);
  }
  return lines.join("\n");
}

function addToAfterLink(code, nodeId, to) {
  const re = new RegExp(`<a([^>]*data-node-id="${nodeId}"[^>]*)>([\\s\\S]*?)<\\/a>`, "g");
  return code.replace(re, `<Link to="${to}"$1>$2</Link>`);
}

function applyNav(code) {
  let c = code;
  c = c.replace(
    /<div className="-translate-x-1\/2 -translate-y-1\/2 absolute left-\[calc\(50%\+624px\)\] size-\[16px\] top-\[calc\(50%-410px\)\]" data-node-id="1:6954" data-name="Chevron">([\s\S]*?)<\/div>/,
    `<Link to="/dashboard/profile-dropdown" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+624px)] size-[16px] top-[calc(50%-410px)]" data-node-id="1:6954" data-name="Chevron">$1</Link>`,
  );
  c = c.replace(
    /<div className="-translate-x-1\/2 -translate-y-1\/2 absolute left-\[calc\(50%\+680px\)\] size-\[20px\] top-\[calc\(50%-410px\)\]" data-node-id="1:6965" data-name="Arrow Exit">([\s\S]*?)<\/div>/,
    `<Link to="/dashboard/logout-popup" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+680px)] size-[20px] top-[calc(50%-410px)]" data-node-id="1:6965" data-name="Arrow Exit">$1</Link>`,
  );
  c = addToAfterLink(c, "1:6954", "/dashboard/profile-dropdown");
  c = addToAfterLink(c, "1:6965", "/dashboard/logout-popup");
  c = addToAfterLink(c, "1:7084", "/doctors");
  c = addToAfterLink(c, "1:7086", "/doctors");
  c = c.replace(
    /<span className="\[text-decoration-skip-ink:none\] \[text-underline-position:from-font\] decoration-from-font decoration-solid font-\['Inter:Semi_Bold'\] font-semibold leading-\[normal\] text-\[#be880b\] underline">Claim Offer<\/span>/g,
    '<Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-[\'Inter\'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>',
  );
  c = c.replace(
    /<div className="absolute contents left-\[939px\] top-\[86px\]" data-node-id="1:7009">([\s\S]*?)<\/div>\s*<div className="absolute bg-white h-\[969px\] left-\[24px\]/,
    `<Link to="/appointments/create-patient" className="absolute contents cursor-pointer left-[939px] top-[86px]" data-node-id="1:7009">$1</Link>
      <div className="absolute bg-white h-[969px] left-[24px]`,
  );
  c = c.replace(
    /<p className="\[word-break:break-word\] font-\['Inter:Medium'\] font-medium leading-\[18px\] not-italic relative shrink-0 text-\[#422c23\] text-\[14px\] tracking-\[0\.16px\] whitespace-nowrap" data-node-id="I1:6968;70:24394;0:7611">\s*Breadcrumb 1\s*<\/p>/,
    '<p className="[word-break:break-word] font-[\'Inter\'] font-medium leading-[18px] not-italic relative shrink-0 text-[#422c23] text-[14px] tracking-[0.16px] whitespace-nowrap" data-node-id="I1:6968;70:24394;0:7611">Doctors</p>',
  );
  c = c.replace(
    /<div className="absolute content-stretch flex items-center justify-center overflow-clip p-\[10px\] right-\[16px\] rounded-\[8px\] top-\[16px\]" data-node-id="1:7076" data-name="Button close X">([\s\S]*?)<\/div>\s*<\/div>\s*<div className="content-stretch flex flex-col h-\[175px\]/,
    `<Link to="/doctors" className="absolute content-stretch flex items-center justify-center overflow-clip p-[10px] right-[16px] rounded-[8px] top-[16px] cursor-pointer" data-node-id="1:7076" data-name="Button close X">$1</Link>
          </div>
        <div className="content-stretch flex flex-col h-[175px]`,
  );
  const sidebarItems = [
    ["I1:7013;509:17147", "/patients", "257px", "Patients"],
    ["I1:7013;509:17148", "/sales", "577px", "Sales"],
    ["I1:7013;509:17149", "/activity-log", "641px", "Activity Logs"],
    ["I1:7013;509:17150", "/treatments", "448px", "Treatments"],
    ["I1:7013;509:17151", "/billing", "705px", "Billing"],
    ["I1:7013;509:17152", "/medicines", "513px", "Medicines"],
    ["I1:7013;509:17153", "/settings", "769px", "Settings"],
    ["I1:7013;509:17157", "/appointments", "385px", "Appointments"],
    ["I1:7013;509:17160", "/dashboard", "193px", "Dashboard"],
  ];
  for (const [id, to, top, label] of sidebarItems) {
    c = c.replace(
      new RegExp(
        `<p className="\\[word-break:break-word\\] absolute font-\\['Inter:Medium'\\] font-medium leading-\\[normal\\] left-\\[74px\\] not-italic text-\\[#422c23\\] text-\\[16px\\] top-\\[${top.replace("px", "")}px\\] whitespace-nowrap" data-node-id="${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}">\\s*${label}\\s*<\\/p>`,
      ),
      `<Link to="${to}" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[${top}] whitespace-nowrap" data-node-id="${id}"><p className="leading-[normal]">${label}</p></Link>`,
    );
  }
  return c;
}

let raw = fs.readFileSync(path.join(__dirname, "cancel-appointment-6949.txt"), "utf8");
const footerIdx = raw.indexOf("SUPER CRITICAL:");
if (footerIdx >= 0) raw = raw.slice(0, footerIdx);

let body = raw.replace(/export default function \w+\(\)/, "function CancelAppointmentPopupInner()");
body = stripAssetConsts(body);
body = applyNav(body);
body = normalizeFigmaTypography(body);

const usedVars = extractUsedVars(body);
const output = `${buildImports(usedVars)}

${body}

export default function CancelAppointmentPopupPage() {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[1024px] w-[1440px] shrink-0 overflow-visible">
        <CancelAppointmentPopupInner />
      </div>
    </div>
  );
}

export { CancelAppointmentPopupPage as CancelAppointmentPopup };
`;

const out = path.join(ROOT, "src/pages/doctors/CancelAppointmentPopupPage.tsx");
fs.writeFileSync(out, output);
console.log("Wrote", out, "vars:", usedVars.length);
