import { useState } from 'react';
import ArgumentCard from './ArgumentCard.jsx';
import PromptDisclosure from './PromptDisclosure.jsx';

function getSortedArguments(argumentsData) {
  return Object.entries(argumentsData)
    .map(([key, argument]) => ({ ...argument, key }))
    .sort((left, right) => {
      const roundOrder = left.round === right.round ? 0 : left.round === 'argument' ? -1 : 1;
      if (roundOrder !== 0) return roundOrder;
      return left.side === right.side ? 0 : left.side === 'yes' ? -1 : 1;
    });
}

export default function ArgumentAnalysis({ measure, summaries, status, error, onRetry, prompt }) {
  const argumentsList = getSortedArguments(measure.arguments);
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <section className="bg-[#d9d9d9] p-[clamp(18px,1.75vw,25px)]">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
        <h2 className="font-sans text-[clamp(1.35rem,2.22vw,2rem)] leading-tight">
          What the measure really does
        </h2>
        <p className="font-sans text-[clamp(0.75rem,1.11vw,1rem)]">
          Claims about what the measure requires, allows, changes or leaves alone.
        </p>
      </div>
      <div className="mt-3">
        <TypeLabel>On both sides</TypeLabel>
      </div>
      <PromptDisclosure
        prompt={prompt}
        open={showPrompt}
        onToggle={() => setShowPrompt((open) => !open)}
      />
      {status === 'loading' && (
        <p role="status" className="mt-3 font-sans text-sm">
          Generating neutral summaries of the printed arguments…
        </p>
      )}
      {status === 'error' && (
        <div role="alert" className="mt-3 flex flex-wrap items-center gap-3 font-sans text-sm">
          <p>AI wording could not be generated: {error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="border border-black bg-white px-3 py-1 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Try again
          </button>
        </div>
      )}
      <div className="mt-3 grid grid-cols-2 items-stretch gap-[clamp(12px,1.4vw,20px)] max-[760px]:grid-cols-1">
        {argumentsList.map((argument) => (
          <ArgumentCard
            key={argument.key}
            argument={argument}
            summary={summaries?.[argument.key]}
          />
        ))}
      </div>
    </section>
  );
}

function TypeLabel({ children }) {
  return (
    <span className="inline-flex min-h-7 items-center border border-black bg-white px-2 py-1 font-sans text-xs">
      {children}
    </span>
  );
}
