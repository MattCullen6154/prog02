const readingLevelDetails = {
  'as-written': 'the original legal language',
  'plain-english': 'plain English for an 11th–13th grade reading level',
  everyday: 'a rewrite at grade 7–9',
  simplest: 'a rewrite at grade 3–4',
};

const lengthDetails = {
  headline: '25 words or less',
  short: '75–100 words',
  standard: '250–300 words',
  complete: 'no word limit',
};

const lengthLabels = {
  headline: 'Headline',
  short: 'Short',
  standard: 'Standard',
  complete: 'Complete',
};

const levelLabels = {
  'as-written': 'As Written',
  'plain-english': 'Plain English',
  everyday: 'Everyday',
  simplest: 'Simplest',
};

export default function GenerationPreview({
  measure,
  readingLevel,
  length,
  onGenerate,
  isGenerating,
  generationProgress,
  hasGenerated,
  error,
}) {
  const isAiRewrite = readingLevel !== 'as-written';
  const description = isAiRewrite
    ? `This sends the full legal text (about ${measure.wordCount.toLocaleString('en-US')} words) to google/gemini-2.5-flash-lite and asks for ${readingLevelDetails[readingLevel]}, ${lengthDetails[length]}. It takes a few seconds — longer for a measure this size — and the cost is added to the session total.`
    : `This displays the original legal text (${measure.wordCount.toLocaleString('en-US')} words) without an AI rewrite.`;

  return (
    <section aria-live="polite" className="bg-[#d9d9d9] px-[clamp(16px,1.04vw,15px)] py-[clamp(14px,1.39vw,20px)]">
      <h2 className="font-sans text-[clamp(1.375rem,2.22vw,2rem)] leading-tight">
        {levelLabels[readingLevel]} - {lengthLabels[length]}:{' '}
        {hasGenerated ? '1 Response Generated' : 'not generated yet'}
      </h2>
      <p className="mt-3 font-sans text-[clamp(0.85rem,1.04vw,0.94rem)] leading-[1.35]">
        {description}
      </p>
      {isAiRewrite ? (
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="mt-[clamp(14px,1.39vw,20px)] inline-flex min-h-[clamp(48px,4.45vw,64px)] items-center bg-[#dfaaaa] px-[clamp(16px,1.25vw,18px)] font-sans text-[clamp(1.06rem,1.67vw,1.5rem)] leading-none hover:bg-[#d99a9a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-wait disabled:opacity-70"
        >
          {isGenerating
            ? generationProgress || 'Generating…'
            : hasGenerated
              ? 'Generate again'
              : 'Generate this version'}
        </button>
      ) : (
        <a
          href={measure.legalTextUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-[clamp(14px,1.39vw,20px)] inline-flex min-h-[clamp(48px,4.45vw,64px)] items-center bg-[#dfaaaa] px-[clamp(16px,1.25vw,18px)] font-sans text-[clamp(1.06rem,1.67vw,1.5rem)] leading-none hover:bg-[#d99a9a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          View original text
        </a>
      )}
      {error && (
        <p role="alert" className="mt-3 font-sans text-sm text-red-800">
          Could not generate this version: {error}
        </p>
      )}
    </section>
  );
}
