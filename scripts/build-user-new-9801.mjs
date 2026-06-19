import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OFFSET = 441;

function shiftNodeId(id) {
  const m = id.match(/^(I?)1:(\d+)(.*)$/);
  if (!m) return id;
  const num = Number(m[2]) + OFFSET;
  return `${m[1]}1:${num}${m[3] ?? ""}`;
}

function shiftIds(text) {
  return text.replace(/data-node-id="([^"]+)"/g, (_, id) => `data-node-id="${shiftNodeId(id)}"`);
}

const modalBlock = `
      <div className="absolute bg-[rgba(49,49,49,0.45)] h-[1024px] left-0 top-0 w-[1440px]" data-node-id="1:9868" />
      <div className="-translate-x-1/2 absolute contents left-1/2 top-[260px]" data-node-id="1:9869">
        <div className="absolute bg-white h-[504px] left-[370px] rounded-[12px] top-[260px] w-[700px]" data-node-id="1:9870" />
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[386px] top-[604px] w-[668px]" data-node-id="1:9871">
          <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[color:var(--color\\/grey\\/700,#404040)] w-[182px]" data-node-id="1:9872">
            <p className="leading-[normal]">Role</p>
          </div>
          <div className="bg-[var(--color\\/grey\\/0,white)] border border-[var(--color\\/grey\\/300,#d4d4d4)] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:9873">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[color:var(--color\\/grey\\/500,#737373)]" data-node-id="1:9874">
              Role
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="1:9875" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[728px] top-[364px] w-[326px]" data-node-id="1:9877">
          <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[color:var(--color\\/grey\\/700,#404040)] w-[182px]" data-node-id="1:9878">
            <p className="leading-[normal]">Full Name</p>
          </div>
          <div className="bg-[var(--color\\/grey\\/0,white)] border border-[var(--color\\/grey\\/300,#d4d4d4)] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:9879">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[color:var(--color\\/grey\\/500,#737373)]" data-node-id="1:9880">
              Full Name
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[386px] top-[444px] w-[326px]" data-node-id="1:9881">
          <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[color:var(--color\\/grey\\/700,#404040)] w-[182px]" data-node-id="1:9882">
            <p className="leading-[normal]">Contact Number</p>
          </div>
          <div className="bg-[var(--color\\/grey\\/0,white)] border border-[var(--color\\/grey\\/300,#d4d4d4)] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:9883">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[color:var(--color\\/grey\\/500,#737373)]" data-node-id="1:9884">
              Full Name
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[386px] top-[364px] w-[326px]" data-node-id="1:9885">
          <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:9886">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:9887">
              <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[color:var(--color\\/grey\\/700,#404040)] w-[182px]" data-node-id="1:9888">
                <p className="leading-[normal]">User ID</p>
              </div>
              <div className="bg-[var(--color\\/grey\\/0,white)] border border-[var(--color\\/grey\\/300,#d4d4d4)] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:9889">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[color:var(--color\\/grey\\/500,#737373)]" data-node-id="1:9890">
                  User ID
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[728px] top-[444px] w-[326px]" data-node-id="1:9891">
          <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:9892">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:9893">
              <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[color:var(--color\\/grey\\/700,#404040)] w-[182px]" data-node-id="1:9894">
                <p className="leading-[normal]">Email</p>
              </div>
              <div className="bg-[var(--color\\/grey\\/0,white)] border border-[var(--color\\/grey\\/300,#d4d4d4)] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:9895">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[color:var(--color\\/grey\\/500,#737373)]" data-node-id="1:9896">
                  Email
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[728px] top-[524px] w-[326px]" data-node-id="1:9897">
          <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:9898">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:9899">
              <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[color:var(--color\\/grey\\/700,#404040)] w-[182px]" data-node-id="1:9900">
                <p className="leading-[normal]">Confirm Password</p>
              </div>
              <div className="bg-[var(--color\\/grey\\/0,white)] border border-[var(--color\\/grey\\/300,#d4d4d4)] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:9901">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[color:var(--color\\/grey\\/500,#737373)]" data-node-id="1:9902">
                  Confirm Password
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[386px] top-[524px] w-[326px]" data-node-id="1:9903">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:9904">
            <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[color:var(--color\\/grey\\/700,#404040)] w-[182px]" data-node-id="1:9905">
              <p className="leading-[normal]">Password</p>
            </div>
            <div className="bg-[var(--color\\/grey\\/0,white)] border border-[var(--color\\/grey\\/300,#d4d4d4)] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:9906">
              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[color:var(--color\\/grey\\/500,#737373)]" data-node-id="1:9907">
                Password
              </p>
            </div>
          </div>
        </div>
        <a className="absolute bg-[#be880b] content-stretch cursor-pointer flex gap-[8px] h-[36px] items-center justify-center left-[874px] px-[6px] py-[8px] rounded-[8px] top-[704px] w-[180px]" data-node-id="1:9908" data-name="Button">
          <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[color:var(--color\\/grey\\/0,white)] text-left tracking-[0.56px] whitespace-nowrap" data-node-id="I1:9908;208:17867">
            <p className="leading-none">Confirm</p>
          </div>
        </a>
        <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[1.5] left-[386px] not-italic text-[13px] text-[color:var(--color\\/grey\\/500,#737373)] top-[312px] whitespace-nowrap" data-node-id="1:9909">
          Please fill out the details to add user
        </p>
        <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[20px] left-[386px] not-italic text-[#422c23] text-[16px] top-[284px] whitespace-nowrap" data-node-id="1:9910">
          Add User
        </p>
        <a className="absolute content-stretch cursor-pointer flex items-center justify-center overflow-clip p-[10px] right-[386px] rounded-[8px] top-[280px]" data-node-id="1:9911" data-name="Button close X">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="1:9912">
            <div className="col-1 ml-0 mt-0 relative row-1 size-[24px]" data-node-id="1:9913" data-name="x-close">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgXClose} />
            </div>
          </div>
        </a>
      </div>`;

