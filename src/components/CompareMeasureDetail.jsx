import { useEffect, useState } from 'react';
import '../../js/openrouter.js';
import ArgumentAnalysis from './ArgumentAnalysis.jsx';
import ArgumentOverview from './ArgumentOverview.jsx';
import CompareMeasureHeader from './CompareMeasureHeader.jsx';
import SignerSection from './SignerSection.jsx';
import { summarizeArguments } from './argumentSummaries.js';

export default function CompareMeasureDetail({ measure, onClose }) {
  const [generation, setGeneration] = useState({ status: 'loading' });
  const [retryCount, setRetryCount] = useState(0);
  const argumentsList = Object.values(measure.arguments);

  useEffect(() => {
    let isCurrent = true;
    setGeneration({ status: 'loading' });
    summarizeArguments(measure)
      .then((summaries) => {
        if (isCurrent) setGeneration({ status: 'success', summaries });
      })
      .catch((error) => {
        if (isCurrent) {
          setGeneration({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown model error.',
          });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [measure, retryCount]);

  return (
    <main className="mx-auto w-[90vw] max-w-[1295px] space-y-[clamp(16px,1.75vw,25px)] pb-8 max-[700px]:w-auto max-[700px]:px-4">
      <CompareMeasureHeader measure={measure} onClose={onClose} />
      <aside className="flex min-h-[clamp(58px,6.32vw,91px)] items-center bg-[#f1dd9e] px-[clamp(16px,2.2vw,32px)] py-4 font-sans text-[clamp(0.95rem,1.67vw,1.5rem)] leading-snug">
        Note: Arguments on this page are authors&apos; opinions and have not been fact checked by any official agency.
      </aside>
      <ArgumentOverview argumentsList={argumentsList} guideUrl={measure.official.url} />
      <SignerSection argumentsList={argumentsList} />
      <ArgumentAnalysis
        measure={measure}
        summaries={generation.status === 'success' ? generation.summaries : null}
        status={generation.status}
        error={generation.status === 'error' ? generation.message : null}
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    </main>
  );
}
