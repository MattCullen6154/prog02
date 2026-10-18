import { getModelText } from './modelResponse.js';

const leanings = [
  'strongly_favorable',
  'favorable',
  'slightly_favorable',
  'mixed',
  'slightly_unfavorable',
  'unfavorable',
  'strongly_unfavorable',
  'unclear',
];

function parseJsonResponse(content) {
  const text = getModelText({ choices: [{ message: { content } }] });
  const json = text.match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error('The model did not return the requested explanation format. Please try again.');

  try {
    return JSON.parse(json);
  } catch {
    throw new Error('The model returned an explanation that could not be read. Please try again.');
  }
}

function requireTextList(value, field) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`The model returned an invalid ${field} list. Please try again.`);
  }
  return value.map((item) => item.trim()).filter(Boolean);
}

function requireCitedText(value, field) {
  if (
    !value ||
    typeof value !== 'object' ||
    typeof value.text !== 'string' ||
    !value.text.trim() ||
    typeof value.sourceQuote !== 'string' ||
    !value.sourceQuote.trim()
  ) {
    throw new Error(`The model did not include text and a source citation for ${field}. Please try again.`);
  }
  return { text: value.text.trim(), sourceQuote: value.sourceQuote.trim() };
}

function requireCitedTextList(value, field) {
  if (!Array.isArray(value)) {
    throw new Error(`The model returned an invalid ${field} list. Please try again.`);
  }
  return value.map((item) => requireCitedText(item, field));
}

export function parseTopicExplanation(content) {
  const parsed = parseJsonResponse(content);
  if (!parsed || typeof parsed !== 'object' || !parsed.opinion || typeof parsed.opinion !== 'object') {
    throw new Error('The model did not separate the text summary from its opinion. Please try again.');
  }

  const leaning = parsed.opinion.leaning;
  if (!leanings.includes(leaning)) {
    throw new Error('The model returned an unsupported opinion leaning. Please try again.');
  }

  return {
    textSays: requireCitedTextList(parsed.textSays, 'a factual summary sentence'),
    opinion: {
      leaning,
      rationale: requireCitedText(parsed.opinion.rationale, 'an opinion rationale'),
      pointsInFavor: requireCitedTextList(parsed.opinion.pointsInFavor, 'points-in-favor'),
      pointsAgainst: requireCitedTextList(parsed.opinion.pointsAgainst, 'points-against'),
      uncertainties: requireTextList(parsed.opinion.uncertainties, 'uncertainty'),
    },
  };
}
