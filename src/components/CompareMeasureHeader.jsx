export default function CompareMeasureHeader({ measure, onClose }) {
  return (
    <header className="relative flex min-h-[clamp(85px,8.4vw,120px)] items-start justify-between gap-6 pl-[clamp(36px,3.35vw,48px)] pt-[clamp(1px,calc(49.5px_-_3.37vw),15px)] max-[700px]:min-h-0 max-[700px]:flex-col max-[700px]:gap-3 max-[700px]:pb-4">
      <button
        type="button"
        aria-label="Back to measures"
        onClick={onClose}
        className="absolute left-0 top-0 text-[clamp(2rem,3.13vw,2.8rem)] leading-none hover:text-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black max-[700px]:top-1"
      >
        ×
      </button>
      <div className="min-w-0">
        <h1 className="font-serif text-[clamp(1.7rem,2.5vw,2.25rem)] font-semibold leading-tight">
          {measure.label}
        </h1>
        <p className="mt-2 font-sans text-[clamp(0.75rem,1.11vw,1rem)] leading-[1.4]">
          {measure.title}
        </p>
      </div>
      <a
        href={measure.legalTextUrl}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-[clamp(36px,3.06vw,44px)] shrink-0 items-center justify-center bg-[#d9d9d9] px-5 font-sans text-sm hover:bg-[#c9c9c9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        Original Text
      </a>
    </header>
  );
}
