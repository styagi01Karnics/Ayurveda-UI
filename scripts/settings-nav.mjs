import { addToAfterLink, applyCommonNav } from "./figma-page-gen.mjs";

export function applySettingsSidebar(c, { instanceId, chevronId, arrowExitId, sidebarLinks }) {
  return applyCommonNav(c, {
    chevronId,
    arrowExitId,
    breadcrumbLabel: "Settings",
    sidebarLinks,
  });
}

/** Wire inactive settings sub-tab anchors to routes. Active tabs stay as <p> from Figma. */
export function applySettingsTabLinks(c, { clinicId, userId, rolesId, preferencesId }) {
  let out = c;
  if (clinicId) out = addToAfterLink(out, clinicId, "/settings/clinic");
  if (userId) out = addToAfterLink(out, userId, "/settings");
  if (rolesId) out = addToAfterLink(out, rolesId, "/settings/roles");
  if (preferencesId) out = addToAfterLink(out, preferencesId, "/settings/preferences");
  return out;
}

/** Convert a settings sub-tab <p> to a router Link. */
export function pTabToLink(c, nodeId, to) {
  const escaped = nodeId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `<p className="([^"]*)" data-node-id="${escaped}"([^>]*)>([\\s\\S]*?)<\\/p>`,
    "g",
  );
  return c.replace(
    re,
    `<Link to="${to}" className="$1 cursor-pointer block" data-node-id="${nodeId}"$2>$3</Link>`,
  );
}

/** Wire sidebar menu labels exported as <p> elements. */
export function wireSidebarPItems(c, items) {
  let out = c;
  for (const [nodeId, to, label] of items) {
    const escapedId = nodeId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(
      new RegExp(
        `<p className="(\\[word-break:break-word\\] absolute font-\\['Inter:Medium'\\] font-medium leading-\\[normal\\] left-\\[74px\\] not-italic text-\\[#422c23\\] text-\\[16px\\] top-\\[[^\\]]+\\] whitespace-nowrap)" data-node-id="${escapedId}">\\s*${escapedLabel}\\s*<\\/p>`,
      ),
      `<Link to="${to}" className="$1 cursor-pointer block" data-node-id="${nodeId}">${label}</Link>`,
    );
  }
  return out;
}
