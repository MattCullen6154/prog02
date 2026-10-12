import MeasureCard from './MeasureCard.jsx';

export const ballotMeasures = [
  {
    id: 'prop-4',
    legalTextUrl: 'https://vig.cdn.sos.ca.gov/2026/general/pdf/prop4-text-proposed-laws.pdf',
    label: 'Prop 4',
    wordCount: 1822,
    title: 'REPEALS PROHIBITION AGAINST PUBLIC FUNDING OF ELECTION CAMPAIGNS. LEGISLATIVE STATUTE.',
    summary:
      'Repeals prohibition on state and local governments offering public funding of candidate election campaigns. Public funding programs may not use funds earmarked for education, transportation, or public safety.',
  },
  {
    id: 'prop-40',
    legalTextUrl: 'https://vig.cdn.sos.ca.gov/2026/general/pdf/prop40-text-proposed-laws.pdf',
    label: 'Prop 40',
    wordCount: 12690,
    title: 'IMPOSES ONE-TIME TAX ON CERTAIN TAXPAYERS. INITIATIVE CONSTITUTIONAL AMENDMENT AND STATUTE.',
    summary:
      'Imposes 5% tax on certain taxpayers with assets over $1 billion; revenue primarily for health care. Exempts revenues from constitutional requirements for school funding and spending limit.',
  },
  {
    id: 'prop-43',
    legalTextUrl: 'https://vig.cdn.sos.ca.gov/2026/general/pdf/prop43-text-proposed-laws.pdf',
    label: 'Prop 43',
    wordCount: 214,
    title:
      'LIMITS VOTERS’ ABILITY TO RAISE REVENUES FOR LOCAL GOVERNMENT SERVICES. LEGISLATIVE CONSTITUTIONAL AMENDMENT.',
    summary:
      'Limits voters’ ability to pass voter-proposed local special taxes by increasing percentage of votes needed to approve such ballot measures from a majority (over 50%) to two-thirds, beginning January 1, 2027.',
  },
  {
    id: 'prop-45',
    legalTextUrl: 'https://vig.cdn.sos.ca.gov/2026/general/pdf/prop45-text-proposed-laws.pdf',
    label: 'Prop 45',
    wordCount: 14034,
    title: 'MODIFIES ENVIRONMENTAL REVIEW FOR CERTAIN PROJECTS. INITIATIVE STATUTE.',
    summary:
      'Amends California Environmental Quality Act (CEQA) to expedite environmental review for certain projects (including most housing, transportation, water, and health projects) by setting deadlines to complete environmental review and resolve lawsuits challenging project approvals.',
  },
];

export default function MeasureList({ onSelect }) {
  return (
    <section
      aria-label="2026 California ballot measures"
      className="mt-16 space-y-[clamp(1rem,1.94vw,1.75rem)] max-[1200px]:mt-7 max-[700px]:mt-6"
    >
      {ballotMeasures.map((measure) => (
        <MeasureCard key={measure.id} measure={measure} onSelect={onSelect} />
      ))}
    </section>
  );
}
