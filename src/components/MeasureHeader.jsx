export default function MeasureHeader({ children }) {
  return (
    <header className="pt-[2px] max-[1200px]:pt-3">
      <h1 className="text-center font-sans text-[clamp(1.55rem,2.5vw,2.25rem)] font-semibold leading-tight">
        Understand the ballot, understand the issues
      </h1>
      <p className="ml-[6.25%] mt-[clamp(2rem,3.95vw,3.55rem)] max-w-[1054px] font-sans text-[clamp(1rem,1.39vw,1.25rem)] leading-[1.4] max-[700px]:ml-0">
        {children}
      </p>
    </header>
  );
}
