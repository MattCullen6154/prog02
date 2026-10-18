import PromptDisclosure from './PromptDisclosure.jsx';

function IllustrationResult({ office, result, costLabel }) {
  if (result.status === 'idle') return null;

  return (
    <>
      <div
        aria-live="polite"
        className="mt-4 flex min-h-[clamp(230px,25.56vw,368px)] items-center justify-center border-[3px] border-[#8ccaeb] bg-[#bbe3f9] p-4"
      >
        {result.status === 'loading' ? (
          <p className="text-center font-sans text-sm" role="status">Drawing an illustration…</p>
        ) : result.status === 'error' ? (
          <p className="text-center font-sans text-sm text-red-900" role="alert">{result.message}</p>
        ) : (
          <img
            src={result.src}
            alt={`AI-generated illustration for ${office.name}`}
            className="max-h-[clamp(220px,24vw,345px)] w-full object-contain"
          />
        )}
      </div>
      {result.status === 'success' && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <a
            href={result.src}
            download={`${office.id}-illustration.${result.mediaType.split('/')[1] || 'png'}`}
            className="inline-flex min-h-11 items-center border-[3px] border-[#8ccaeb] bg-[#bbe3f9] px-4 font-sans text-sm hover:bg-[#a8d8f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Download
          </a>
          <span className="bg-[#f9f4f4] px-3 py-2 font-sans text-xs leading-relaxed">
            Model: google/gemini-2.5-flash-image
            <br />
            Time: {(result.elapsedMs / 1000).toFixed(1)} s
            <br />
            Cost: {costLabel(result.cost)}
          </span>
        </div>
      )}
    </>
  );
}

export default function OfficeIllustration({
  office,
  prompt,
  showPrompt,
  onTogglePrompt,
  onGenerate,
  result,
  costLabel,
}) {
  return (
    <section className="min-w-0 bg-[#d9d9d9] p-[clamp(18px,1.81vw,26px)]">
      <h2 className="font-sans text-[clamp(1.5rem,2.5vw,2.25rem)] leading-tight">
        Generate an Illustration
      </h2>
      <p className="mt-2 font-sans text-sm leading-[1.35]">
        Generate a contextual, fictional scene about {office.name}.
      </p>
      <PromptDisclosure prompt={prompt} open={showPrompt} onToggle={onTogglePrompt} />
      <button
        type="button"
        aria-label="Generate illustration"
        onClick={onGenerate}
        disabled={result.status === 'loading'}
        className="mt-5 min-h-12 bg-[#dfaaaa] px-4 font-sans text-base hover:bg-[#d99a9a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-wait disabled:opacity-70"
      >
        {result.status === 'loading' ? 'Generating…' : 'Generate this version'}
      </button>
      <IllustrationResult office={office} result={result} costLabel={costLabel} />
    </section>
  );
}
