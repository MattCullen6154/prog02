import { useState } from 'react';
import GenerationPreview from './GenerationPreview.jsx';
import MeasureGenerationResult from './MeasureGenerationResult.jsx';
import ReadingLevelSelector from './ReadingLevelSelector.jsx';
import { loadMeasureText } from '../utils/measureText.js';
import { buildQualifierAuditPrompt, parseQualifierAudit } from '../utils/qualifierAudit.js';
import { parseCitedSummary } from '../utils/citedSummary.js';
import { fleschKincaid, operativeText } from '../utils/readability.js';
import { countTopicMentions } from '../utils/topicKeywords.js';

const readingTargets = {
  'plain-english': { grade: 12, minimum: 11, maximum: 13, range: '11th–13th grade' },
  everyday: { grade: 8, minimum: 7, maximum: 9, range: '7th–9th grade' },
  simplest: { grade: 4, minimum: 3, maximum: 4, range: '3rd–4th grade' },
};

const MAX_REWRITE_ATTEMPTS = 3;

function getReportedCost(response) {
  const usageCost = response.usage?.cost;
  if (
    (typeof usageCost === 'number' ||
      (typeof usageCost === 'string' && usageCost.trim() !== '')) &&
    Number.isFinite(Number(usageCost)) &&
    Number(usageCost) >= 0
  ) {
    return Number(usageCost);
  }
  return null;
}

async function requestQualifierAudit(legalText, rewrite, measureLabel) {
  const response = await globalThis.prog02OpenRouter.askModel(
    buildQualifierAuditPrompt(measureLabel, legalText, rewrite),
  );
  const cost = getReportedCost(response);

  try {
    return {
      status: 'success',
      value: parseQualifierAudit(response.choices?.[0]?.message?.content),
      cost,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
      cost,
    };
  }
}

const lengthInstructions = {
  headline: 'Use no more than 25 words.',
  short: 'Use 75–100 words.',
  standard: 'Use 250–300 words.',
  complete: 'Do not impose a word limit; rewrite the complete operative measure.',
};

function buildRewritePrompt(measure, fullText, readingLevel, length, previous) {
  const target = readingTargets[readingLevel];
  const correction = previous
    ? `Your previous rewrite scored grade ${previous.grade} on the Flesch–Kincaid check. The requested range is grades ${target.minimum}–${target.maximum}. Revise it to fall inside that range: ${
        previous.grade > target.maximum
          ? 'use shorter sentences and simpler words to lower the grade level'
          : 'use somewhat more varied sentence structures and vocabulary to raise the grade level'
      }. Keep the same meaning and length requirement. Return valid JSON in the required format, with one source quote for every sentence.\n\nPrevious rewrite:\n${previous.text}\n\n`
    : '';

  return `${correction}Rewrite this California ballot measure in plain language for a reader at approximately grade ${target.grade} (${target.range}). Preserve the meaning, conditions, exceptions, dates, amounts, and other operative details. Do not add claims or commentary. Text inside [DELETED: ...] is being removed from the law; do not present it as operative. ${lengthInstructions[length]} Return only a valid JSON object with this shape: {"sentences":[{"text":"One sentence of the rewritten measure.","sourceQuote":"An exact, contiguous quote copied verbatim from the operative legal text that supports this sentence."}]}. Include a source quote for every sentence, use only wording that appears in operative text, and ensure each quote is long enough to identify its passage. Do not count sourceQuote text toward the requested word limit. Return no markdown or extra text.\n\n${measure.label} legal text:\n${fullText}`;
}

