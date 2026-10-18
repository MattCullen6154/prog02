import { useEffect, useState } from 'react';
import '../../js/openrouter.js';

function getUsageSnapshot() {
  return globalThis.prog02OpenRouter.getUsageSnapshot();
}

function ModelInfoBar() {
  const [usage, setUsage] = useState(getUsageSnapshot);

  useEffect(() => {
    const updateUsage = (event) => setUsage(event.detail);
    globalThis.addEventListener(globalThis.prog02OpenRouter.usageEventName, updateUsage);
    setUsage(getUsageSnapshot());

    return () => {
      globalThis.removeEventListener(globalThis.prog02OpenRouter.usageEventName, updateUsage);
    };
  }, []);

  const cost = `$${usage.totalCost.toFixed(4)}${usage.unreportedCalls > 0 ? '+' : ''}`;

  return (
    <div className="flex min-h-[clamp(38px,3.68vw,53px)] w-[49vw] max-w-[703px] min-w-0 flex-none items-center justify-between gap-4 bg-[#9a9a9a] px-[clamp(14px,1.39vw,20px)] py-3 text-[clamp(0.72rem,1.11vw,1rem)] text-white max-[700px]:w-full max-[700px]:flex-none">
      <span className="truncate" title={usage.model}>Current model: {usage.model}</span>
      <span
        className="shrink-0"
        title={
          usage.unreportedCalls > 0
            ? `${usage.unreportedCalls} AI call(s) did not report a cost; the displayed total may be incomplete.`
            : 'Accumulated AI usage cost for this browser tab.'
        }
      >
        Cost: {cost}
      </span>
    </div>
  );
}

export default function SiteHeader() {
  return (
    <header className="flex min-h-[clamp(75px,7.3vw,105px)] items-center justify-between gap-8 bg-[#d9d9d9] px-[2%] py-[clamp(10px,1.25vw,18px)] max-[700px]:flex-col max-[700px]:items-stretch max-[700px]:gap-3 max-[700px]:px-5 max-[700px]:py-4">
      <p className="shrink-0 font-sans text-[clamp(1.05rem,1.67vw,1.5rem)] leading-none">Prog 02: Represent!</p>
      <ModelInfoBar />
    </header>
  );
}
