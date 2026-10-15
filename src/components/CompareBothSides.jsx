import { useState } from 'react';
import MeasureHeader from './MeasureHeader.jsx';
import MeasureList from './MeasureList.jsx';

export default function CompareBothSides({ onSelect }) {
  const [loadError, setLoadError] = useState(null);

  async function openMeasure(measure) {
    setLoadError(null);
    try {
      const { default: datapack } = await import('../../data/datapack.json');
      const sourceMeasure = datapack.measures.find((item) => item.id === measure.id);
      if (!sourceMeasure) {
        throw new Error(`Ballot measure ${measure.id} is missing from the data pack.`);
      }

      onSelect({
        ...measure,
        official: sourceMeasure.official,
        arguments: sourceMeasure.arguments,
      });
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load this measure.');
    }
  }

  return (
    <main className="text-center mx-auto w-[80.3vw] max-w-[1156px] pb-8 max-[700px]:w-auto max-[700px]:px-5">
      <MeasureHeader>
        <span className="block max-[700px]:inline">
          Below are 4 real measures from the 2026 California ballot. Pick one and see common arguments{' '}
        </span>
        <span className="block max-[700px]:inline">
          and who supports either side. All AI responses are marked as such, based on the real readings which{' '}
        </span>
        <span className="block max-[700px]:inline">can be easily viewed.</span>
      </MeasureHeader>
      {loadError && (
        <p role="alert" className="mt-4 font-sans text-sm text-red-800">
          Could not open the measure: {loadError}
        </p>
      )}
      <MeasureList onSelect={openMeasure} />
    </main>
  );
}
