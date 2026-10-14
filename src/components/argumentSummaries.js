const summaryRequests = new Map();

function getResponseText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .filter((part) => part.type === 'text' && typeof part.text === 'string')
      .map((part) => part.text)
      .join('\n');
  }
  return '';
}

function parseSummaryResponse(content, argumentKeys) {
  const text = getResponseText(content).trim();
  const json = text.match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error('The model did not return summaries in the requested format.');

  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('The model returned summaries that could not be read. Please try again.');
  }

  const summaries = {};
  for (const key of argumentKeys) {
    if (typeof parsed[key] !== 'string' || !parsed[key].trim()) {
      throw new Error(`The model did not return a summary for ${key}. Please try again.`);
    }
    summaries[key] = parsed[key].trim();
  }
  return summaries;
}

export function summarizeArguments(measure) {
  const existingRequest = summaryRequests.get(measure.id);
  if (existingRequest) return existingRequest;

  const entries = Object.entries(measure.arguments);
  const input = entries
    .map(([key, argument]) => `${key} — ${argument.heading}\n${argument.text}`)
    .join('\n\n---\n\n');
  const prompt = `Summarize each of the following official ballot argument documents in 1–2 concise, neutral sentences. Preserve the author's position and main claim, attribute disputed claims to the document, and do not add facts. Return only a JSON object whose keys are exactly these document keys and whose values are the summaries:\n${entries
    .map(([key]) => key)
    .join(', ')}\n\n${input}`;

  const request = globalThis.prog02OpenRouter
    .askModel(prompt)
    .then((data) => {
      const content = data.choices?.[0]?.message?.content;
      return parseSummaryResponse(content, entries.map(([key]) => key));
    })
    .catch((error) => {
      summaryRequests.delete(measure.id);
      throw error;
    });

  summaryRequests.set(measure.id, request);
  return request;
}
