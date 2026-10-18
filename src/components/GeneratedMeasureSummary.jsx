const levelTargets = {
  'plain-english': { label: '11th–13th grade', minimum: 11, maximum: 13 },
  everyday: { label: '7th–9th grade', minimum: 7, maximum: 9 },
  simplest: { label: '3rd–4th grade', minimum: 3, maximum: 4 },
};

const lengthTargets = {
  headline: { label: '25 words or less', maximum: 25 },
  short: { label: '75–100 words', minimum: 75, maximum: 100 },
  standard: { label: '250–300 words', minimum: 250, maximum: 300 },
  complete: { label: 'No cap' },
};

function gradeStatus(grade, target) {
  if (grade === null) return 'Could not measure';
  if (grade < target.minimum) return 'Below target';
  if (grade > target.maximum) return 'Above target';
  return 'Within target';
}

function wordCountStatus(wordCount, target) {
  if (target.maximum === undefined) return 'No word limit';
  if (wordCount > target.maximum) return `Above ${target.maximum} words`;
  if (target.minimum !== undefined && wordCount < target.minimum) {
    return `Below ${target.minimum} words`;
  }
  return 'Within target';
}

export default function GeneratedMeasureSummary({
  measure,
  result,
  onRetryQualifierCheck,
  isRetryingQualifierCheck,
}) {
  const gradeTarget = levelTargets[result.readingLevel];
  const lengthTarget = lengthTargets[result.length];

  return (
    <section
      aria-labelledby="generated-summary-heading"
      className="border-2 border-[#8ccaeb] bg-[#bbe3f9] p-[clamp(16px,2vw,28px)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 id="generated-summary-heading" className="font-sans text-[clamp(1.4rem,2.5vw,2.25rem)]">
          AI Response
        </h2>
        <a
          href={measure.legalTextUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-[#d9d9d9] px-4 py-2 text-sm hover:bg-[#c9c9c9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Original Text
        </a>
      </div>

      <div className="my-4 grid gap-2 border-y border-[#8ccaeb] bg-white/70 p-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
        <p>
          <span className="block font-semibold">Reading level</span>
          Target: {gradeTarget.label}
          <br />
          Actual: {result.reading.grade ?? 'Not available'}
          {result.reading.grade !== null
            ? ` — ${result.readingTargetMet ? gradeStatus(result.reading.grade, gradeTarget) : `Outside target after ${result.readingAttempts} attempts`}`
            : ''}
          {result.readingAttempts > 1 && (
            <>
              <br />
              Checked {result.readingAttempts} rewrites
            </>
          )}
        </p>
        <p>
          <span className="block font-semibold">Word count</span>
          Target: {lengthTarget.label}
          <br />
          Actual: {result.reading.words} words — {wordCountStatus(result.reading.words, lengthTarget)}
        </p>
        <p>
          <span className="block font-semibold">Original legal text</span>
          Grade {result.originalReading.grade ?? 'not available'}
        </p>
        <p>
          <span className="block font-semibold">Request</span>
          Time: {(result.durationMs / 1000).toFixed(1)} s
          <br />
          Cost: {typeof result.cost === 'number' ? `$${result.cost.toFixed(4)}` : 'Not reported'}
        </p>
      </div>

      <p className="mb-2 text-sm italic">AI-generated wording. Compare it with the original legal text.</p>
      <div className="max-h-[42rem] space-y-3 overflow-y-auto font-sans text-[clamp(0.95rem,1.25vw,1.125rem)] leading-relaxed">
        {result.sentences.map((sentence, index) => (
          <p key={`${sentence.text}-${index}`}>
            {sentence.text}
            <SourceCitation sourceText={result.sourceText} quote={sentence.sourceQuote} />
          </p>
        ))}
      </div>
      <QualifierCheck
        audit={result.qualifierAudit}
        onRetry={onRetryQualifierCheck}
        isRetrying={isRetryingQualifierCheck}
      />
    </section>
  );
}
import QualifierCheck from './QualifierCheck.jsx';
import SourceCitation from './SourceCitation.jsx';