let raw = fs.readFileSync(path.join(__dirname, "settings-9360.txt"), "utf8");
const roleRaw = fs.readFileSync(path.join(__dirname, "role-edit-9570.txt"), "utf8");
const frame1Url = roleRaw.match(/const imgFrame1 = "(https:[^"]+)"/)?.[1] ?? "";
const xCloseUrl = roleRaw.match(/const imgXClose = "(https:[^"]+)"/)?.[1] ?? "";
raw = raw.replace(
  /const imgAdd = "https:[^"]+";\n/,
  `$&const imgFrame1 = "${frame1Url}";\nconst imgXClose = "${xCloseUrl}";\n`,
);
raw = raw.replace(
  /export default function \w+\(\)/,
  "export default function UserManagementSettingsNewUserAdded()",
);
raw = shiftIds(raw);
raw = raw.replace(
  /<a className="(\[word-break:break-word\] absolute block cursor-pointer font-\['Inter:Medium'\] font-medium leading-\[0\] left-\[479px\] not-italic text-\[#422c23\] text-\[14px\] top-\[24px\] whitespace-nowrap)" data-node-id="1:9825">\s*<p className="leading-\[1\.5\]">Role Management<\/p>\s*<\/a>/,
  `<p className="$1" data-node-id="1:9825">Role Management</p>`,
);
raw = raw.replace(
  /<a className="(\[word-break:break-word\] absolute block cursor-pointer font-\['Inter:Medium'\] font-medium leading-\[0\] left-\[720px\] not-italic text-\[#422c23\] text-\[14px\] top-\[24px\] whitespace-nowrap)" data-node-id="1:9826">\s*<p className="leading-\[1\.5\]">System Preference<\/p>\s*<\/a>/,
  `<p className="$1" data-node-id="1:9826">System Preference</p>`,
);

const rootClose = raw.lastIndexOf("    </div>\r\n  );\r\n}");
const rootCloseLf = raw.lastIndexOf("    </div>\n  );\n}");
const insertAt = Math.max(rootClose, rootCloseLf);
if (insertAt >= 0) {
  raw = `${raw.slice(0, insertAt)}${modalBlock}\n${raw.slice(insertAt)}`;
} else {
  console.error("Could not find root close to insert modal");
  process.exit(1);
}

fs.writeFileSync(path.join(__dirname, "user-new-9801.txt"), raw);
console.log("Wrote user-new-9801.txt", raw.length);
