import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { normalizeFigmaTypography } from "./figma-normalize.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const step2Path = path.join(__dirname, "../src/pages/appointments/BookAppointmentStep2Page.tsx");
const outPath = path.join(__dirname, "../src/pages/appointments/ConfirmBookingPopupPage.tsx");

const src = fs.readFileSync(step2Path, "utf8");

const helpersStart = src.indexOf("type Frame2085664956Props");
const innerStart = src.indexOf("function BookAppointmentStep2PageInner()");
const innerEnd = src.lastIndexOf("export default function BookAppointmentStep2Page");

const helpers = src.slice(helpersStart, innerStart).replace(
  /function Frame2085664956\(\{ className, property1 = "Variant5" \}/,
  'function Frame2085664956({ className, property1: _property1 = "Variant5" }',
);

let inner = src.slice(innerStart, innerEnd);
inner = inner.replace("BookAppointmentStep2PageInner", "ConfirmBookingPopupPageInner");
inner = inner.replace(
  'data-node-id="1:7833" data-name="Create new Patient ( Therapy Details)"',
  'data-node-id="1:7435" data-name="Confirmation Pop Up appoinment Bookiing"',
);

const truncateAt = inner.indexOf('data-node-id="1:7942"');
if (truncateAt > 0) {
  inner = inner.slice(0, truncateAt);
  inner = inner.replace(/\s*<Link to="[^"]*" className="absolute bg-\[rgba\(49,49,49,0\.45\)\][^>]*$/s, "");
}

const confirmOverlay = `
      <Link to="/appointments" className="absolute bg-[rgba(49,49,49,0.45)] block cursor-pointer h-[1024px] left-[6px] top-0 w-[1440px]" data-node-id="1:7544" aria-label="Close" />
      <div className="-translate-y-1/2 absolute contents left-[526px] top-1/2" data-node-id="1:7545">
        <div className="absolute bg-white h-[258px] left-[526px] rounded-[16px] top-[383px] w-[400px]" data-node-id="1:7546" />
        <div className="absolute inset-[42.09%_47.92%_53.22%_48.75%]" data-node-id="1:7547">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup2085663478} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold inset-[49.12%_42.36%_48.73%_43.19%] leading-[normal] not-italic text-[18px] text-black text-center whitespace-nowrap" data-node-id="1:7551">
          Appointment confirmed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal inset-[52.83%_40.14%_43.85%_40.97%] leading-[normal] not-italic text-[14px] text-black text-center" data-node-id="1:7552">
          The appointment has been successfully scheduled for the patient
        </p>
      </div>
    </div>
  );
}
`;

inner = inner.trimEnd();
inner = inner.replace(
  /<Frame2085664956 className="absolute bg-white h-\[969px\] left-\[24px\][^/]*\/>\s*$/,
  (m) => `${m}${confirmOverlay}`,
);

const confirmImport = 'import imgGroup2085663478 from "../../assets/appointments/book/confirm-success.svg";\n';
const cleanedImports = src
  .slice(0, helpersStart)
  .replace(/import imgFrame1 from[^\n]+\n/g, "")
  .replace(/import imgFrame2 from[^\n]+\n/g, "")
  .replace(/import imgFrame3 from[^\n]+\n/g, "")
  .replace(/import imgFrame4 from[^\n]+\n/g, "")
  .replace(/import imgFrame5 from[^\n]+\n/g, "")
  .concat(confirmImport);

let output = `${cleanedImports}${helpers}
${inner}

export default function ConfirmBookingPopupPage() {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[1024px] w-[1440px] shrink-0 overflow-visible">
        <ConfirmBookingPopupPageInner />
      </div>
    </div>
  );
}
`;

const usedVars = new Set();
const re = /src=\{(\w+)\}/g;
let match;
while ((match = re.exec(output)) !== null) usedVars.add(match[1]);

output = output
  .split("\n")
  .filter((line) => {
    const importMatch = line.match(/^import (\w+) from/);
    if (!importMatch) return true;
    return usedVars.has(importMatch[1]);
  })
  .join("\n");

output = normalizeFigmaTypography(output);

fs.writeFileSync(outPath, output);
console.log("Built", outPath);
