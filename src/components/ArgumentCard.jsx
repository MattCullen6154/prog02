function TypeBadge({ children, className = 'border-black bg-white' }) {
  return (
    <span className={`inline-flex min-h-7 items-center border px-2 py-1 font-sans text-xs ${className}`}>
      {children}
    </span>
  );
}

export default function ArgumentCard({ argument, summary }) {
  const isYes = argument.side === 'yes';
  const sideName = isYes ? 'YES' : 'NO';
  const cardColors = isYes
    ? 'border-[#8ed988] bg-[#d8f4d5]'
    : 'border-[#dfaaaa] bg-[#f4d5d5]';

  return (
    <article className={`flex min-w-0 flex-col border-2 p-[clamp(12px,1.04vw,15px)] ${cardColors}`}>
      <div className="flex flex-wrap items-center gap-2">
        <TypeBadge>{argument.round === 'argument' ? 'Argument' : 'Rebuttal'}</TypeBadge>
        {argument.round === 'rebuttal' && (
          <TypeBadge className="border-black bg-[#f1dd9e]">New in rebuttal</TypeBadge>
        )}
        <TypeBadge className="border-[#8ccaeb] bg-[#bbe3f9]">AI Generated Wording</TypeBadge>
      </div>
      <p className="mt-2 font-sans text-xs font-semibold text-black/70">
        {argument.heading || `Argument urging a ${sideName} vote`}
      </p>
      <div className="mt-3 flex-1 font-sans text-[clamp(1rem,2.22vw,2rem)] leading-[1.2]">
        {summary ? (
          summary
        ) : (
          <span className="text-base text-black/70">Preparing AI wording…</span>
        )}
      </div>
      <details className="mt-4 border-t border-black/20 pt-3">
        <summary className="w-fit cursor-pointer list-none border border-[#8ccaeb] bg-white px-2 py-1 font-sans text-xs hover:bg-[#eff9ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
          Original Text
        </summary>
        <div className="mt-3 max-h-72 overflow-y-auto bg-white/70 p-3">
          <h4 className="font-sans text-sm font-semibold">{argument.heading}</h4>
          <p className="mt-2 whitespace-pre-line font-sans text-sm leading-relaxed">
            {argument.text}
          </p>
        </div>
      </details>
    </article>
  );
}
