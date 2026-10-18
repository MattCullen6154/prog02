import { getModelText } from './modelResponse.js';

const qualifierStatuses = new Set(['preserved', 'partially_preserved', 'not_visible']);

export function buildQualifierAuditPrompt(measureLabel, legalText, rewrite) {
  return `Audit the final plain-language version of ${measureLabel} against the complete operative legal text below. First scan the legal text for important qualifiers and limiting language that affects who or what a rule applies to, exceptions, conditions, timing, thresholds, amounts, and scope. Include meaningful terms or phrases such as temporary, permanent, unless, except, exempt, until, at least, at most, only if, no more than, two-thirds, and their contextual equivalents. Do not assume this example list is complete. Then compare each qualifier with the final version and mark whether its meaning is preserved, only partly preserved, or not visible. Include concise source context and the corresponding rewrite evidence when present. Do not flag wording differences if the same limitation is clearly preserved. Return only valid JSON matching this shape:
{
  "qualifiers": [
    {
      "phrase": "qualifier or limiting phrase from the legal text",
      "sourceContext": "short context showing how it limits the legal rule",
      "status": "preserved | partially_preserved | not_visible",
      "rewriteEvidence": "short matching text from the rewrite, or an empty string if absent"
    }
  ],
  "summary": "One concise sentence noting the main qualifier risks or stating that no important dropped qualifiers were identified."
}

List the important qualifiers found across the source, not every incidental use of words like "may" or "shall". Be conservative: if the rewrite's wording makes a limitation uncertain or weaker, use partially_preserved; if the limitation is missing, use not_visible. This is a comparison aid, not a guarantee that the rewrite is legally complete. Do not rewrite the summary and do not make up missing legal language.

COMPLETE OPERATIVE LEGAL TEXT:
${legalText}

FINAL REWRITE TO CHECK:
${rewrite}`;
}

export function parseQualifierAudit(content) {
  const text = getModelText({ choices: [{ message: { content } }] });
  const json = text.match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error('The model did not return the requested qualifier check format.');

  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('The model returned a qualifier check that could not be read.');
  }

  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.qualifiers)) {
    throw new Error('The model returned an invalid qualifier list.');
  }
  if (parsed.qualifiers.some((item) =>
    !item ||
    typeof item.phrase !== 'string' ||
    !item.phrase.trim() ||
    typeof item.sourceContext !== 'string' ||
    !qualifierStatuses.has(item.status) ||
    typeof item.rewriteEvidence !== 'string'
  )) {
    throw new Error('The model returned an invalid qualifier comparison.');
  }
  if (typeof parsed.summary !== 'string' || !parsed.summary.trim()) {
    throw new Error('The model did not summarize the qualifier check.');
  }

  return {
    qualifiers: parsed.qualifiers.map((item) => ({
      phrase: item.phrase.trim(),
      sourceContext: item.sourceContext.trim(),
      status: item.status,
      rewriteEvidence: item.rewriteEvidence.trim(),
    })),
    summary: parsed.summary.trim(),
  };
}
