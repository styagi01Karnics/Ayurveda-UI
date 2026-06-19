import path from "path";
import { fileURLToPath } from "url";
import { generatePage } from "./figma-page-gen.mjs";
import { applyBillingFlowNav } from "./billing-flow-nav.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function applyNav(code) {
  return applyBillingFlowNav(code, {
    chevronId: "1:9920",
    arrowExitId: "1:9931",
    breadcrumbLinkId: "I1:9935;2704:192646;70:24394",
    sidebarLinks: [
      ["I1:9934;509:16985", "/patients"],
      ["I1:9934;509:16986", "/doctors"],
      ["I1:9934;509:16987", "/sales"],
      ["I1:9934;509:16988", "/activity-log"],
      ["I1:9934;509:16989", "/treatments"],
      ["I1:9934;509:16992", "/medicines"],
      ["I1:9934;509:16993", "/settings"],
      ["I1:9934;509:16998", "/appointments"],
      ["I1:9934;509:17001", "/dashboard"],
    ],
    tabLinks: [
      ["1:9938", "/billing/medicine"],
      ["1:9939", "/billing/therapy"],
      ["1:9940", "/billing/summary"],
    ],
    actionLinks: [["1:9946", "/billing/medicine"]],
  });
}

generatePage({
  rootDir: __dirname,
  rawFile: "billing-service-9915.txt",
  importMapPath: path.join(__dirname, ".billing-flow-import-map.json"),
  innerName: "BillingServicePageInner",
  exportName: "BillingServicePage",
  outPath: path.join(ROOT, "src/pages/billing/BillingServicePage.tsx"),
  applyNav,
});
