export default function OfficeCard({ office, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(office)}
      aria-label={`Open ${office.name}`}
      className="flex min-h-[clamp(84px,7.36vw,106px)] w-full items-center justify-between gap-4 bg-[#d9d9d9] px-[clamp(18px,1.875vw,27px)] text-left transition-colors hover:bg-[#cfcfcf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      <span className="min-w-0 font-sans text-[clamp(1.25rem,2.22vw,2rem)] leading-tight">
        {office.name}
      </span>
      <span className="mb-[clamp(0.5rem,1.8vw,1.625rem)] shrink-0 self-end font-sans text-[clamp(0.75rem,1.11vw,1rem)] leading-normal">
        Open &gt;
      </span>
    </button>
  );
}
