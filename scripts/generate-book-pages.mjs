import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { normalizeFigmaTypography } from "./figma-normalize.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const AGENT = "C:/Users/DELL/.cursor/projects/e-Rabitron-Github-Ayurvedaa-Ayurveda-UI/agent-tools";
const importMap = JSON.parse(fs.readFileSync(path.join(__dirname, ".book-import-map.json"), "utf8"));

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

function toLinks(code) {
  return code;
}

function revertLinksWithoutTo(code) {
  return code.replace(/<Link ((?!to=)[^>]*?)>/g, "<a $1>");
}

function fixTsUnused(code) {
  return code
    .replace(
      /function Frame2085664956\(\{ className, property1 = "Variant5" \}/g,
      'function Frame2085664956({ className, property1: _property1 = "Variant5" }',
    )
    .replace(
      /function Delete\(\{ className, size = "16", theme = "Regular" \}/g,
      'function Delete({ className, size: _size = "16", theme: _theme = "Regular" }',
    );
}

function addToAfterLink(code, nodeId, to) {
  const re = new RegExp(`<a([^>]*data-node-id="${nodeId}"[^>]*)>([\\s\\S]*?)<\\/a>`, "g");
  return code.replace(re, `<Link to="${to}"$1>$2</Link>`);
}

function applyStep1Nav(code) {
  let c = code;
  c = c.replace(
    /<div className="absolute bg-\[rgba\(49,49,49,0\.45\)\] h-\[1363px\] left-0 top-px w-\[1440px\]" data-node-id="1:7662" \/>/,
    '<Link to="/appointments" className="absolute bg-[rgba(49,49,49,0.45)] block cursor-pointer h-[1363px] left-0 top-px w-[1440px]" data-node-id="1:7662" aria-label="Close" />',
  );
  c = addToAfterLink(c, "1:7832", "/appointments/create-patient/step-2");
  c = addToAfterLink(c, "1:7669", "/appointments/create-patient/step-2");
  c = addToAfterLink(c, "1:7670", "/appointments/create-patient/step-3");
  c = c.replace(
    /<span className="\[text-decoration-skip-ink:none\] \[text-underline-position:from-font\] decoration-from-font decoration-solid font-\['Inter:Semi_Bold'\] font-semibold leading-\[normal\] text-\[#be880b\] underline">Claim Offer<\/span>/g,
    '<Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-[\'Inter:Semi_Bold\'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>',
  );
  return revertLinksWithoutTo(c);
}

function applyStep2Nav(code) {
  let c = code;
  c = c.replace(
    /<div className="absolute bg-\[rgba\(49,49,49,0\.45\)\] h-\[1363px\] left-0 top-px w-\[1440px\]" data-node-id="1:7942" \/>/,
    '<Link to="/appointments/create-patient" className="absolute bg-[rgba(49,49,49,0.45)] block cursor-pointer h-[1363px] left-0 top-px w-[1440px]" data-node-id="1:7942" aria-label="Close" />',
  );
  c = addToAfterLink(c, "1:7946", "/appointments/create-patient");
  c = addToAfterLink(c, "1:7947", "/appointments/create-patient");
  c = addToAfterLink(c, "1:7989", "/appointments/create-patient/step-3");
  c = c.replace(
    /<span className="\[text-decoration-skip-ink:none\] \[text-underline-position:from-font\] decoration-from-font decoration-solid font-\['Inter:Semi_Bold'\] font-semibold leading-\[normal\] text-\[#be880b\] underline">Claim Offer<\/span>/g,
    '<Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-[\'Inter:Semi_Bold\'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>',
  );
  return revertLinksWithoutTo(c);
}

function applyStep3Nav(code) {
  let c = code;
  c = c.replace(
    /<div className="absolute bg-\[rgba\(49,49,49,0\.45\)\] h-\[2463px\] left-0 top-px w-\[1440px\]" data-node-id="1:8135" \/>/,
    '<Link to="/appointments/create-patient/step-2" className="absolute bg-[rgba(49,49,49,0.45)] block cursor-pointer h-[2463px] left-0 top-px w-[1440px]" data-node-id="1:8135" aria-label="Close" />',
  );
  c = addToAfterLink(c, "1:8139", "/appointments/create-patient");
  c = addToAfterLink(c, "1:8140", "/appointments/create-patient");
  c = addToAfterLink(c, "1:8142", "/appointments/create-patient/step-2");
  c = addToAfterLink(c, "1:8144", "/appointments/create-patient/step-2");
  c = c.replace(
    /function Button\(\{ className \}: \{ className\?: string \}\) \{[\s\S]*?\n\}/,
    `function Button({ className }: { className?: string }) {
  return (
    <Link to="/appointments/confirm-booking" className={className || "content-stretch flex items-start relative"} data-node-id="1:2084" data-name="Button">
      <div className="bg-[#be880b] content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[6px] py-[8px] relative rounded-[8px] shrink-0 w-[271px]" data-node-id="1:2085" data-name="Button">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[color:var(--color/grey/0,white)] tracking-[0.56px] whitespace-nowrap" data-node-id="I1:2085;208:17867">
          <p className="leading-none">Confirm</p>
        </div>
      </div>
    </Link>
  );
}`,
  );
  c = c.replace(
    /<span className="\[text-decoration-skip-ink:none\] \[text-underline-position:from-font\] decoration-from-font decoration-solid font-\['Inter:Semi_Bold'\] font-semibold leading-\[normal\] text-\[#be880b\] underline">Claim Offer<\/span>/g,
    '<Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-[\'Inter:Semi_Bold\'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>',
  );
  return revertLinksWithoutTo(c);
}

function applyConfirmNav(code) {
  let c = code;
  c = c.replace(
    /<div className="absolute bg-\[rgba\(49,49,49,0\.45\)\] h-\[1024px\] left-\[6px\] top-0 w-\[1440px\]" data-node-id="1:7544" \/>/,
    '<Link to="/appointments" className="absolute bg-[rgba(49,49,49,0.45)] block cursor-pointer h-[1024px] left-[6px] top-0 w-[1440px]" data-node-id="1:7544" aria-label="Close" />',
  );
  c = c.replace(
    /<span className="\[text-decoration-skip-ink:none\] \[text-underline-position:from-font\] decoration-from-font decoration-solid font-\['Inter:Semi_Bold'\] font-semibold leading-\[normal\] text-\[#be880b\] underline">Claim Offer<\/span>/g,
    '<Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-[\'Inter:Semi_Bold\'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>',
  );
  return revertLinksWithoutTo(c);
}

function buildPage({ figmaFile, componentName, height, navFn, startMarker }) {
  let raw = fs.readFileSync(path.join(AGENT, figmaFile), "utf8");
  // trim MCP footer
  const footerIdx = raw.indexOf("SUPER CRITICAL:");
  if (footerIdx >= 0) raw = raw.slice(0, footerIdx);

  let body = raw;
  if (startMarker) {
    const idx = raw.indexOf(startMarker);
    if (idx >= 0) body = raw.slice(idx);
  }

  const usedVars = extractUsedVars(body);
  body = stripAssetConsts(body);
  body = toLinks(body);
  body = navFn(body);
  body = fixTsUnused(body);
  body = normalizeFigmaTypography(body);
  body = body.replace(/export default function \w+\(\)/, `function ${componentName}Inner()`);

  const wrapped = `${buildImports(usedVars)}

${body}

export default function ${componentName}() {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[${height}px] w-[1440px] shrink-0 overflow-visible">
        <${componentName}Inner />
      </div>
    </div>
  );
}
`;

  const out = path.join(ROOT, "src/pages/appointments", `${componentName}.tsx`);
  fs.writeFileSync(out, wrapped);
  console.log("Wrote", out, "vars:", usedVars.length);
}

buildPage({
  figmaFile: "d22881b8-ef4f-4aed-9403-099823fc0d83.txt",
  componentName: "BookAppointmentStep1Page",
  height: 1327,
  navFn: applyStep1Nav,
  startMarker: "type Frame2085664956Props",
});

buildPage({
  figmaFile: "afc521c8-3710-469c-a5c8-58881a61028a.txt",
  componentName: "BookAppointmentStep2Page",
  height: 1327,
  navFn: applyStep2Nav,
  startMarker: "type Frame2085664956Props",
});

buildPage({
  figmaFile: "86d44e4a-6e2c-4f5f-b71e-de1bdd2b6cb1.txt",
  componentName: "BookAppointmentStep3Page",
  height: 2345,
  navFn: applyStep3Nav,
  startMarker: "function Button",
});

