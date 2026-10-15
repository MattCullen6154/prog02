function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function findSourceExcerpt(sourceText, excerpt) {
  if (!sourceText || !excerpt?.trim()) return null;

  const pattern = excerpt.trim().split(/\s+/).map(escapeRegExp).join('\\s+');
  const match = new RegExp(pattern, 'i').exec(sourceText);
  return match ? { start: match.index, end: match.index + match[0].length } : null;
}

export function getCitationLabel(sourceText, start) {
  const context = sourceText.slice(Math.max(0, start - 1200), start);
  const sectionMatches = [...context.matchAll(/\b(?:SEC\.\s*|SECTION\s+)\d+[A-Z]?\b/g)];
  const statuteMatches = [...context.matchAll(/\bSection\s+[\dA-Z][\w.-]*/gi)];
  const section = sectionMatches.at(-1)?.[0];
  const statute = statuteMatches.at(-1)?.[0];

  if (section && statute) return `${section} · § ${statute.replace(/^Section\s+/i, '')}`;
  if (section) return section;
  if (statute) return `§ ${statute.replace(/^Section\s+/i, '')}`;
  return 'View source passage';
}
