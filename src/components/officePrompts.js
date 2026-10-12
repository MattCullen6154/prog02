export function buildOfficePrompt(office) {
  const context = (office.additionalContext ?? [])
    .map(({ fact, kind }) => (kind === 'boundary' ? `Boundary: ${fact}` : fact))
    .join('\n');

  return `Explain the elected office "${office.name}" to a voter in plain, concise language.
Use only the supplied data. Clearly separate what the office decides from what it does not control. Do not invent powers, policies, or candidate positions. If a detail is not established by the data, say that it is not specified.

Jurisdiction: ${office.jurisdiction}
Handout description: ${office.description}
Additional verified context:
${context || 'No additional context supplied.'}

Use these headings:
WHAT IT DECIDES
WHAT IT DOES NOT CONTROL
WHY IT MATTERS`;
}

export function buildOfficeImagePrompt(office) {
  return `Create a warm, photorealistic documentary-style landscape image that symbolizes the work of the ${office.name} in ${office.jurisdiction}. Draw only on this office description: ${office.description}
Show an ordinary, fictional civic setting with everyday community members, not identifiable real people. Use natural light and a respectful, nonpartisan tone. Avoid text, logos, campaign signs, candidate portraits, and claims about specific policies.`;
}

export function getModelText(content) {
  if (typeof content === 'string') return content.trim();
  if (Array.isArray(content)) {
    return content
      .filter((part) => typeof part?.text === 'string')
      .map((part) => part.text)
      .join('\n')
      .trim();
  }
  return '';
}
