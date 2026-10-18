import { useEffect, useRef, useState } from 'react';
import { findSourceExcerpt, getCitationLabel } from '../utils/sourceCitations.js';

export default function SourceCitation({ sourceText, quote }) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);
  const passageRef = useRef(null);
  const location = findSourceExcerpt(sourceText, quote);
  const label = location ? getCitationLabel(sourceText, location.start) : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) passageRef.current?.scrollIntoView({ block: 'center' });
  }, [isOpen]);

  function renderSource() {
    if (!location) return sourceText;

    return (
      <>
        {sourceText.slice(0, location.start)}
        <mark ref={passageRef} className="rounded bg-[#83c9ec] px-1 text-[#123247] outline outline-2 outline-[#337fa5]">
          {sourceText.slice(location.start, location.end)}
        </mark>
        {sourceText.slice(location.end)}
      </>
    );
  }

  return (
    <>
      {location ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mx-1 inline-flex items-center rounded-md border border-[#8ccaeb] bg-[#bbe3f9] px-2 py-0.5 align-baseline text-xs font-medium text-[#173b50] hover:bg-[#a8d9f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#337fa5]"
          aria-label={`Open cited source passage: ${label}`}
        >
          Source: {label} ↗
        </button>
      ) : (
        <span
          className="mx-1 inline-flex items-center rounded-md border border-amber-500 bg-amber-50 px-2 py-0.5 align-baseline text-xs text-amber-900"
          title="The cited wording could not be matched exactly in the legal text."
        >
          ⚠ source not found
        </span>
      )}

      <dialog
        ref={dialogRef}
        aria-label="Cited legal text"
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
        className="m-auto max-h-[85vh] w-[min(90vw,900px)] max-w-none overflow-hidden border-2 border-[#8ccaeb] bg-[#bbe3f9] p-0 text-[#242333] shadow-xl backdrop:bg-black/50"
      >
        {isOpen && (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-[#8ccaeb] p-4">
              <div>
                <h2 className="font-semibold">Original legal text</h2>
                {label && <p className="mt-1 text-sm text-[#245c78]">Citation: {label}</p>}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="shrink-0 rounded border border-gray-400 bg-white px-3 py-1.5 text-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Close
              </button>
            </div>
            <div className="max-h-[calc(85vh-5rem)] overflow-auto p-4">
              {location ? (
                <p className="mb-3 rounded border border-[#5caed5] bg-[#dff3fc] p-3 text-sm">
                  Highlighted passage cited for this summary.
                </p>
              ) : (
                <p className="mb-3 rounded border border-amber-500 bg-amber-50 p-3 text-sm">
                  The cited wording could not be matched in the source text.
                </p>
              )}
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">
                {renderSource()}
              </pre>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
