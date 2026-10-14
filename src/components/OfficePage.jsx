import datapack from '../../data/datapack.json';
import OfficeList from './OfficeList.jsx';

function OfficePageHeader() {
  return (
    <header className="pt-[2px] max-[1200px]:pt-3">
      <h1 className="text-center font-sans text-[clamp(1.55rem,2.5vw,2.25rem)] font-semibold leading-tight">
        Understand the ballot, understand the issues
      </h1>
      <p className="mt-[clamp(1.5rem,2.78vw,2.5rem)] min-h-[clamp(0px,8.33vw,120px)] pl-[clamp(0px,2.64vw,38px)] font-sans text-[clamp(1rem,1.39vw,1.25rem)] leading-[1.4]">
        <span className="block">
          Below are 4 real measures from the 2026 California ballot. Pick one, decide on the reading
          level and length,
        </span>
        <span className="block">
          and see how it affects you and what you care about. All AI responses are marked as such,
          based on the real
        </span>
        <span className="block">readings which can be easily viewed.</span>
      </p>
    </header>
  );
}

export default function OfficePage({ onSelect }) {
  return (
    <main className="mx-auto w-[80.3vw] max-w-[1156px] pb-8 max-[700px]:w-auto max-[700px]:px-5">
      <OfficePageHeader />
      <OfficeList offices={datapack.offices} onSelect={onSelect} />
    </main>
  );
}
