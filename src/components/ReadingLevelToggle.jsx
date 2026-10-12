const readingLevels = [
  { id: 'as-written', label: 'As Written', detail: 'No AI' },
  { id: 'plain-english', label: 'Plain English', detail: '11th -13th Grade' },
  { id: 'everyday', label: 'Everyday', detail: '7th-9th Grade' },
  { id: 'simplest', label: 'Simplest', detail: '3rd-4th Grade' },
];

export default function ReadingLevelToggle({ value, onChange }) {
  return (
    <div role="group" aria-label="Reading level" className="grid grid-cols-2 sm:grid-cols-4">
      {readingLevels.map((level) => (
        <button
          key={level.id}
          type="button"
          aria-pressed={value === level.id}
          onClick={() => onChange(level.id)}
          className={`flex min-h-[clamp(70px,6.88vw,99px)] flex-col items-center justify-center gap-4 border border-black px-2 py-3 text-center font-sans text-[clamp(0.78rem,1.11vw,1rem)] leading-tight transition-colors focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-black ${
            value === level.id ? 'bg-[#dfaaaa]' : 'bg-[#d9d9d9] hover:bg-[#e6dedd]'
          }`}
        >
          <span>{level.label}</span>
          <span>{level.detail}</span>
        </button>
      ))}
    </div>
  );
}
