import path from "path";
import { fileURLToPath } from "url";
import { addToAfterLink, applyCommonNav, generatePage } from "./figma-page-gen.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const sidebarLinks = [
  ["I1:8869;509:16985", "/patients"],
  ["I1:8869;509:16986", "/doctors"],
  ["I1:8869;509:16987", "/sales"],
  ["I1:8869;509:16988", "/activity-log"],
  ["I1:8869;509:16989", "/treatments"],
  ["I1:8869;509:16992", "/medicines"],
  ["I1:8869;509:16993", "/settings"],
  ["I1:8869;509:16998", "/appointments"],
  ["I1:8869;509:17001", "/dashboard"],
];

function applyNav(code) {
  let c = applyCommonNav(code, {
    chevronId: "1:8854",
    arrowExitId: "1:8865",
    breadcrumbLabel: "Billing",
    sidebarLinks,
  });
  c = c.replace(
    /<a className="absolute block cursor-pointer inset-\[8\.4%_22\.22%_88\.48%_66\.04%\]" data-node-id="1:8934" data-name="Bounds">([\s\S]*?)<\/a>\s*<p className="(\[[^\]]+\][^"]*)" data-node-id="1:8935">([\s\S]*?)<\/p>\s*<div className="(-translate-x-1\/2 -translate-y-1\/2 absolute h-\[14px\][^"]+)" data-node-id="1:8936" data-name="Add">([\s\S]*?)<\/div>/,
    `<Link to="/billing/service" className="absolute contents cursor-pointer left-[951px] top-[86px]" data-node-id="1:8934">
        <div className="absolute inset-[8.4%_22.22%_88.48%_66.04%]" data-node-id="1:8934" data-name="Bounds">$1</div>
        <p className="$2 pointer-events-none" data-node-id="1:8935">$3</p>
        <div className="$4 pointer-events-none" data-node-id="1:8936" data-name="Add">$5</div>
      </Link>`,
  );
  c = addToAfterLink(c, "1:8932", "/billing/invoice");
  c = addToAfterLink(c, "1:8933", "/billing/invoice");
  return c;
}

const billingFlowStub = `
export function BillingFlowPage({ step }: { step: "service" | "medicine" | "therapy" | "summary" | "final" | "popup" | "invoice" }) {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative flex h-[1024px] w-[1440px] shrink-0 items-center justify-center">
        <p className="text-[#422c23]">Billing — {step} (coming soon)</p>
        <Link to="/billing" className="absolute left-[321px] top-[93px] text-[14px] text-[#be880b] underline">
          Back to Billing
        </Link>
      </div>
    </div>
  );
}
`;

generatePage({
  rootDir: __dirname,
  rawFile: "billing-8849.txt",
  importMapPath: path.join(__dirname, ".billing-import-map.json"),
  innerName: "BillingPageInner",
  exportName: "BillingPage",
  outPath: path.join(ROOT, "src/pages/billing/BillingPage.tsx"),
  applyNav,
  extraExports: billingFlowStub,
});
