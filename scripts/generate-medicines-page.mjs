import path from "path";
import { fileURLToPath } from "url";
import { addToAfterLink, applyCommonNav, generatePage } from "./figma-page-gen.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const sidebarLinks = [
  ["I1:8504;509:17066", "/patients"],
  ["I1:8504;509:17067", "/doctors"],
  ["I1:8504;509:17068", "/sales"],
  ["I1:8504;509:17069", "/activity-log"],
  ["I1:8504;509:17070", "/treatments"],
  ["I1:8504;509:17071", "/billing"],
  ["I1:8504;509:17074", "/settings"],
  ["I1:8504;509:17078", "/appointments"],
  ["I1:8504;509:17081", "/dashboard"],
];

function applyNav(code) {
  let c = applyCommonNav(code, {
    chevronId: "1:8489",
    arrowExitId: "1:8500",
    breadcrumbLabel: "Medicines",
    sidebarLinks,
  });
  c = c.replace(
    /<a className="absolute block cursor-pointer inset-\[8\.4%_22\.22%_88\.48%_67\.5%\]" data-node-id="1:8505" data-name="Bounds">([\s\S]*?)<\/a>\s*<a className="\[word-break:break-word\] absolute block cursor-pointer font-\[[^\]]+\][^"]*" data-node-id="1:8506">([\s\S]*?)<\/a>\s*<a className="-translate-x-1\/2 -translate-y-1\/2 absolute block cursor-pointer h-\[14px\] left-\[calc\(50%\+276px\)\][^"]*" data-node-id="1:8507" data-name="Add">([\s\S]*?)<\/a>/,
    `<Link to="/medicines/add" className="absolute contents cursor-pointer left-[972px] top-[86px]" data-node-id="1:8505">
        <div className="absolute inset-[8.4%_22.22%_88.48%_67.5%]" data-node-id="1:8505" data-name="Bounds">$1</div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[0] left-[1010px] not-italic text-[14px] text-white top-[90px] whitespace-nowrap pointer-events-none" data-node-id="1:8506">$2</p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[14px] left-[calc(50%+276px)] top-[calc(50%-409px)] w-[16px] pointer-events-none" data-node-id="1:8507" data-name="Add">$3</div>
      </Link>`,
  );
  c = addToAfterLink(c, "1:8577", "/medicines/2");
  c = addToAfterLink(c, "1:8578", "/medicines/delete");
  return c;
}

generatePage({
  rootDir: __dirname,
  rawFile: "medicines-8484.txt",
  importMapPath: path.join(__dirname, ".medicines-import-map.json"),
  innerName: "MedicinesPageInner",
  exportName: "MedicinesPage",
  outPath: path.join(ROOT, "src/pages/medicines/MedicinesPage.tsx"),
  applyNav,
});
