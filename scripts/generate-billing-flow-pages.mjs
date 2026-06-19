import path from "path";
import { fileURLToPath } from "url";
import { generatePage } from "./figma-page-gen.mjs";
import { applyBillingFlowNav } from "./billing-flow-nav.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const importMapPath = path.join(__dirname, ".billing-flow-import-map.json");

const pages = [
  {
    rawFile: "billing-medicine-9993.txt",
    innerName: "BillingMedicinePageInner",
    exportName: "BillingMedicinePage",
    outPath: path.join(ROOT, "src/pages/billing/BillingMedicinePage.tsx"),
    applyNav: (code) =>
      applyBillingFlowNav(code, {
        chevronId: "1:9998",
        arrowExitId: "1:10009",
        breadcrumbLinkId: "I1:10013;2704:192646;70:24394",
        sidebarLinks: [
          ["I1:10012;509:16985", "/patients"],
          ["I1:10012;509:16986", "/doctors"],
          ["I1:10012;509:16987", "/sales"],
          ["I1:10012;509:16988", "/activity-log"],
          ["I1:10012;509:16989", "/treatments"],
          ["I1:10012;509:16992", "/medicines"],
          ["I1:10012;509:16993", "/settings"],
          ["I1:10012;509:16998", "/appointments"],
          ["I1:10012;509:17001", "/dashboard"],
        ],
        tabLinks: [
          ["1:10015", "/billing/service"],
          ["1:10017", "/billing/therapy"],
          ["1:10018", "/billing/summary"],
        ],
        actionLinks: [["1:10072", "/billing/therapy"]],
      }),
  },
  {
    rawFile: "billing-therapy-10073.txt",
    innerName: "BillingTherapyPageInner",
    exportName: "BillingTherapyPage",
    outPath: path.join(ROOT, "src/pages/billing/BillingTherapyPage.tsx"),
    applyNav: (code) =>
      applyBillingFlowNav(code, {
        chevronId: "1:10078",
        arrowExitId: "1:10089",
        breadcrumbLinkId: "I1:10093;2704:192646;70:24394",
        sidebarLinks: [
          ["I1:10092;509:16985", "/patients"],
          ["I1:10092;509:16986", "/doctors"],
          ["I1:10092;509:16987", "/sales"],
          ["I1:10092;509:16988", "/activity-log"],
          ["I1:10092;509:16989", "/treatments"],
          ["I1:10092;509:16992", "/medicines"],
          ["I1:10092;509:16993", "/settings"],
          ["I1:10092;509:16998", "/appointments"],
          ["I1:10092;509:17001", "/dashboard"],
        ],
        tabLinks: [
          ["1:10095", "/billing/service"],
          ["1:10096", "/billing/medicine"],
          ["1:10098", "/billing/summary"],
        ],
        actionLinks: [["1:10171", "/billing/summary"]],
      }),
  },
  {
    rawFile: "billing-summary-10172.txt",
    innerName: "BillingSummaryPageInner",
    exportName: "BillingSummaryPage",
    outPath: path.join(ROOT, "src/pages/billing/BillingSummaryPage.tsx"),
    frameHeight: 1155,
    applyNav: (code) =>
      applyBillingFlowNav(code, {
        chevronId: "1:10177",
        arrowExitId: "1:10188",
        breadcrumbLinkId: "I1:10192;2704:192646;70:24394",
        sidebarLinks: [
          ["I1:10191;509:16985", "/patients"],
          ["I1:10191;509:16986", "/doctors"],
          ["I1:10191;509:16987", "/sales"],
          ["I1:10191;509:16988", "/activity-log"],
          ["I1:10191;509:16989", "/treatments"],
          ["I1:10191;509:16992", "/medicines"],
          ["I1:10191;509:16993", "/settings"],
          ["I1:10191;509:16998", "/appointments"],
          ["I1:10191;509:17001", "/dashboard"],
        ],
        tabLinks: [
          ["1:10195", "/billing/service"],
          ["1:10196", "/billing/medicine"],
          ["1:10197", "/billing/therapy"],
        ],
        actionLinks: [["1:10194", "/billing/final"]],
      }),
  },
];

for (const page of pages) {
  generatePage({
    rootDir: __dirname,
    importMapPath,
    frameHeight: page.frameHeight ?? 1024,
    ...page,
  });
}
