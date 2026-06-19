import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { normalizeFigmaTypography } from "./figma-normalize.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const AGENT = __dirname;
const importMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".follow-ups-import-map.json"), "utf8"),
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
  c = addToAfterLink(c, "1:11136", "/dashboard/profile-dropdown");
  c = addToAfterLink(c, "1:11147", "/dashboard/logout-popup");
  c = addToAfterLink(c, "1:11151", "/appointments/follow-up");
  c = addToAfterLink(c, "1:11168", "/appointments");
  c = c.replace(
    /<span className="\[text-decoration-skip-ink:none\] \[text-underline-position:from-font\] decoration-from-font decoration-solid font-\['Inter:Semi_Bold'\] font-semibold leading-\[normal\] text-\[#be880b\] underline">Claim Offer<\/span>/g,
    '<Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-[\'Inter\'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>',
  );
  c = c.replace(
    /<a className="absolute contents cursor-pointer left-\[991px\] top-\[24px\]" data-node-id="1:11182">([\s\S]*?)<\/a>/,
    `<div className="absolute contents left-[991px] top-[24px]" data-node-id="1:11182">$1</div>`,
  );
  c = c.replace(
    /<div className="-translate-x-1\/2 -translate-y-1\/2 absolute left-\[calc\(50%\+503\.5px\)\] size-\[20px\] top-\[calc\(50%-306px\)\]" data-node-id="1:11186" data-name="Calendar">\s*<img alt="" className="absolute block inset-0 max-w-none size-full" src=\{imgCalendar1\} \/>\s*<\/div>/,
    '<Link to="/appointments/calendar" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+503.5px)] size-[20px] top-[calc(50%-306px)]" data-node-id="1:11186" data-name="Calendar"><img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCalendar1} /></Link>',
  );
  const sidebarLinks = [
    ["I1:11236;509:17120", "/patients"],
    ["I1:11236;509:17121", "/doctors"],
    ["I1:11236;509:17122", "/sales"],
    ["I1:11236;509:17123", "/activity-log"],
    ["I1:11236;509:17124", "/treatments"],
    ["I1:11236;509:17125", "/billing"],
    ["I1:11236;509:17126", "/medicines"],
    ["I1:11236;509:17127", "/settings"],
    ["I1:11236;509:17136", "/dashboard"],
  ];
  for (const [id, to] of sidebarLinks) {
    c = addToAfterLink(c, id, to);
  }
  return c;
}

let raw = fs.readFileSync(path.join(AGENT, "follow-ups-11131.txt"), "utf8");
const footerIdx = raw.indexOf("SUPER CRITICAL:");
if (footerIdx >= 0) raw = raw.slice(0, footerIdx);

let body = raw.replace(/export default function \w+\(\)/, "function AppointmentsFollowUpsPageInner()");
body = stripAssetConsts(body);
body = applyNav(body);
body = normalizeFigmaTypography(body);

const usedVars = extractUsedVars(body);
const output = `${buildImports(usedVars)}

${body}

export default function AppointmentsFollowUpsPage() {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[1024px] w-[1440px] shrink-0 overflow-visible">
        <AppointmentsFollowUpsPageInner />
      </div>
    </div>
  );
}
`;

const out = path.join(ROOT, "src/pages/appointments/AppointmentsFollowUpsPage.tsx");
fs.writeFileSync(out, output);
console.log("Wrote", out, "vars:", usedVars.length);
