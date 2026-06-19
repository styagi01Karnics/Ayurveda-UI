import { addToAfterLink, applyCommonNav } from "./figma-page-gen.mjs";

export function applyBillingFlowNav(code, config) {
  const {
    chevronId,
    arrowExitId,
    breadcrumbLinkId,
    sidebarLinks,
    tabLinks = [],
    actionLinks = [],
  } = config;

  let c = applyCommonNav(code, { chevronId, arrowExitId, sidebarLinks });
  if (breadcrumbLinkId) {
    c = addToAfterLink(c, breadcrumbLinkId, "/billing");
    c = c.replace(/Breadcrumb 1/g, "Billing");
  }
  for (const [id, to] of tabLinks) {
    c = addToAfterLink(c, id, to);
  }
  for (const [id, to] of actionLinks) {
    c = addToAfterLink(c, id, to);
  }
  return c;
}
