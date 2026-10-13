import MeasureHeader from './MeasureHeader.jsx';
import MeasureList from './MeasureList.jsx';

export default function CompareBothSides({ onSelect }) {
  return (
    <main className="ml-[8.4vw] w-[80.3vw] max-w-[1156px] pb-8 max-[700px]:ml-0 max-[700px]:w-auto max-[700px]:px-5">
      <MeasureHeader>
        <span className="block max-[700px]:inline">
          Below are 4 real measures from the 2026 California ballot. Pick one and see common arguments{' '}
        </span>
        <span className="block max-[700px]:inline">
          and who supports either side. All AI responses are marked as such, based on the real readings which{' '}
        </span>
        <span className="block max-[700px]:inline">can be easily viewed.</span>
      </MeasureHeader>
      <MeasureList onSelect={onSelect} />
    </main>
  );
}
