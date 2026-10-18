export default function MeasureCard({ measure, onSelect }) {
  return (
    <article className="bg-[#d9d9d9] px-5 py-[14px]">
      <div className="flex min-h-[clamp(62px,calc(8.65vw_-_26.6px),98px)] flex-col justify-between gap-2 max-[700px]:min-h-0">
        <div className="flex flex-wrap items-baseline gap-x-7 gap-y-1">
          <h2 className="font-serif text-[clamp(1.35rem,2.22vw,2rem)] font-bold leading-none">
            {measure.label}
          </h2>
          <p className="font-sans text-[clamp(0.7rem,1.11vw,1rem)] leading-none">
            {measure.wordCount.toLocaleString('en-US')} words
          </p>
        </div>
        <div className="flex items-end justify-between gap-5 max-[700px]:flex-col max-[700px]:items-stretch max-[700px]:gap-2">
          <p className="max-w-[calc(100%-6rem)] font-sans text-[clamp(0.72rem,1.11vw,1rem)] leading-[1.45] max-[700px]:max-w-none">
            {measure.title}
          </p>
          <button
            type="button"
            onClick={() => onSelect(measure)}
            className="shrink-0 font-sans text-[clamp(0.7rem,1.11vw,1rem)] leading-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black max-[700px]:self-end"
          >
            Open &gt;
          </button>
        </div>
      </div>
    </article>
  );
}
