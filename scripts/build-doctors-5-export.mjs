import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let c = fs.readFileSync(path.join(__dirname, "doctors-4-13416.txt"), "utf8");
c = c.replace(/Doctors4/g, "Doctors5");
c = c.replace(/data-node-id="1:134/g, 'data-node-id="1:136');
c = c.replace(/data-node-id="I1:134/g, 'data-node-id="I1:136');

c = c.replace(
  /<p className="\[word-break:break-word\] absolute font-\['Inter:Semi_Bold'\] font-semibold leading-\[1\.5\] left-\[456px\][^>]*>\{`Treatment & Follow Up`\}<\/p>/,
  '<a className="[word-break:break-word] absolute block cursor-pointer font-[\'Inter:Medium\'] font-medium leading-[0] left-[456px] not-italic text-[#422c23] text-[14px] top-[126px] whitespace-nowrap" data-node-id="1:13697">\n          <p className="leading-[1.5]">{`Treatment & Follow Up`}</p>\n        </a>',
);
c = c.replace(
  /<a className="\[word-break:break-word\] absolute block cursor-pointer font-\['Inter:Medium'\] font-medium leading-\[0\] left-\[687px\][^>]*>\s*<p className="leading-\[1\.5\]">\{`Billing & Membership`\}<\/p>\s*<\/a>/,
  '<p className="[word-break:break-word] absolute font-[\'Inter:Semi_Bold\'] font-semibold leading-[1.5] left-[687px] not-italic text-[#be880b] text-[14px] top-[126px] whitespace-nowrap" data-node-id="1:13698">{`Billing & Membership`}</p>',
);
c = c.replace(
  /left-\[456px\] top-\[165px\] w-\[151px\]/,
  "left-[687px] top-[165px] w-[143px]",
);

if (!c.includes("imgLine452")) {
  c = c.replace(
    /(const imgLine155 = "[^"]+";\n)/,
    `$1const imgLine452 = "https://placeholder";\n`,
  );
}

c = c.replace("Active Treatment Plan", "Billing & Membership");
c = c.replace("Upcoming Follow up", "Payment Setup");
c = c.replace("Appointment History", "Billing Details");
c = c.replace(/top-\[560px\] w-\[159px\]/, "top-[529px] w-[604px]");
c = c.replace(/Treatment Name/g, "Package Name");
c = c.replace(/Start \/ End Date/g, "Validity");
c = c.replace("10/05/2025 - 11/05/2026", "11/05/2026");
c = c.replace(/Total Sessions/g, "Status");
c = c.replace(/\n              23\n/, "\n              Completed\n");
c = c.replace(/Sessions Completed/g, "Registration Fees");
c = c.replace(/Remaining Sessions/g, "Payment Mode");
c = c.replace(/Assigned Therapist/g, "Partial Payment");
c = c.replace(/\n              12\n/, "\n              ₹400\n");
c = c.replace(/\n              11\n/, "\n              Debit Card\n");
c = c.replace(/\n              Meera\n/, "\n              No\n");
c = c.replace(
  /h-\[291px\] left-\[16px\] rounded-\[10px\] top-\[610px\][^\n]+\n        <div className="absolute bg-\[#faf9f5\] h-\[123px\]/,
  'h-[84px] left-[16px] rounded-[10px] top-[413px] w-[1063px]" />\n        <div className="absolute bg-[#faf9f5] h-[222px] left-[16px] rounded-[10px] top-[579px] w-[1063px]" />\n        <div className="absolute bg-[#faf9f5] h-[84px]',
);

const start = c.indexOf(
  '<div className="absolute content-stretch flex items-start left-[32px] top-[429px]',
);
const end = c.indexOf(
  '<a className="absolute block cursor-pointer left-[1047px] size-[32px] top-[121px]"',
);

const billingTail = `        <div className="absolute content-stretch flex items-center left-[948px] top-[263px] w-[115px]" data-node-id="1:13750">
          <div className="[word-break:break-word] content-stretch flex flex-col font-[family-name:var(--typography\\/family\\/title,'Inter:Medium')] gap-[4px] items-start not-italic relative shrink-0" data-node-id="1:13751">
            <div className="flex flex-col font-[var(--typography\\/weight\\/medium,500)] justify-center leading-[0] relative shrink-0 text-[color:var(--color\\/grey\\/500,#737373)] text-[length:var(--typography\\/font-size\\/14,14px)] w-full" data-node-id="1:13752">
              <p className="leading-[var(--typography\\/height\\/5,22px)]">Discount Applied</p>
            </div>
            <p className="font-medium leading-[var(--typography\\/height\\/3,26px)] relative shrink-0 text-[#be880b] text-[length:var(--typography\\/size\\/sm,14px)] w-full" data-node-id="1:13753">
              ₹400
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex items-center left-[924px] top-[429px] w-[139px]" data-node-id="1:13754">
          <div className="[word-break:break-word] content-stretch flex flex-col font-[family-name:var(--typography\\/family\\/title,'Inter:Medium')] gap-[4px] items-start not-italic relative shrink-0" data-node-id="1:13755">
            <div className="flex flex-col font-[var(--typography\\/weight\\/medium,500)] justify-center leading-[0] relative shrink-0 text-[color:var(--color\\/grey\\/500,#737373)] text-[length:var(--typography\\/font-size\\/14,14px)] w-full" data-node-id="1:13756">
              <p className="leading-[var(--typography\\/height\\/5,22px)]">Outstanding Amount</p>
            </div>
            <p className="font-medium leading-[var(--typography\\/height\\/3,26px)] relative shrink-0 text-[#be880b] text-[length:var(--typography\\/size\\/sm,14px)] w-full" data-node-id="1:13757">
              ₹800
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[11px] items-start left-[32px] pr-[12px] top-[595px] w-[1031px]" data-node-id="1:13758">
          <div className="content-stretch flex items-start relative shrink-0 w-[1031px]" data-node-id="1:13759">
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] font-['Inter:Medium'] font-medium gap-[7px] items-center leading-[22.5px] min-w-px not-italic relative text-[14px] tracking-[0.1px]" data-node-id="1:13760">
              <p className="flex-[1_0_0] min-w-px relative text-[color:var(--color\\/grey\\/500,#737373)]" data-node-id="1:13761">Service Type</p>
              <p className="relative shrink-0 text-[color:var(--color\\/grey\\/700,#404040)] whitespace-nowrap" data-node-id="1:13762">Consultation</p>
            </div>
          </div>
          <div className="content-stretch flex items-start relative shrink-0 w-[1031px]" data-node-id="1:13763">
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] font-['Inter:Medium'] font-medium gap-[7px] items-center leading-[22.5px] min-w-px not-italic relative text-[14px] tracking-[0.1px]" data-node-id="1:13764">
              <p className="flex-[1_0_0] min-w-px relative text-[color:var(--color\\/grey\\/500,#737373)]" data-node-id="1:13765">Service Fees</p>
              <p className="relative shrink-0 text-[color:var(--color\\/grey\\/700,#404040)] whitespace-nowrap" data-node-id="1:13766">₹400</p>
            </div>
          </div>
          <div className="content-stretch flex items-start relative shrink-0 w-[1031px]" data-node-id="1:13767">
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] font-['Inter:Medium'] font-medium gap-[7px] items-center leading-[22.5px] min-w-px not-italic relative text-[14px] tracking-[0.1px]" data-node-id="1:13768">
              <p className="flex-[1_0_0] min-w-px relative text-[color:var(--color\\/grey\\/500,#737373)]" data-node-id="1:13769">Package Type</p>
              <p className="relative shrink-0 text-[color:var(--color\\/grey\\/700,#404040)] whitespace-nowrap" data-node-id="1:13770">Monthly</p>
            </div>
          </div>
          <div className="content-stretch flex items-start relative shrink-0 w-[1031px]" data-node-id="1:13771">
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] font-['Inter:Medium'] font-medium gap-[7px] items-center leading-[22.5px] min-w-px not-italic relative text-[14px] tracking-[0.1px]" data-node-id="1:13772">
              <p className="flex-[1_0_0] min-w-px relative text-[color:var(--color\\/grey\\/500,#737373)]" data-node-id="1:13773">Package Charges</p>
              <p className="relative shrink-0 text-[color:var(--color\\/grey\\/700,#404040)] whitespace-nowrap" data-node-id="1:13774">₹400</p>
            </div>
          </div>
          <div className="content-stretch flex items-start relative shrink-0 w-[1031px]" data-node-id="1:13775">
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] font-['Inter:Medium'] font-medium gap-[7px] items-center leading-[22.5px] min-w-px not-italic relative text-[14px] tracking-[0.1px]" data-node-id="1:13776">
              <p className="flex-[1_0_0] min-w-px relative text-[color:var(--color\\/grey\\/500,#737373)]" data-node-id="1:13777">Discount</p>
              <p className="relative shrink-0 text-[#be880b] whitespace-nowrap" data-node-id="1:13778">₹400</p>
            </div>
          </div>
          <div className="content-stretch flex items-start relative shrink-0 w-[1031px]" data-node-id="1:13779">
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] font-['Inter:Medium'] font-medium gap-[7px] items-center leading-[22.5px] min-w-px not-italic relative text-[14px] tracking-[0.1px]" data-node-id="1:13780">
              <p className="flex-[1_0_0] min-w-px relative text-[color:var(--color\\/grey\\/500,#737373)]" data-node-id="1:13781">CGST &amp; SGST</p>
              <p className="relative shrink-0 text-[color:var(--color\\/grey\\/700,#404040)] whitespace-nowrap" data-node-id="1:13782">3%</p>
            </div>
          </div>
        </div>
        <div className="absolute h-0 left-[32px] top-[901px] w-[1038px]" data-node-id="1:13715">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine452} />
          </div>
        </div>
        `;

if (start >= 0 && end >= 0) {
  c = c.slice(0, start) + billingTail + c.slice(end);
}

fs.writeFileSync(path.join(__dirname, "doctors-5-13668.txt"), c);
console.log("Wrote doctors-5-13668.txt");
