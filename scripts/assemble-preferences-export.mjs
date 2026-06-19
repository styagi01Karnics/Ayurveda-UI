import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ID_OFFSET = 91;

function bumpNodeId(id) {
  const m = id.match(/^(\d+):(\d+)$/);
  if (!m) return id;
  const prefix = Number(m[1]);
  const num = Number(m[2]);
  if (prefix === 1 && num >= 9428 && num <= 9517) return `1:${num + ID_OFFSET}`;
  return id;
}

function bumpIdsInText(text) {
  return text.replace(/data-node-id="([^"]+)"/g, (_, id) => {
    let newId = id;
    if (id.includes(";")) {
      const [root, rest] = id.split(";");
      if (root === "I1:9447") newId = `I1:9538;${rest}`;
      else if (root.startsWith("I1:9446")) newId = id.replace("I1:9446", "I1:9537");
      else if (root.startsWith("I1:9451")) newId = id.replace("I1:9451", "I1:9539");
    } else {
      newId = bumpNodeId(id);
    }
    return `data-node-id="${newId}"`;
  });
}

const panel = fs.readFileSync(path.join(__dirname, "preferences-panel.txt"), "utf8");

let role = fs.readFileSync(path.join(__dirname, "role-9427.txt"), "utf8");
role = role.replace(/^const img[\s\S]*?\n\nexport default function RoleManagementSettings\(\) \{\n  return \(\n/, "");
role = role.replace(/\n\}\s*$/, "");

const outerOpen = role.indexOf('<div className="bg-[#fffef7]');
const afterOpen = role.indexOf(">", outerOpen) + 1;
const headerEnd = role.indexOf(
  '<a className="absolute block cursor-pointer inset-[8.4%_22.22%_88.48%_67.43%]"',
);
const header = bumpIdsInText(role.slice(afterOpen, headerEnd)).replace(
  /Role Management Settings/g,
  "System Preference Settings",
);

const consts = `const imgImage = "https://www.figma.com/api/mcp/asset/6705f685-5df0-4143-aff5-c830596509cd";
const imgRectangle1 = "https://www.figma.com/api/mcp/asset/401b4f50-2c72-4ae1-83c2-ebc46bc781a3";
const imgLogo21 = "https://www.figma.com/api/mcp/asset/3601dc5f-5862-4622-a447-1daf00ef483c";
const imgEllipse3704 = "https://www.figma.com/api/mcp/asset/212484f4-b4ab-480f-a1af-8768ab0c7469";
const imgEllipse3705 = "https://www.figma.com/api/mcp/asset/ad4be014-a964-47ac-afb6-b050117943f0";
const imgLine477 = "https://www.figma.com/api/mcp/asset/c177c955-57c7-4d67-b526-07b134c3547f";
const imgChevron = "https://www.figma.com/api/mcp/asset/ca4f01d1-bac6-40ed-b9b6-8583269cd115";
const imgFrame = "https://www.figma.com/api/mcp/asset/8a65d933-1763-4e8b-845b-de9c7f10a4eb";
const imgGroup = "https://www.figma.com/api/mcp/asset/7d5fc3ff-6c83-48b3-8744-987265fb681c";
const imgArrowExit = "https://www.figma.com/api/mcp/asset/090b3bf1-abb1-4a9e-9fe5-a060dd5a41b7";
const imgAlert = "https://www.figma.com/api/mcp/asset/214cbd60-4ba8-446e-8392-c3870099e198";
const imgDoctor = "https://www.figma.com/api/mcp/asset/a24cc732-f914-4b9c-9813-be241687ebf7";
const imgPerson = "https://www.figma.com/api/mcp/asset/a617ff40-f42a-421d-9d70-481ba6f85f20";
const imgBriefcaseMedical = "https://www.figma.com/api/mcp/asset/c1291ba8-c58c-42fd-87be-67f1ee5bbaa8";
const imgCalendarPerson = "https://www.figma.com/api/mcp/asset/4f41ac14-9758-48f6-892c-1eab361ade22";
const imgHistory = "https://www.figma.com/api/mcp/asset/d9f6f3b8-ebb2-4cdb-b717-eb744fefe2a3";
const imgDocumentBulletList = "https://www.figma.com/api/mcp/asset/b9ab05bf-afcb-4307-ae21-30ab32de2093";
const imgDataHistogram = "https://www.figma.com/api/mcp/asset/6d94836f-6832-47ff-99f5-9abe5df85b47";
const imgHeartPulse = "https://www.figma.com/api/mcp/asset/dda4e025-6f08-46d1-a504-bb321fef545f";
const imgGrid = "https://www.figma.com/api/mcp/asset/82722add-b076-4954-a1e4-6cf4e2684fca";
const imgSettings = "https://www.figma.com/api/mcp/asset/739cc3bb-c2fc-49d9-b80a-f2c35c18bd2b";
const imgLine449 = "https://www.figma.com/api/mcp/asset/0a3d6c41-00ad-426d-bb01-c4a7a0564446";
const imgLine450 = "https://www.figma.com/api/mcp/asset/d40eb2cf-a4db-497b-accf-7b1fdcfd4a02";
const imgHandle = "https://www.figma.com/api/mcp/asset/6d415d4d-3ad1-450d-a1ac-67d75a5dcd48";
`;

const output = `${consts}
export default function SystemPreferenceSettings() {
  return (
    <div className="bg-[#fffef7] relative size-full" data-node-id="1:9518" data-name="System Preference Settings">
${header}
${panel}
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, "preferences-9518.txt"), output);
console.log("Wrote preferences-9518.txt");
