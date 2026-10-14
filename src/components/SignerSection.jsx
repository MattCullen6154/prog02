function SignerList({ side, argumentsList }) {
  const signers = argumentsList
    .filter((argument) => argument.side === side)
    .flatMap((argument) =>
      (argument.signers || []).map((signer) => ({
        ...signer,
        documentType: argument.round,
      })),
    );
  const colorClasses =
    side === 'yes'
      ? 'border-[#8ed988] bg-[#d8f4d5]'
      : 'border-[#dfaaaa] bg-[#f4d5d5]';

  return (
    <div className={`min-w-0 border-2 p-[clamp(14px,1.4vw,20px)] ${colorClasses}`}>
      <h3
        className={`mb-3 font-sans text-[clamp(0.9rem,1.67vw,1.5rem)] ${
          side === 'yes' ? 'text-[#2c4b2a]' : 'text-[#714646]'
        }`}
      >
        URGES A {side.toUpperCase()} VOTE
      </h3>
      <ul className="space-y-3">
        {signers.map((signer, index) => (
          <li
            key={`${signer.name}-${signer.documentType}-${index}`}
            className="font-sans text-[clamp(0.78rem,1.25vw,1.125rem)] leading-[1.3]"
          >
            <p className="text-[#606060]">
              <strong className="text-black">{signer.name}</strong>
              {signer.title ? `, ${signer.title}` : ''}
            </p>
            {signer.organization && <p className="text-[#606060]">{signer.organization}</p>}
            <p className="text-[#606060]">
              — signed the {signer.documentType}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SignerSection({ argumentsList }) {
  return (
    <section className="bg-[#d9d9d9] p-[clamp(18px,1.75vw,25px)]">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
        <h2 className="font-sans text-[clamp(1.35rem,2.22vw,2rem)] leading-tight">Who signed</h2>
        <p className="font-sans text-[clamp(0.75rem,1.11vw,1rem)]">
          From the printed pages, no AI. The names and organizations are the state&apos;s, not ours.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-[clamp(14px,4vw,58px)] max-[700px]:grid-cols-1">
        {['yes', 'no'].map((side) => (
          <SignerList key={side} side={side} argumentsList={argumentsList} />
        ))}
      </div>
      <p className="mt-4 text-center font-sans text-[clamp(0.95rem,1.67vw,1.5rem)]">
        No organization or person signed for both sides.
      </p>
    </section>
  );
}
