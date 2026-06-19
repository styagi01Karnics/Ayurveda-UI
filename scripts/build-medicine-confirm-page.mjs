import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const addPath = path.join(__dirname, "../src/pages/medicines/AddMedicinePopupPage.tsx");
const outPath = path.join(__dirname, "../src/pages/medicines/AddMedicineConfirmPopupPage.tsx");

const src = fs.readFileSync(addPath, "utf8");

const innerStart = src.indexOf("function AddMedicinePopupPageInner()");
const innerEnd = src.indexOf("export default function AddMedicinePopupPage");

let imports = src.slice(0, innerStart);
imports = imports.replace(
  /import \{ AddMedicineFormModal \} from[^\n]+\n/,
  "",
);
imports = imports.replace(
  /import imgAdd from[^\n]+\n/,
  "",
);
imports = imports.replace(
  /import imgFrame1 from[^\n]+\n/,
  "",
);
imports = imports.replace(
  /import imgFrame2 from[^\n]+\n/,
  "",
);
imports = imports.replace(
  /import imgGroup3754 from[^\n]+\n/,
  "",
);
imports += 'import imgGroup2085663478 from "../../assets/medicines/medicine-added-success.svg";\n';

let inner = src.slice(innerStart, innerEnd);
inner = inner.replace("AddMedicinePopupPageInner", "AddMedicineConfirmPopupPageInner");
inner = inner.replace(
  'data-node-id="1:10762" data-name="Medicnes ( Add Medicine)"',
  'data-node-id="1:10919" data-name="Medicnes ( Add Medicine Confirmation Pop Up)"',
);

const confirmBlock = `
      <div className="absolute inset-0 z-[100]" data-name="add-medicine-confirm-layer">
      <Link to="/medicines" className="absolute inset-0 bg-[rgba(49,49,49,0.45)] block cursor-pointer" data-node-id="1:11011" aria-label="Close" />
      <div className="absolute inset-0 pointer-events-none" data-node-id="1:11012">
        <div className="absolute bg-white content-stretch flex flex-col gap-[8px] h-[258px] items-center justify-center left-[520px] px-[40px] rounded-[16px] top-[383px] w-[400px] pointer-events-auto shadow-[0_4px_24px_rgba(0,0,0,0.08)]" data-node-id="1:11013">
          <div className="relative shrink-0 size-[48px]" data-node-id="1:11014">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup2085663478} />
          </div>
          <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[normal] not-italic relative shrink-0 text-[18px] text-[#422c23] text-center whitespace-nowrap" data-node-id="1:11018">
            Medicine Added
          </p>
          <p className="[word-break:break-word] font-['Inter'] font-normal leading-[normal] max-w-[320px] not-italic relative shrink-0 text-[14px] text-[#737373] text-center" data-node-id="1:11019">
            The medicine has been successfully added to inventory
          </p>
        </div>
      </div>
      </div>`;

inner = inner.replace(
  /<div className="absolute inset-0 z-\[100\]" data-name="add-medicine-modal-layer">[\s\S]*?<\/div>\s*\n      <\/div>\s*\n(?=\s*<\/div>\s*\n  \);)/,
  `${confirmBlock}\n`,
);

const output = `${imports}${inner}
export default function AddMedicineConfirmPopupPage() {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[1024px] w-[1440px] shrink-0 overflow-visible">
        <AddMedicineConfirmPopupPageInner />
      </div>
    </div>
  );
}
`;

fs.writeFileSync(outPath, output);
console.log("Wrote", outPath);
