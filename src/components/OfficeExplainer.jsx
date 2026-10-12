import PromptDisclosure from './PromptDisclosure.jsx';

function ExplanationResult({ office, result, costLabel }) {
  if (result.status === 'idle') return null;

  return (
    <section
      aria-live="polite"
      className="mt-6 border-[3px] border-[#8ccaeb] bg-[#bbe3f9] p-[clamp(12px,1.25vw,18px)]"
    >
      {result.status === 'loading' ? (
        <p className="font-sans text-lg" role="status">Generating the office explainer…</p>
      ) : result.status === 'error' ? (
        <p className="font-sans text-sm text-red-900" role="alert">{result.message}</p>
      ) : (
        <>
          <header className="flex flex-wrap items-start justify-between gap-3 border-b border-black/50 pb-3">
            <h3 className="font-sans text-[clamp(1.1rem,1.67vw,1.5rem)]">AI Response</h3>
            <p className="font-sans text-xs">Explainer: {office.name}</p>
          </header>
          <div className="whitespace-pre-wrap py-4 font-sans text-sm leading-[1.4]">
            {result.content}
          </div>
          <footer className="border-t border-black/50 pt-3 font-sans text-xs leading-relaxed">
            Written by google/gemini-2.5-flash-lite. Nothing is official; information presented can
            be wrong. Please fact check important information.
            <div className="mt-3 flex justify-end">
              <span className="bg-[#f9f4f4] px-3 py-2">
                Time: {(result.elapsedMs / 1000).toFixed(1)} s
                <br />
                Cost: {costLabel(result.cost)}
              </span>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}

export default function OfficeExplainer({
  office,
  prompt,
  showPrompt,
  onTogglePrompt,
  onGenerate,
  result,
  costLabel,
}) {
  return (
    <section className="min-w-0 bg-[#d9d9d9] p-[clamp(18px,2.5vw,36px)]">
      <h2 className="font-sans text-[clamp(1.5rem,2.5vw,2.25rem)] leading-tight">
        Explain the Office
      </h2>
      <p className="mt-2 font-sans text-sm leading-[1.35]">
        Ask AI to explain what this office does, and add what this office does not control. This does
        not cost much at all.
      </p>
      <PromptDisclosure prompt={prompt} open={showPrompt} onToggle={onTogglePrompt} />
      <button
        type="button"
        onClick={onGenerate}
        disabled={result.status === 'loading'}
        className="mt-5 min-h-12 bg-[#dfaaaa] px-4 font-sans text-base hover:bg-[#d99a9a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-wait disabled:opacity-70"
      >
        {result.status === 'loading' ? 'Generating…' : 'Generate this version'}
      </button>
      <p className="mt-4 font-sans text-sm">One call to google/gemini-2.5-flash-lite</p>
      <ExplanationResult office={office} result={result} costLabel={costLabel} />
    </section>
  );
}
