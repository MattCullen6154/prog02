import { useEffect, useRef, useState } from 'react';

const qualifierStatus = {
  preserved: 'Preserved',
  partially_preserved: 'Check wording',
  not_visible: 'Not visible in this rendering',
};

export default function QualifierCheck({ audit, onRetry, isRetrying }) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);
  const missing = audit.status === 'success'
    ? audit.value.qualifiers.filter((item) => item.status !== 'preserved')
    : [];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const summary = audit.status === 'success'
    ? missing.length > 0
      ? `${missing.length} qualifier${missing.length === 1 ? '' : 's'} to review`
      : 'No dropped qualifiers identified'
    : audit.status === 'skipped'
      ? 'Not run: reading level was outside target'
      : audit.status === 'loading'
        ? 'Scanning the measure…'
        : audit.status === 'error'
          ? 'Check could not be completed'
          : 'Qualifier check';

  return (
    <div
      aria-live="polite"
      className="mt-5"
    >
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full flex-wrap items-center justify-between gap-2 border-2 border-[#e4d397] bg-[#f6eccb] px-4 py-3 text-left text-sm leading-relaxed hover:bg-[#f3e6b8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a7024]"
        aria-haspopup="dialog"
      >
        <span>
          <strong>Qualifier check:</strong> {summary}
        </span>
        <span className="shrink-0 font-semibold underline">View details</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Qualifier check details"
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
        className="m-auto max-h-[85vh] w-[min(90vw,800px)] max-w-none overflow-hidden border-2 border-[#e4d397] bg-[#f6eccb] p-0 text-[#242333] shadow-xl backdrop:bg-black/50"
      >
        {isOpen && (
          <>
            <header className="flex items-center justify-between gap-4 border-b border-[#e4d397] p-4">
              <div>
                <h2 className="font-sans text-lg font-semibold">Qualifier check</h2>
                <p className="mt-1 text-sm">{summary}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="shrink-0 border border-gray-400 bg-white px-3 py-1.5 text-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Close
              </button>
            </header>

            <div className="max-h-[calc(85vh-5rem)] overflow-y-auto p-4 text-[clamp(0.9rem,1.25vw,1.125rem)] leading-relaxed">
              {audit.status === 'success' && (
                <>
                  <section>
                    <h3 className="font-semibold">Qualifiers used in the legal text</h3>
                    {audit.value.qualifiers.length > 0 ? (
                      <ul className="mt-2 list-disc space-y-3 pl-5 text-sm">
                        {audit.value.qualifiers.map((item, index) => (
                          <li key={`${item.phrase}-${index}`}>
                            <strong>{item.phrase} — {qualifierStatus[item.status]}.</strong>{' '}
                            {item.sourceContext}
                            {item.rewriteEvidence && <> Rewrite: “{item.rewriteEvidence}”</>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm">No important qualifiers were identified.</p>
                    )}
                  </section>

                  <section className="mt-5 border-t border-[#e4d397] pt-4">
                    <h3 className="font-semibold">Qualifiers not fully used in the response</h3>
                    {missing.length > 0 ? (
                      <ul className="mt-2 list-disc space-y-3 pl-5 text-sm">
                        {missing.map((item, index) => (
                          <li key={`${item.phrase}-${index}`}>
                            <strong>{item.phrase} — {qualifierStatus[item.status]}.</strong>{' '}
                            {item.sourceContext}
                            {item.rewriteEvidence && <> Rewrite: “{item.rewriteEvidence}”</>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm">No missing or partially preserved qualifiers identified.</p>
                    )}
                  </section>

                  <p className="mt-4 border-t border-[#e4d397] pt-3 text-sm">
                    {audit.value.summary}
                  </p>
                </>
              )}

              {audit.status === 'skipped' && (
                <p>Not run because the rewrite did not meet the selected reading-level range.</p>
              )}
              {audit.status === 'loading' && (
                <p role="status">Scanning the legal text and checking the rewrite for dropped qualifiers…</p>
              )}
              {audit.status === 'error' && (
                <div role="alert">
                  <p>{audit.message}</p>
                  <button
                    type="button"
                    onClick={onRetry}
                    disabled={isRetrying}
                    className="mt-3 bg-[#d9d9d9] px-4 py-2 text-sm hover:bg-[#c9c9c9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-wait disabled:opacity-70"
                  >
                    {isRetrying ? 'Checking…' : 'Retry qualifier check'}
                  </button>
                </div>
              )}

              <p className="mt-4 border-t border-[#e4d397] pt-3 text-sm">
                This automated check can miss qualifiers or misread their meaning. Compare with the
                original legal text before relying on the summary.
              </p>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
