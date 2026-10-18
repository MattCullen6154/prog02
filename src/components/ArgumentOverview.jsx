function SideOverview({ side, argumentsForSide }) {
  const mainArgument = argumentsForSide.find((argument) => argument.round === 'argument');
  const rebuttal = argumentsForSide.find((argument) => argument.round === 'rebuttal');
  const sideName = side === 'yes' ? 'YES' : 'NO';

  return (
    <div
      className={`border-2 p-[clamp(14px,1.4vw,20px)] ${
        side === 'yes'
          ? 'border-[#8ed988] bg-[#d8f4d5]'
          : 'border-[#dfaaaa] bg-[#f4d5d5]'
      }`}
    >
      <h3
        className={`font-sans text-[clamp(0.9rem,1.67vw,1.5rem)] ${
          side === 'yes' ? 'text-[#2c4b2a]' : 'text-[#714646]'
        }`}
      >
        URGES A {sideName} VOTE
      </h3>
      <div className="mt-3 space-y-2 font-sans text-[clamp(0.82rem,1.25vw,1.125rem)] leading-snug">
        {mainArgument && (
          <p>
            <strong>Its argument</strong> — {mainArgument.wordCount.toLocaleString('en-US')} words
          </p>
        )}
        {rebuttal && (
          <p>
            <strong>Its rebuttal</strong> — {rebuttal.wordCount.toLocaleString('en-US')} words
            <span className="block text-[0.9em]">answers the other side&apos;s argument</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function ArgumentOverview({ argumentsList, guideUrl }) {
  return (
    <section className="bg-[#d9d9d9] p-[clamp(18px,1.75vw,25px)]">
      <h2 className="font-sans text-[clamp(1.35rem,2.22vw,2rem)] leading-tight">
        Who Wrote What
      </h2>
      <p className="mt-2 max-w-[1205px] font-sans text-[clamp(0.9rem,1.67vw,1.5rem)] leading-[1.35]">
        Each side gets one argument and one rebuttal. The rebuttal is written by the side that did
        NOT write the argument it answers, so the guide&apos;s &quot;Rebuttal to the Argument in
        Favor&quot; is written by the side urging a NO vote.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-[clamp(14px,4vw,58px)] max-[700px]:grid-cols-1">
        {['yes', 'no'].map((side) => (
          <SideOverview
            key={side}
            side={side}
            argumentsForSide={argumentsList.filter((argument) => argument.side === side)}
          />
        ))}
      </div>
      <a
        href={guideUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex min-h-11 items-center justify-center bg-[#d3c2c0] px-6 font-sans text-[clamp(0.9rem,1.25vw,1.125rem)] hover:bg-[#c7b3b0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        Read the 4 printed documents
      </a>
    </section>
  );
}
