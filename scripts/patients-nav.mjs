export function addToAfterLink(code, nodeId, to) {
  const re = new RegExp(`<a([^>]*data-node-id="${nodeId}"[^>]*)>([\\s\\S]*?)<\\/a>`, "g");
  return code.replace(re, `<Link to="${to}"$1>$2</Link>`);
}

const SIDEBAR_LINKS = [
  ["509:17174", "/doctors"],
  ["509:17175", "/sales"],
  ["509:17176", "/activity-log"],
  ["509:17177", "/treatments"],
  ["509:17178", "/billing"],
  ["509:17179", "/medicines"],
  ["509:17180", "/settings"],
  ["509:17184", "/appointments"],
  ["509:17187", "/dashboard"],
];

const DETAIL_TABS = [
  { key: "personal", route: "/patients/details-1", left: "16px" },
  { key: "medical", route: "/patients/details-2", left: "237px" },
  { key: "treatment", route: "/patients/details-3", left: "456px" },
  { key: "billing", route: "/patients/details-4", left: "687px" },
];

function applySidebarLinks(code) {
  let c = code;
  for (const [suffix, to] of SIDEBAR_LINKS) {
    c = c.replace(
      new RegExp(
        `<a([^>]*data-node-id="I1:\\d+;${suffix}"[^>]*)>([\\s\\S]*?)<\\/a>`,
        "g",
      ),
      `<Link to="${to}"$1>$2</Link>`,
    );
  }
  return c;
}

function applyHeaderNav(code) {
  let c = code;
  c = c.replace(
    /<a([^>]*data-name="Chevron"[^>]*)>([\s\S]*?)<\/a>/g,
    '<Link to="/dashboard/profile-dropdown"$1>$2</Link>',
  );
  c = c.replace(
    /<a([^>]*data-name="Arrow Exit"[^>]*)>([\s\S]*?)<\/a>/g,
    '<Link to="/dashboard/logout-popup"$1>$2</Link>',
  );
  c = c.replace(
    /<span className="\[text-decoration-skip-ink:none\] \[text-underline-position:from-font\] decoration-from-font decoration-solid font-\['Inter:Semi_Bold'\] font-semibold leading-\[normal\] text-\[#be880b\] underline">Claim Offer<\/span>/g,
    '<Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-[\'Inter\'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>',
  );
  return c;
}

const INACTIVE_ROW_IDS = [
  "1:6054",
  "1:6055",
  "1:6056",
  "1:6057",
  "1:6058",
  "1:6059",
  "1:6060",
  "1:6068",
  "1:6069",
  "1:6070",
  "1:6071",
  "1:6072",
  "1:6073",
  "1:6074",
];

export function applyInactivePatientsNav(code) {
  let c = applyHeaderNav(code);
  c = applySidebarLinks(c);

  c = addToAfterLink(c, "1:6040", "/patients");

  for (const nodeId of INACTIVE_ROW_IDS) {
    c = addToAfterLink(c, nodeId, "/patients/details-1");
    c = c.replace(
      new RegExp(
        `<div className="(\\[word-break:break-word\\] absolute font-\\['Inter:Medium'\\][^"]*)" data-node-id="${nodeId}">([\\s\\S]*?)<\\/div>`,
        "g",
      ),
      `<Link to="/patients/details-1" className="$1 block cursor-pointer">$2</Link>`,
    );
  }

  return c;
}

export function applyPatientDetailsTabNav(code, activeTab) {
  let c = code;
  for (const tab of DETAIL_TABS) {
    const isActive = tab.key === activeTab;
    const cls = isActive
      ? `[word-break:break-word] absolute block font-['Inter'] font-semibold leading-[1.5] left-[${tab.left}] not-italic text-[#be880b] text-[14px] top-[126px] whitespace-nowrap`
      : `[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[${tab.left}] not-italic text-[#422c23] text-[14px] top-[126px] whitespace-nowrap`;
    const leftEsc = tab.left.replace(/[[\]]/g, "\\$&");

    const anchorRe = new RegExp(
      `<a\\b[^>]*left-\\[${leftEsc}\\][^>]*top-\\[126px\\][^>]*>([\\s\\S]*?)<\\/a>`,
      "g",
    );
    c = c.replace(anchorRe, (_, inner) => {
      const content = inner
        .replace(/^\s*<p className="leading-\[1\.5\]">([\s\S]*?)<\/p>\s*$/, "$1")
        .trim();
      return `<Link to="${tab.route}" className="${cls}">${content}</Link>`;
    });

    const pRe = new RegExp(
      `<p\\b[^>]*left-\\[${leftEsc}\\][^>]*top-\\[126px\\][^>]*>([\\s\\S]*?)<\\/p>`,
      "g",
    );
    c = c.replace(
      pRe,
      (_, inner) =>
        `<Link to="${tab.route}" className="${cls}">${inner.trim()}</Link>`,
    );
  }
  return c;
}

export function applyPatientDetailsNav(code, { activeTab = "personal" } = {}) {
  let c = applyHeaderNav(code);
  c = applySidebarLinks(c);
  c = applyPatientDetailsTabNav(c, activeTab);

  c = c.replace(
    /<a className="content-stretch cursor-pointer flex items-center px-px relative shrink-0" data-node-id="I1:14173;2704:192646;70:24394" data-name="Link">([\s\S]*?)<\/a>/,
    `<Link to="/patients/inactive" className="content-stretch cursor-pointer flex items-center px-px relative shrink-0" data-name="Link">$1</Link>`,
  );
  c = c.replace(
    /<p className="\[word-break:break-word\] font-\['Inter:Medium'\] font-medium leading-\[18px\] not-italic relative shrink-0 text-\[#83899a\] text-\[14px\] text-left tracking-\[0\.16px\] whitespace-nowrap" data-node-id="I1:14173;2704:192646;70:24394;0:7611">\s*Breadcrumb 1\s*<\/p>/,
    '<p className="[word-break:break-word] font-[\'Inter\'] font-medium leading-[18px] not-italic relative shrink-0 text-[#83899a] text-[14px] text-left tracking-[0.16px] whitespace-nowrap">Patients</p>',
  );
  c = c.replace(/Breadcrumb 1/g, "Patients");

  return c;
}
