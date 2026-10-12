import { useState } from 'react';
import GenerationPreview from './GenerationPreview.jsx';
import ReadingLevelSelector from './ReadingLevelSelector.jsx';

export default function MeasureDetail({ measure, onClose }) {
  const [readingLevel, setReadingLevel] = useState('everyday');
  const [length, setLength] = useState('headline');

  return (
    <main className="mx-auto w-[86vw] max-w-[1238px] pb-8 max-[700px]:w-auto max-[700px]:px-4">
      <header className="relative flex min-h-[clamp(85px,calc(8.44vw_-_1.5px),120px)] items-start pl-[clamp(36px,3.35vw,48px)] pt-[clamp(1px,calc(49.5px_-_3.37vw),15px)] max-[700px]:min-h-0 max-[700px]:pb-5">
        <button
          type="button"
          aria-label="Back to ballot measures"
          onClick={onClose}
          className="absolute left-0 top-0 text-[clamp(2rem,3.13vw,2.8rem)] leading-none hover:text-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black max-[700px]:top-2"
        >
          ×
        </button>
        <div className="flex items-start justify-between gap-6 max-[700px]:flex-col max-[700px]:gap-2">
          <div className="min-w-0">
            <h1 className="font-serif text-[clamp(1.7rem,2.5vw,2.25rem)] font-bold leading-[1.1]">
              {measure.label}
            </h1>
            <p className="mt-[clamp(8px,0.9vw,13px)] font-sans text-[clamp(0.75rem,1.11vw,1rem)] leading-[1.4]">
              {measure.title}
            </p>
          </div>
          <a
            href={measure.legalTextUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-[clamp(6px,1vw,14px)] flex min-h-[clamp(36px,3.06vw,44px)] shrink-0 items-center justify-center bg-[#d9d9d9] px-5 font-sans text-sm hover:bg-[#c9c9c9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black max-[700px]:mt-0"
          >
            Original Text
          </a>
        </div>
      </header>

      <ReadingLevelSelector
        readingLevel={readingLevel}
        onReadingLevelChange={setReadingLevel}
        length={length}
        onLengthChange={setLength}
      />

      <aside className="mt-[clamp(12px,1.04vw,15px)] flex min-h-[clamp(58px,6.32vw,91px)] items-center justify-center bg-[#f1dd9e] px-6 py-4 text-center font-sans text-[clamp(0.9rem,1.67vw,1.5rem)] leading-snug">
        Note: Lower reading level combined with a shorter summary can lead to a loss of information.
      </aside>

      <div className="mt-[clamp(8px,0.7vw,10px)]">
        <GenerationPreview
          measure={measure}
          readingLevel={readingLevel}
          length={length}
        />
      </div>
    </main>
  );
}
