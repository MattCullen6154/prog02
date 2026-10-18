export default function OfficeSourceCard({ office }) {
  return (
    <section
      id="office-handout"
      aria-label="Office information from the handout"
      className="bg-[#d9d9d9] px-[clamp(18px,1.46vw,21px)] pb-[clamp(16px,1.67vw,24px)] pt-[clamp(12px,0.83vw,12px)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/60 pb-[clamp(10px,0.9vw,13px)]">
        <h2 className="font-serif text-[clamp(1.125rem,2.22vw,2rem)] font-bold">
          FROM THE HANDOUT
        </h2>
        <span className="font-sans text-[clamp(0.85rem,1.67vw,1.5rem)]">
          no AI, direct from the data pack
        </span>
      </div>
      <p className="mt-[clamp(12px,1.25vw,18px)] font-sans text-[clamp(0.9rem,1.11vw,1rem)] leading-[1.35]">
        {office.description}
      </p>
      <p className="mt-[clamp(12px,1.67vw,24px)] text-center font-sans text-[clamp(0.8rem,1.39vw,1.25rem)] leading-[1.35]">
        The handout says nothing more about this office. The AI explainer below fills in the rest.
      </p>
    </section>
  );
}
