import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { normalizeFigmaTypography } from "./figma-normalize.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const importMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".treatments-import-map.json"), "utf8"),
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
    /<a className="-translate-x-1\/2 -translate-y-1\/2 absolute block cursor-pointer left-\[calc\(50%\+624px\)\] size-\[16px\] top-\[calc\(50%-410px\)\]" data-node-id="1:8405" data-name="Chevron">([\s\S]*?)<\/a>/,
    `<Link to="/dashboard/profile-dropdown" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+624px)] size-[16px] top-[calc(50%-410px)]" data-node-id="1:8405" data-name="Chevron">$1</Link>`,
  );
  c = c.replace(
    /<a className="-translate-x-1\/2 -translate-y-1\/2 absolute block cursor-pointer left-\[calc\(50%\+680px\)\] size-\[20px\] top-\[calc\(50%-410px\)\]" data-node-id="1:8416" data-name="Arrow Exit">([\s\S]*?)<\/a>/,
    `<Link to="/dashboard/logout-popup" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+680px)] size-[20px] top-[calc(50%-410px)]" data-node-id="1:8416" data-name="Arrow Exit">$1</Link>`,
  );
  c = addToAfterLink(c, "1:8405", "/dashboard/profile-dropdown");
  c = addToAfterLink(c, "1:8416", "/dashboard/logout-popup");
  c = addToAfterLink(c, "1:8470", "/treatments/2");
  c = c.replace(
    /<span className="\[text-decoration-skip-ink:none\] \[text-underline-position:from-font\] decoration-from-font decoration-solid font-\['Inter:Semi_Bold'\] font-semibold leading-\[normal\] text-\[#be880b\] underline">Claim Offer<\/span>/g,
    '<Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-[\'Inter\'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>',
  );
  c = c.replace(
    /<p className="\[word-break:break-word\] font-\['Inter:Medium'\] font-medium leading-\[18px\] not-italic relative shrink-0 text-\[#422c23\] text-\[14px\] tracking-\[0\.16px\] whitespace-nowrap" data-node-id="I1:8419;70:24394;0:7611">\s*Breadcrumb 1\s*<\/p>/,
    '<p className="[word-break:break-word] font-[\'Inter\'] font-medium leading-[18px] not-italic relative shrink-0 text-[#422c23] text-[14px] tracking-[0.16px] whitespace-nowrap" data-node-id="I1:8419;70:24394;0:7611">Treatments</p>',
  );
  const sidebarLinks = [
    ["I1:8420;509:17093", "/patients"],
    ["I1:8420;509:17094", "/doctors"],
    ["I1:8420;509:17095", "/sales"],
    ["I1:8420;509:17096", "/activity-log"],
    ["I1:8420;509:17099", "/billing"],
    ["I1:8420;509:17100", "/medicines"],
    ["I1:8420;509:17101", "/settings"],
    ["I1:8420;509:17106", "/appointments"],
    ["I1:8420;509:17109", "/dashboard"],
  ];
  for (const [id, to] of sidebarLinks) {
    c = addToAfterLink(c, id, to);
  }
  return c;
}

let raw = fs.readFileSync(path.join(__dirname, "treatments-8400.txt"), "utf8");
const footerIdx = raw.indexOf("SUPER CRITICAL:");
if (footerIdx >= 0) raw = raw.slice(0, footerIdx);

let body = raw.replace(/export default function \w+\(\)/, "function TreatmentsPageInner()");
body = stripAssetConsts(body);
body = applyNav(body);
body = normalizeFigmaTypography(body);

const usedVars = extractUsedVars(body);
const detailStub = `
export function TreatmentDetailPage({ variant = 2 }: { variant?: number }) {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative flex h-[1024px] w-[1440px] shrink-0 items-center justify-center">
        <p className="text-[#422c23]">Treatment detail variant {variant} — coming soon</p>
        <Link to="/treatments" className="absolute left-[321px] top-[93px] text-[14px] text-[#be880b] underline">
          Back to Treatments
        </Link>
      </div>
    </div>
  );
}
`;

const output = `${buildImports(usedVars)}

${body}

export default function TreatmentsPage() {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[1024px] w-[1440px] shrink-0 overflow-visible">
        <TreatmentsPageInner />
      </div>
    </div>
  );
}
${detailStub}`;

const out = path.join(ROOT, "src/pages/treatments/TreatmentsPage.tsx");
fs.writeFileSync(out, output);
console.log("Wrote", out, "vars:", usedVars.length);
