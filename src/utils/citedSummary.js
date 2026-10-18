import { getModelText } from './modelResponse.js';

function parseJson(content) {
  const text = getModelText({ choices: [{ message: { content } }] });
  const json = text.match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error('The model did not return a cited summary. Please try again.');

  try {
    return JSON.parse(json);
  } catch {
    throw new Error('The model returned a summary that could not be read. Please try again.');
  }
}

export function parseCitedSummary(content) {
  const parsed = parseJson(content);
  if (!parsed || !Array.isArray(parsed.sentences) || parsed.sentences.length === 0) {
    throw new Error('The model did not include sentences and source citations. Please try again.');
  }

  return parsed.sentences.map((sentence) => {
    if (
      !sentence ||
      typeof sentence.text !== 'string' ||
      !sentence.text.trim() ||
      typeof sentence.sourceQuote !== 'string' ||
      !sentence.sourceQuote.trim()
    ) {
      throw new Error('A summary sentence was missing its source citation. Please try again.');
    }
    return { text: sentence.text.trim(), sourceQuote: sentence.sourceQuote.trim() };
  });
}
