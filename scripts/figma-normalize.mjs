export function normalizeFigmaTypography(code) {
  return code
    .replace(/font-\['Inter:Regular'\]/g, "font-['Inter']")
    .replace(/font-\['Inter:Medium'\]/g, "font-['Inter']")
    .replace(/font-\['Inter:Semi_Bold'\]/g, "font-['Inter']")
    .replace(/font-\['Satoshi:Medium'\]/g, "font-['Inter']")
    .replace(/text-\[color:var\(--color\\\/grey\\\/500,#737373\)\]/g, "text-[#737373]")
    .replace(/text-\[color:var\(--color\\\/grey\\\/700,#404040\)\]/g, "text-[#404040]")
    .replace(/text-\[color:var\(--color\\\/grey\\\/0,white\)\]/g, "text-white")
    .replace(/bg-\[var\(--color\\\/grey\\\/0,white\)\]/g, "bg-white")
    .replace(/border-\[var\(--color\\\/grey\\\/300,#d4d4d4\)\]/g, "border-[#d4d4d4]");
}
