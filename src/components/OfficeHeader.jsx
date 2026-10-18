export default function OfficeHeader({ office, onClose }) {
  return (
    <header className="relative flex min-h-[clamp(85px,9.1vw,131px)] items-start justify-between gap-6 pt-[clamp(8px,2vw,29px)] max-[700px]:min-h-0 max-[700px]:flex-col max-[700px]:pb-5">
      <button
        type="button"
        aria-label="Back to offices"
        onClick={onClose}
        className="absolute left-[-4px] top-[clamp(4px,0.9vw,13px)] text-[clamp(2rem,3.33vw,3rem)] leading-none hover:text-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        ×
      </button>
      <div className="min-w-0 pl-[clamp(36px,3.35vw,48px)]">
        <h1 className="font-serif text-[clamp(1.7rem,2.5vw,2.25rem)] font-bold leading-[1.1]">
          {office.name}
        </h1>
        <p className="mt-[clamp(8px,0.9vw,13px)] font-sans text-[clamp(0.75rem,1.11vw,1rem)] leading-[1.4]">
          {office.jurisdiction}
        </p>
      </div>
      <a
        href="#office-handout"
        className="mt-[clamp(2px,0.8vw,12px)] flex min-h-[clamp(36px,3.06vw,44px)] shrink-0 items-center justify-center bg-[#d9d9d9] px-5 font-sans text-sm hover:bg-[#c9c9c9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black max-[700px]:ml-[clamp(36px,3.35vw,48px)] max-[700px]:mt-0"
      >
        Original Text
      </a>
    </header>
  );
}
