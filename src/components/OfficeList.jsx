import OfficeCard from './OfficeCard.jsx';

export default function OfficeList({ offices, onSelect }) {
  return (
    <section
      aria-label="Offices on the ballot"
      className="mt-[clamp(0.5rem,0.7vw,0.625rem)] space-y-[clamp(1rem,1.74vw,1.56rem)]"
    >
      {offices.map((office) => (
        <OfficeCard key={office.id} office={office} onSelect={onSelect} />
      ))}
    </section>
  );
}
