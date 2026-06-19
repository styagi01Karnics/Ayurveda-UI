import fs from "fs";
import path from "path";
import { normalizeFigmaTypography } from "./figma-normalize.mjs";

export function stripAssetConsts(code) {
  return code.replace(/^const img\w+ = "https:[^"]+";\r?\n/gm, "");
}

const SKIP_DATA_NAMES = new Set([
  "Shape",
  "item 1",
  "Link",
  "Breadcrumb Group",
  "Medicnes 1",
  "Sales",
  "Activity Log",
]);

function toImgVar(dataName) {
  const cleaned = dataName.replace(/\([^)]*\)/g, "").trim();
  const parts = cleaned.split(/[\s_-]+/).filter(Boolean);
  const cased = parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
  return `img${cased}`;
}

function nextSemanticVar(dataName, counts) {
  const base = toImgVar(dataName);
  const index = counts[base] ?? 0;
  counts[base] = index + 1;
  return index === 0 ? base : `${base}${index}`;
}

/** Map legacy imgShape* exports to semantic imgChevron-style names via data-name. */
export function renameShapeAssets(code) {
  const counts = {};
  const varMap = new Map();
  const usageRe = /src=\{(imgShape\d*)\}/g;
  let match;

  while ((match = usageRe.exec(code)) !== null) {
    const shapeVar = match[1];
    if (varMap.has(shapeVar)) continue;

    const before = code.slice(Math.max(0, match.index - 2000), match.index);
    const names = [...before.matchAll(/data-name="([^"]+)"/g)].map((m) => m[1]);
    let semantic = null;
    for (let i = names.length - 1; i >= 0; i -= 1) {
      if (!SKIP_DATA_NAMES.has(names[i])) {
        semantic = names[i];
        break;
      }
    }
    if (!semantic) continue;
    varMap.set(shapeVar, nextSemanticVar(semantic, counts));
  }

  let result = code;
  for (const [oldVar, newVar] of varMap) {
    result = result.replace(new RegExp(`\\b${oldVar}\\b`, "g"), newVar);
  }
  return result;
}

export function extractUsedVars(code, importMap) {
  const vars = new Set();
  const re = /src=\{(\w+)\}/g;
  let m;
  while ((m = re.exec(code)) !== null) vars.add(m[1]);
  return [...vars].filter((v) => importMap[v]);
}

export function buildImports(usedVars, importMap) {
  const lines = ['import { Link } from "react-router-dom";'];
  for (const v of usedVars.sort()) {
    lines.push(`import ${v} from "${importMap[v]}";`);
  }
  return lines.join("\n");
}

export function addToAfterLink(code, nodeId, to) {
  const re = new RegExp(`<a([^>]*data-node-id="${nodeId}"[^>]*)>([\\s\\S]*?)<\\/a>`, "g");
  return code.replace(re, `<Link to="${to}"$1>$2</Link>`);
}

export function applyCommonNav(code, { chevronId, arrowExitId, breadcrumbLabel, sidebarLinks = [] }) {
  let c = code;
  if (chevronId) {
    c = addToAfterLink(c, chevronId, "/dashboard/profile-dropdown");
  }
  if (arrowExitId) {
    c = addToAfterLink(c, arrowExitId, "/dashboard/logout-popup");
  }
  c = c.replace(
    /<span className="\[text-decoration-skip-ink:none\] \[text-underline-position:from-font\] decoration-from-font decoration-solid font-\['Inter:Semi_Bold'\] font-semibold leading-\[normal\] text-\[#be880b\] underline">Claim Offer<\/span>/g,
    '<Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-[\'Inter\'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>',
  );
  if (breadcrumbLabel) {
    c = c.replace(
      /<p className="\[word-break:break-word\] font-\['Inter:Medium'\] font-medium leading-\[18px\] not-italic relative shrink-0 text-\[#422c23\] text-\[14px\] tracking-\[0\.16px\] whitespace-nowrap" data-node-id="I1:\d+;70:24394;0:7611">\s*Breadcrumb 1\s*<\/p>/,
      `<p className="[word-break:break-word] font-['Inter'] font-medium leading-[18px] not-italic relative shrink-0 text-[#422c23] text-[14px] tracking-[0.16px] whitespace-nowrap" data-node-id="I1:8419;70:24394;0:7611">${breadcrumbLabel}</p>`,
    );
    c = c.replace(/Breadcrumb 1/g, breadcrumbLabel);
  }
  for (const [id, to] of sidebarLinks) {
    c = addToAfterLink(c, id, to);
  }
  return c;
}

export function generatePage({
  rootDir,
  rawFile,
  importMapPath,
  innerName,
  exportName,
  outPath,
  applyNav,
  extraExports = "",
  frameHeight = 1024,
  exportProps = "",
  exportBody = "",
}) {
  const importMap = JSON.parse(fs.readFileSync(importMapPath, "utf8"));
  let raw = fs.readFileSync(path.join(rootDir, rawFile), "utf8");
  const footerIdx = raw.indexOf("SUPER CRITICAL:");
  if (footerIdx >= 0) raw = raw.slice(0, footerIdx);

  let body = raw.replace(/export default function \w+\(\)/, `function ${innerName}()`);
  body = renameShapeAssets(body);
  body = stripAssetConsts(body);
  body = applyNav(body);
  body = normalizeFigmaTypography(body);

  const usedVars = extractUsedVars(body, importMap);
  const output = `${buildImports(usedVars, importMap)}

${body}

export default function ${exportName}(${exportProps}) {
  ${exportBody}
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[${frameHeight}px] w-[1440px] shrink-0 overflow-visible">
        <${innerName} />
      </div>
    </div>
  );
}
${extraExports}`;

  fs.writeFileSync(outPath, output);
  console.log("Wrote", outPath, "vars:", usedVars.length);
}