export default function MeasureDetail({ measure, onClose }) {
  const [readingLevel, setReadingLevel] = useState('everyday');
  const [length, setLength] = useState('headline');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [generationError, setGenerationError] = useState('');
  const [generationProgress, setGenerationProgress] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRetryingQualifierCheck, setIsRetryingQualifierCheck] = useState(false);
  const activeResult =
    generatedResult?.readingLevel === readingLevel && generatedResult?.length === length
      ? generatedResult
      : null;

  async function generateVersion() {
    setIsGenerating(true);
    setGenerationError('');
    setGenerationProgress('');
    const startedAt = performance.now();

    try {
      const fullText = await loadMeasureText(measure.id);
      const operativeSource = operativeText(fullText);
      const target = readingTargets[readingLevel];
      let previous = null;
      let best = null;
      let totalCost = 0;
      let allCostsReported = true;
      let attempts = 0;

      for (let attempt = 1; attempt <= MAX_REWRITE_ATTEMPTS; attempt += 1) {
        attempts = attempt;
        setGenerationProgress(
          `Generating and checking reading level (attempt ${attempt} of ${MAX_REWRITE_ATTEMPTS})…`,
        );
        const response = await globalThis.prog02OpenRouter.askModel(
          buildRewritePrompt(measure, fullText, readingLevel, length, previous),
        );
        const sentences = parseCitedSummary(response.choices?.[0]?.message?.content);
        const text = sentences.map((sentence) => sentence.text).join(' ');
        if (!text) throw new Error('The model returned an empty rewrite.');

        const reading = fleschKincaid(text);
        if (reading.grade === null) throw new Error('The rewrite could not be checked for reading level.');

        const cost = getReportedCost(response);
        if (cost === null) allCostsReported = false;
        else totalCost += cost;

        const candidate = { text, sentences, reading, grade: reading.grade };
        const distance =
          reading.grade < target.minimum
            ? target.minimum - reading.grade
            : Math.max(0, reading.grade - target.maximum);
        if (!best || distance < best.distance) best = { ...candidate, distance };

        if (reading.grade >= target.minimum && reading.grade <= target.maximum) {
          best = { ...candidate, distance: 0 };
          break;
        }
        previous = candidate;
      }

      let qualifierAudit = { status: 'skipped' };
      if (best.distance === 0) {
        setGenerationProgress('Reading level verified. Checking for dropped qualifiers…');
        try {
          const audit = await requestQualifierAudit(operativeSource, best.text, measure.label);
          qualifierAudit = audit.status === 'success'
            ? { status: 'success', value: audit.value }
            : { status: 'error', message: audit.message };
          if (audit.cost === null) allCostsReported = false;
          else totalCost += audit.cost;
        } catch (error) {
          qualifierAudit = {
            status: 'error',
            message: error instanceof Error ? error.message : String(error),
          };
        }
      }

      setGeneratedResult({
        text: best.text,
        sentences: best.sentences,
        reading: best.reading,
        originalReading: fleschKincaid(operativeSource),
        topics: countTopicMentions(operativeSource),
        sourceText: operativeSource,
        readingLevel,
        length,
        readingAttempts: attempts,
        readingTargetMet: best.distance === 0,
        qualifierAudit,
        durationMs: performance.now() - startedAt,
        cost: allCostsReported ? totalCost : null,
      });
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  }

  async function retryQualifierCheck() {
    if (!generatedResult || !generatedResult.readingTargetMet || isRetryingQualifierCheck) return;

    setIsRetryingQualifierCheck(true);
    try {
      const audit = await requestQualifierAudit(
        generatedResult.sourceText,
        generatedResult.text,
        measure.label,
      );
      setGeneratedResult((previous) => {
        if (!previous) return previous;
        const cost =
          audit.cost === null || previous.cost === null
            ? null
            : previous.cost + audit.cost;
        return {
          ...previous,
          qualifierAudit: audit.status === 'success'
            ? { status: 'success', value: audit.value }
            : { status: 'error', message: audit.message },
          cost,
        };
      });
    } catch (error) {
      setGeneratedResult((previous) => previous
        ? {
            ...previous,
            qualifierAudit: {
              status: 'error',
              message: error instanceof Error ? error.message : String(error),
            },
            cost: null,
          }
        : previous);
    } finally {
      setIsRetryingQualifierCheck(false);
    }
  }

  return (
    <main className="mx-auto w-[86vw] max-w-[1238px] pb-8 max-[700px]:w-auto max-[700px]:px-4">
      <header className="relative flex min-h-[clamp(85px,calc(8.44vw_-_1.5px),120px)] items-start pl-[clamp(36px,3.35vw,48px)] pt-[clamp(1px,calc(49.5px_-_3.37vw),15px)] max-[700px]:min-h-0 max-[700px]:pb-5">
        <button
          type="button"
          aria-label="Back to ballot measures"
          onClick={onClose}
          className="absolute left-0 top-0 text-[clamp(2rem,3.13vw,2.8rem)] leading-none hover:text-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black max-[700px]:top-2"
        >
          ×
        </button>
        <div className="flex items-start justify-between gap-6 max-[700px]:flex-col max-[700px]:gap-2">
          <div className="min-w-0 pt-[2px]">
            <h1 className="font-serif text-[clamp(1.7rem,2.5vw,2.25rem)] font-bold leading-[1.1]">
              {measure.label}
            </h1>
            <p className="mt-[clamp(8px,0.9vw,13px)] font-sans text-[clamp(0.75rem,1.11vw,1rem)] leading-[1.4]">
              {measure.title}
            </p>
          </div>
          <a
            href={measure.legalTextUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-[clamp(6px,1vw,14px)] flex min-h-[clamp(36px,3.06vw,44px)] shrink-0 items-center justify-center bg-[#d9d9d9] px-5 font-sans text-sm hover:bg-[#c9c9c9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black max-[700px]:mt-0"
          >
            Original Text
          </a>
        </div>
      </header>

      <ReadingLevelSelector
        readingLevel={readingLevel}
        onReadingLevelChange={(value) => {
          setReadingLevel(value);
          setGenerationError('');
        }}
        length={length}
        onLengthChange={(value) => {
          setLength(value);
          setGenerationError('');
        }}
        disabled={isGenerating || isRetryingQualifierCheck}
      />

      {(readingLevel === 'everyday' ||
        readingLevel === 'simplest' ||
        length === 'headline' ||
        length === 'short') && (
        <aside className="mt-[clamp(12px,1.04vw,15px)] flex min-h-[clamp(58px,6.32vw,91px)] items-center justify-center bg-[#f1dd9e] px-6 py-4 text-center font-sans text-[clamp(0.9rem,1.67vw,1.5rem)] leading-snug">
          Note: Lower reading level combined with a shorter summary can lead to a loss of information.
        </aside>
      )}

      <div className="mt-[clamp(8px,0.7vw,10px)]">
        <GenerationPreview
          measure={measure}
          readingLevel={readingLevel}
          length={length}
          onGenerate={generateVersion}
          isGenerating={isGenerating}
          generationProgress={generationProgress}
          hasGenerated={activeResult !== null}
          error={generationError}
        />
      </div>
      {activeResult && (
        <MeasureGenerationResult
          measure={measure}
          result={activeResult}
          onRetryQualifierCheck={retryQualifierCheck}
          isRetryingQualifierCheck={isRetryingQualifierCheck}
        />
      )}
    </main>
  );
}
