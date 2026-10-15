import SourceCitation from './SourceCitation.jsx';

const leaningDisplay = {
  strongly_favorable: {
    label: 'Strongly favorable',
    className: 'border-[#438b57] bg-[#bfe5c4] text-[#183c22]',
  },
  favorable: {
    label: 'Leans favorable',
    className: 'border-[#69ad72] bg-[#d8f4d5] text-[#24452a]',
  },
  slightly_favorable: {
    label: 'Slightly favorable',
    className: 'border-[#9ac78f] bg-[#e8f4dc] text-[#34452a]',
  },
  mixed: {
    label: 'Mixed',
    className: 'border-[#b89a4d] bg-[#f6eccb] text-[#544522]',
  },
  slightly_unfavorable: {
    label: 'Slightly unfavorable',
    className: 'border-[#d49b78] bg-[#f5dfce] text-[#583923]',
  },
  unfavorable: {
    label: 'Leans unfavorable',
    className: 'border-[#cc8179] bg-[#f2d1cb] text-[#562a26]',
  },
  strongly_unfavorable: {
    label: 'Strongly unfavorable',
    className: 'border-[#a95252] bg-[#eabbbb] text-[#4e1f1f]',
  },
  unclear: {
    label: 'Unclear',
    className: 'border-[#a5a5a5] bg-[#e5e5e5] text-[#383838]',
  },
};

function OpinionPoints({ title, points, emptyText, sourceText }) {
  return (
    <div>
      <h4 className="font-sans text-sm font-semibold italic uppercase tracking-wide">{title}</h4>
      {points.length > 0 ? (
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-snug">
          {points.map((point, index) => (
            <li key={`${title}-${index}`}>
              {point.text}
              <SourceCitation sourceText={sourceText} quote={point.sourceQuote} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm">{emptyText}</p>
      )}
    </div>
  );
}

export default function TopicOpinion({ opinion, sourceText }) {
  const leaning = leaningDisplay[opinion.leaning];

  return (
    <section className="mt-5 border-2 border-[#c6a54c] bg-[#f6eccb] p-[clamp(14px,1.7vw,22px)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="border-2 border-black bg-[#f1dd9e] px-3 py-1.5 text-sm font-semibold">
          AI Opinion
        </span>
        <span className={`border-2 px-3 py-1.5 text-sm font-semibold ${leaning.className}`}>
          {leaning.label}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[#7d682f]">
        This is the AI’s opinion about the measure’s likely effect on this issue. It is not stated in
        the law, may rely on interpretation, and can be wrong.
      </p>
      <p className="mt-4 text-sm leading-relaxed">
        {opinion.rationale.text}
        <SourceCitation sourceText={sourceText} quote={opinion.rationale.sourceQuote} />
      </p>
      <div className="mt-4 space-y-4">
        <OpinionPoints
          title="Points in favor"
          points={opinion.pointsInFavor}
          emptyText="None identified in the provided text."
          sourceText={sourceText}
        />
        <OpinionPoints
          title="Points against"
          points={opinion.pointsAgainst}
          emptyText="None identified in the provided text."
          sourceText={sourceText}
        />
      </div>
      {opinion.uncertainties.length > 0 && (
        <p className="mt-4 border-t border-[#c6a54c] pt-3 text-sm">
          <span className="font-semibold">Uncertain or not stated: </span>
          {opinion.uncertainties.join(' ')}
        </p>
      )}
    </section>
  );
}
