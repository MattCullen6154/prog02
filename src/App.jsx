import { useEffect, useState } from 'react';
import CompareMeasureDetail from './components/CompareMeasureDetail.jsx';
import CompareBothSides from './components/CompareBothSides.jsx';
import MeasureDetail from './components/MeasureDetail.jsx';
import MeasureList from './components/MeasureList.jsx';
import OfficeDetail from './components/OfficeDetail.jsx';
import OfficePage from './components/OfficePage.jsx';
import PrimaryNavigation from './components/PrimaryNavigation.jsx';
import SiteHeader from './components/SiteHeader.jsx';

export default function App() {
  const [selectedMeasure, setSelectedMeasure] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [activeSection, setActiveSection] = useState('measures');

  useEffect(() => {
    document.title = selectedOffice
      ? `${selectedOffice.name} | Prog 02: Represent!`
      : selectedMeasure
        ? `${selectedMeasure.label}${activeSection === 'compare' ? ' — Compare Both Sides' : ''} | Prog 02: Represent!`
      : activeSection === 'offices'
        ? 'Explain an Office | Prog 02: Represent!'
        : activeSection === 'compare'
          ? 'Compare Both Sides | Prog 02: Represent!'
        : 'Understand a Measure | Prog 02: Represent!';
  }, [activeSection, selectedMeasure, selectedOffice]);

  return (
    <div className="min-h-screen bg-white text-black">
      <SiteHeader />
      {selectedOffice ? (
        <OfficeDetail
          office={selectedOffice}
          onClose={() => setSelectedOffice(null)}
        />
      ) : selectedMeasure ? (
        activeSection === 'compare' ? (
          <CompareMeasureDetail
            measure={selectedMeasure}
            onClose={() => setSelectedMeasure(null)}
          />
        ) : (
          <MeasureDetail measure={selectedMeasure} onClose={() => setSelectedMeasure(null)} />
        )
      ) : (
        <>
          <PrimaryNavigation
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          {activeSection === 'offices' ? (
            <OfficePage onSelect={setSelectedOffice} />
          ) : activeSection === 'compare' ? (
            <CompareBothSides onSelect={setSelectedMeasure} />
          ) : (
            <main className="mx-auto w-[80.3vw] max-w-[1156px] pb-8 max-[700px]:w-auto max-[700px]:px-5">
              <header className="pt-[2px] max-[1200px]:pt-3">
                <h1 className="text-center font-sans text-[clamp(1.55rem,2.5vw,2.25rem)] font-semibold leading-tight">
                  Understand the ballot, understand the issues
                </h1>
                <p className="mt-[clamp(2rem,3.95vw,3.55rem)] font-sans text-[clamp(1rem,1.39vw,1.25rem)] leading-[1.4]">
                  <span className="block">
                    Below are 4 real measures from the 2026 California ballot. Pick one, decide on the
                    reading level and length,
                  </span>
                  <span className="block">
                    and see how it affects you and what you care about. All AI responses are marked as
                    such, based on the real
                  </span>
                  <span className="block">readings which can be easily viewed.</span>
                </p>
              </header>
              <MeasureList onSelect={setSelectedMeasure} />
            </main>
          )}
        </>
      )}
    </div>
  );
}
