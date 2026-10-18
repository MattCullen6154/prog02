const lengths = [
  { id: 'headline', label: 'Headline', detail: '25 Words or Less' },
  { id: 'short', label: 'Short', detail: '75-100 Words' },
  { id: 'standard', label: 'Standard', detail: '250-300 Words' },
  { id: 'complete', label: 'Complete', detail: 'No Cap' },
];

export default function LengthToggle({ value, onChange, disabled = false }) {
  return (
    <div role="group" aria-label="Summary length" className="grid grid-cols-2 sm:grid-cols-4">
      {lengths.map((length) => (
        <button
          key={length.id}
          type="button"
          disabled={disabled}
          aria-pressed={value === length.id}
          onClick={() => onChange(length.id)}
          className={`flex min-h-[clamp(70px,6.88vw,99px)] flex-col items-center justify-center gap-4 border border-black px-2 py-3 text-center font-sans text-[clamp(0.78rem,1.11vw,1rem)] leading-tight transition-colors focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-black disabled:cursor-wait disabled:opacity-70 ${
            value === length.id ? 'bg-[#dfaaaa]' : 'bg-[#d9d9d9] hover:bg-[#e6dedd]'
          }`}
        >
          <span>{length.label}</span>
          <span>{length.detail}</span>
        </button>
      ))}
    </div>
  );
}
