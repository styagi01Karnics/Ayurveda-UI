import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { normalizeFigmaTypography } from "./figma-normalize.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const importMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".create-prescription-import-map.json"), "utf8"),
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
  c = addToAfterLink(c, "1:12208", "/dashboard/profile-dropdown");
  c = addToAfterLink(c, "1:12219", "/dashboard/logout-popup");
  c = addToAfterLink(c, "1:12222", "/doctors/1");
  c = addToAfterLink(c, "1:12223", "/doctors/1");
  c = addToAfterLink(c, "1:12298", "/doctors/prescription/download");
  c = c.replace(
    /<span className="\[text-decoration-skip-ink:none\] \[text-underline-position:from-font\] decoration-from-font decoration-solid font-\['Inter:Semi_Bold'\] font-semibold leading-\[normal\] text-\[#be880b\] underline">Claim Offer<\/span>/g,
    '<Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-[\'Inter\'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>',
  );
  c = c.replace(
    /<div className="absolute contents left-\[939px\] top-\[86px\]" data-node-id="1:12229">([\s\S]*?)<\/div>\s*<div className="absolute content-stretch flex gap-\[8px\] items-center left-\[321px\] top-\[93px\]" data-node-id="1:12233"/,
    `<Link to="/appointments/create-patient" className="absolute contents cursor-pointer left-[939px] top-[86px]" data-node-id="1:12229">$1</Link>
      <div className="absolute content-stretch flex gap-[8px] items-center left-[321px] top-[93px]" data-node-id="1:12233"`,
  );
  c = c.replace(
    /<a className="content-stretch cursor-pointer flex items-center px-px relative shrink-0" data-node-id="I1:12233;2704:192615;70:24394" data-name="Link">([\s\S]*?)<\/a>/,
    `<Link to="/doctors" className="content-stretch cursor-pointer flex items-center px-px relative shrink-0" data-node-id="I1:12233;2704:192615;70:24394" data-name="Link">$1</Link>`,
  );
  c = c.replace(
    /<p className="\[word-break:break-word\] font-\['Inter:Medium'\] font-medium leading-\[18px\] not-italic relative shrink-0 text-\[#83899a\] text-\[14px\] text-left tracking-\[0\.16px\] whitespace-nowrap" data-node-id="I1:12233;2704:192615;70:24394;0:7611">\s*Breadcrumb 1\s*<\/p>/,
    '<p className="[word-break:break-word] font-[\'Inter\'] font-medium leading-[18px] not-italic relative shrink-0 text-[#83899a] text-[14px] text-left tracking-[0.16px] whitespace-nowrap" data-node-id="I1:12233;2704:192615;70:24394;0:7611">Doctors</p>',
  );
  c = c.replace(
    /<a className="content-stretch cursor-pointer flex gap-\[8px\] items-end relative shrink-0" data-node-id="I1:12233;2704:192617" data-name="item 3">([\s\S]*?)<\/a>/,
    `<Link to="/doctors/1" className="content-stretch cursor-pointer flex gap-[8px] items-end relative shrink-0" data-node-id="I1:12233;2704:192617" data-name="item 3">$1</Link>`,
  );
  c = c.replace(
    /<p className="\[word-break:break-word\] font-\['Inter:Medium'\] font-medium leading-\[18px\] not-italic relative shrink-0 text-\[#83899a\] text-\[14px\] text-left tracking-\[0\.16px\] whitespace-nowrap" data-node-id="I1:12233;2704:192617;70:24394;0:7611">\s*Breadcrumb 1\s*<\/p>/,
    '<p className="[word-break:break-word] font-[\'Inter\'] font-medium leading-[18px] not-italic relative shrink-0 text-[#83899a] text-[14px] text-left tracking-[0.16px] whitespace-nowrap" data-node-id="I1:12233;2704:192617;70:24394;0:7611">Patient Details</p>',
  );
  const sidebarLinks = [
    ["I1:12221;509:17147", "/patients"],
    ["I1:12221;509:17148", "/sales"],
    ["I1:12221;509:17150", "/treatments"],
    ["I1:12221;509:17151", "/billing"],
    ["I1:12221;509:17152", "/medicines"],
    ["I1:12221;509:17153", "/settings"],
    ["I1:12221;509:17157", "/appointments"],
    ["I1:12221;509:17160", "/dashboard"],
  ];
  for (const [id, to] of sidebarLinks) {
    c = addToAfterLink(c, id, to);
  }
  c = c.replace(
    /<p className="\[word-break:break-word\] absolute font-\['Inter:Medium'\] font-medium leading-\[normal\] left-\[74px\] not-italic text-\[#422c23\] text-\[16px\] top-\[641px\] whitespace-nowrap" data-node-id="I1:12221;509:17149">\s*Activity Logs\s*<\/p>/,
    '<Link to="/activity-log" className="[word-break:break-word] absolute block cursor-pointer font-[\'Inter\'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[641px] whitespace-nowrap" data-node-id="I1:12221;509:17149">Activity Logs</Link>',
  );
  return c;
}

let raw = fs.readFileSync(path.join(__dirname, "doctors-prescription-12203.txt"), "utf8");
const footerIdx = raw.indexOf("SUPER CRITICAL:");
if (footerIdx >= 0) raw = raw.slice(0, footerIdx);

let body = raw.replace(/export default function \w+\(\)/, "function CreatePrescriptionPageInner()");
body = stripAssetConsts(body);
body = applyNav(body);
body = normalizeFigmaTypography(body);
body = body.replace(/font-\['IBM_Plex_Sans:Regular'\]/g, "font-['Inter']");

const usedVars = extractUsedVars(body);
const output = `${buildImports(usedVars)}

${body}

export default function CreatePrescriptionPage() {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[1401px] w-[1440px] shrink-0 overflow-visible">
        <CreatePrescriptionPageInner />
      </div>
    </div>
  );
}
`;

const out = path.join(ROOT, "src/pages/doctors/CreatePrescriptionPage.tsx");
fs.writeFileSync(out, output);
console.log("Wrote", out, "vars:", usedVars.length);
