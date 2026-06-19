export function addToAfterLink(code, nodeId, to) {
  const re = new RegExp(`<a([^>]*data-node-id="${nodeId}"[^>]*)>([\\s\\S]*?)<\\/a>`, "g");
  return code.replace(re, `<Link to="${to}"$1>$2</Link>`);
}

const TABS = [
  { key: "personal", route: "/doctors/1", left: "16px" },
  { key: "medical", route: "/doctors/1/medical-assessment", left: "237px" },
  { key: "treatment", route: "/doctors/1/treatment", left: "456px" },
  { key: "billing", route: "/doctors/1/billing", left: "687px" },
];

export function applyTabNav(code, activeTab) {
  let c = code;
  for (const tab of TABS) {
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
      const content = inner.replace(
        /^\s*<p className="leading-\[1\.5\]">([\s\S]*?)<\/p>\s*$/,
        "$1",
      ).trim();
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

const EDIT_ROUTES = {
  personal: "/doctors/1/edit",
  medical: "/doctors/1/medical-assessment/edit",
  treatment: "/doctors/1/treatment/edit",
  billing: "/doctors/1/billing/edit",
};

export function applyPatientNav(code, { editRoute } = {}) {
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
  c = c.replace(
    /<div className="absolute contents left-\[939px\] top-\[86px\]" data-node-id="[^"]+">([\s\S]*?data-name="Add">[\s\S]*?<\/div>)\s*<\/div>/,
    '<Link to="/appointments/create-patient" className="absolute contents cursor-pointer left-[939px] top-[86px]" data-name="Book Appointment">$1</Link>',
  );
  c = c.replace(
    /<a className="\[word-break:break-word\] absolute block cursor-pointer font-\['Inter:Medium'\] font-medium leading-\[0\] left-\[583px\] not-italic text-\[#422c23\] text-\[14px\] top-\[146px\] whitespace-nowrap" data-node-id="[^"]+">([\s\S]*?)<\/a>/,
    `<Link to="/doctors/prescription/create" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[583px] not-italic text-[#422c23] text-[14px] top-[146px] whitespace-nowrap">$1</Link>`,
  );
  c = c.replace(
    /<(?:a|Link) className="absolute bg-white block border border-\[#ede2ca\] border-solid cursor-pointer left-\[541px\] overflow-clip rounded-\[50px\] size-\[30px\] top-\[142px\]" data-node-id="[^"]+">([\s\S]*?)<\/(?:a|Link)>/,
    `<Link to="/doctors/prescription/create" className="absolute bg-white block border border-[#ede2ca] border-solid cursor-pointer left-[541px] overflow-clip rounded-[50px] size-[30px] top-[142px]">$1</Link>`,
  );
  c = c.replace(
    /<a className="content-stretch cursor-pointer flex items-center px-px relative shrink-0" data-node-id="I1:[^"]+;70:24394" data-name="Link">([\s\S]*?)<\/a>/,
    `<Link to="/doctors" className="content-stretch cursor-pointer flex items-center px-px relative shrink-0" data-name="Link">$1</Link>`,
  );
  c = c.replace(
    /<p className="\[word-break:break-word\] font-\['Inter:Medium'\] font-medium leading-\[18px\] not-italic relative shrink-0 text-\[#83899a\] text-\[14px\] text-left tracking-\[0\.16px\] whitespace-nowrap" data-node-id="[^"]+">\s*Breadcrumb 1\s*<\/p>/,
    '<p className="[word-break:break-word] font-[\'Inter\'] font-medium leading-[18px] not-italic relative shrink-0 text-[#83899a] text-[14px] text-left tracking-[0.16px] whitespace-nowrap">Doctors</p>',
  );

  const sidebarLinks = [
    ["509:17147", "/patients"],
    ["509:17148", "/sales"],
    ["509:17149", "/activity-log"],
    ["509:17150", "/treatments"],
    ["509:17151", "/billing"],
    ["509:17152", "/medicines"],
    ["509:17153", "/settings"],
    ["509:17157", "/appointments"],
    ["509:17160", "/dashboard"],
  ];
  for (const [suffix, to] of sidebarLinks) {
    c = c.replace(
      new RegExp(
        `<a([^>]*data-node-id="I1:\\d+;${suffix}"[^>]*)>([\\s\\S]*?)<\\/a>`,
        "g",
      ),
      `<Link to="${to}"$1>$2</Link>`,
    );
  }

  if (editRoute) {
    c = c.replace(
      /<a([^>]*data-name="Edit"[^>]*)>([\s\S]*?)<\/a>/g,
      `<Link to="${editRoute}"$1>$2</Link>`,
    );
  }

  return c;
}

export function applyPatientEditNav(code, { viewRoute } = {}) {
  let c = applyPatientNav(code);

  if (viewRoute) {
    c = c.replace(
      /<a className="(absolute bg-\[#be880b\][^"]*)" data-node-id="[^"]+" data-name="Button">([\s\S]*?)<\/a>/g,
      `<Link to="${viewRoute}" className="$1 cursor-pointer" data-name="Button">$2</Link>`,
    );
  }

  return c;
}

export { EDIT_ROUTES };

export function finalizeLinks(code) {
  return code.replace(/<a([^>]*)>([\s\S]*?)<\/Link>/g, "<a$1>$2</a>");
}
