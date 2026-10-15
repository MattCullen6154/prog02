const qualifierStatus = {
  preserved: 'Preserved',
  partially_preserved: 'Check wording',
  not_visible: 'Not visible in this rendering',
};

export default function QualifierCheck({ audit, onRetry, isRetrying }) {
  const missing = audit.status === 'success'
    ? audit.value.qualifiers.filter((item) => item.status !== 'preserved')
    : [];

  return (
    <aside
      aria-live="polite"
      className="mt-5 border-2 border-[#f1dd9e] bg-[#f6eccb] p-[clamp(12px,1.4vw,20px)] text-[clamp(0.9rem,1.25vw,1.125rem)] leading-relaxed"
    >
      <p>
        <strong>Qualifier check:</strong>{' '}
        {audit.status === 'success'
          ? `The legal text uses: ${audit.value.qualifiers.length > 0
              ? audit.value.qualifiers.map((item) => item.phrase).join(', ')
              : 'no important qualifiers identified by the model'}.`
          : audit.status === 'skipped'
            ? 'Not run because the rewrite did not meet the selected reading-level range.'
            : audit.status === 'loading'
              ? 'Scanning the legal text and checking the rewrite for dropped qualifiers…'
              : 'The qualifier check could not be completed.'}
      </p>

      {audit.status === 'success' && (
        <>
          {missing.length > 0 ? (
            <p className="mt-2">
              <strong>Not fully visible in this rendering:</strong>{' '}
              {missing.map((item) => item.phrase).join(', ')}.
            </p>
          ) : (
            <p className="mt-2">
              <strong>No dropped qualifiers identified.</strong>
            </p>
          )}
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            {audit.value.qualifiers.map((item, index) => (
              <li key={`${item.phrase}-${index}`}>
                <strong>{item.phrase} — {qualifierStatus[item.status]}.</strong>{' '}
                {item.sourceContext}
                {item.rewriteEvidence && <> Rewrite: “{item.rewriteEvidence}”</>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">{audit.value.summary}</p>
        </>
      )}

      {audit.status === 'error' && (
        <div role="alert" className="mt-2">
          <p>{audit.message}</p>
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="mt-2 bg-[#d9d9d9] px-4 py-2 text-sm hover:bg-[#c9c9c9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-wait disabled:opacity-70"
          >
            {isRetrying ? 'Checking…' : 'Retry qualifier check'}
          </button>
        </div>
      )}

      <p className="mt-3 border-t border-[#e4d397] pt-2 text-sm">
        This automated check can miss qualifiers or misread their meaning. Compare with the original
        legal text before relying on the summary.
      </p>
    </aside>
  );
}
