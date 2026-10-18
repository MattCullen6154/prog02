import LengthToggle from './LengthToggle.jsx';
import ReadingLevelToggle from './ReadingLevelToggle.jsx';

export default function ReadingLevelSelector({
  readingLevel,
  onReadingLevelChange,
  length,
  onLengthChange,
  disabled = false,
}) {
  return (
    <section aria-label="Summary options" className="bg-[#d3c2c0] px-[clamp(22px,3.85vw,55px)] py-[clamp(20px,1.74vw,25px)]">
      <fieldset className="min-w-0 border-0 p-0">
        <legend className="mb-[clamp(14px,2.3vw,33px)] font-sans text-[clamp(0.9rem,1.11vw,1rem)] font-semibold leading-none">
          Reading Level
        </legend>
        <ReadingLevelToggle value={readingLevel} onChange={onReadingLevelChange} disabled={disabled} />
      </fieldset>
      <fieldset className="mt-[clamp(14px,1.39vw,20px)] min-w-0 border-0 p-0">
        <legend className="mb-[clamp(14px,2.3vw,33px)] font-sans text-[clamp(0.9rem,1.11vw,1rem)] font-semibold leading-none">
          Length
        </legend>
        <LengthToggle value={length} onChange={onLengthChange} disabled={disabled} />
      </fieldset>
    </section>
  );
}
