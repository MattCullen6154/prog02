const sections = [
  { id: 'measures', label: 'Understand a Measure' },
  { id: 'compare', label: 'Compare Both Sides' },
  { id: 'offices', label: 'Explain an Office' },
];

export default function PrimaryNavigation({ activeSection, onSectionChange }) {
  return (
    <nav
      aria-label="Main sections"
      className="flex min-h-[clamp(38px,3.75vw,54px)] items-stretch gap-1 border-b border-black/70 px-[6.3%] max-[700px]:overflow-x-auto max-[700px]:px-3"
    >
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          aria-current={activeSection === section.id ? 'page' : undefined}
          disabled={section.disabled}
          onClick={() => onSectionChange(section.id)}
          className={`shrink-0 px-[clamp(21px,2.08vw,30px)] font-sans text-[clamp(0.875rem,1.39vw,1.25rem)] leading-none transition-colors max-[700px]:px-4 ${
            activeSection === section.id
              ? 'bg-[#d9d9d9]'
              : section.disabled
                ? 'cursor-default bg-white'
                : 'bg-white hover:bg-[#eeeeee] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black'
          }`}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}
