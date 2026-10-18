import { useState } from 'react';
import GeneratedMeasureSummary from './GeneratedMeasureSummary.jsx';
import IssueExplanation from './IssueExplanation.jsx';
import TopicProgressBar from './TopicProgressBar.jsx';

function IssueImpactSection({ topics, onExplain, selectedTopic }) {
  const sortedTopics = [...topics].sort((left, right) => right.count - left.count);
  const maxCount = Math.max(0, ...sortedTopics.map((topic) => topic.count));

  return (
    <section className="bg-[#d9d9d9] p-[clamp(16px,2vw,28px)]">
      <h2 className="font-sans text-[clamp(1.4rem,2.2vw,2rem)]">Your Issues</h2>
      <p className="mt-3 mb-5 leading-relaxed">
        Keyword mentions are a rough signal of which issues appear in this measure—not a guarantee of
        real-world impact. Choose Explain to explore an issue.
      </p>

      <div className="space-y-3">
        {sortedTopics.map((topic) => (
          <article key={topic.id} className="bg-[#dfaaaa] p-[clamp(14px,1.7vw,22px)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-sans text-lg font-medium">{topic.label}</h3>
                {maxCount > 0 && topic.count === maxCount && (
                  <span className="mt-2 inline-flex bg-[#f1dd9e] px-2 py-1 text-xs font-semibold">
                    Most mentioned here
                  </span>
                )}
              </div>
              <button
                type="button"
                aria-expanded={selectedTopic?.id === topic.id}
                aria-controls="issue-explanation"
                onClick={() => onExplain(topic)}
                className="shrink-0 px-2 py-1 text-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Explain &gt;
              </button>
            </div>
            <p className="mt-3 text-sm leading-snug">{topic.description}</p>
            <div className="mt-3">
              <TopicProgressBar label={topic.label} value={topic.count} maxValue={maxCount} />
            </div>
            <p className="mt-2 text-xs">
              {topic.count.toLocaleString('en-US')} keyword {topic.count === 1 ? 'mention' : 'mentions'}
            </p>
          </article>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed">
        Counts are based on the measure’s operative text and a fixed keyword list. They do not determine
        whether a measure helps or harms an issue.
      </p>
    </section>
  );
}

export default function MeasureGenerationResult({
  measure,
  result,
  onRetryQualifierCheck,
  isRetryingQualifierCheck,
}) {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <div className="mt-3 space-y-5">
      <GeneratedMeasureSummary
        measure={measure}
        result={result}
        onRetryQualifierCheck={onRetryQualifierCheck}
        isRetryingQualifierCheck={isRetryingQualifierCheck}
      />
      <div className="grid items-start gap-5 min-[1000px]:grid-cols-[1.23fr_1fr]">
        <IssueImpactSection
          topics={result.topics}
          onExplain={setSelectedTopic}
          selectedTopic={selectedTopic}
        />
        <aside
          id="issue-explanation"
          className="border-2 border-[#8ccaeb] bg-[#bbe3f9] p-[clamp(16px,2vw,28px)]"
        >
          {selectedTopic ? (
            <IssueExplanation
              key={`${measure.id}-${selectedTopic.id}`}
              measure={measure}
              sourceText={result.sourceText}
              topic={selectedTopic}
            />
          ) : (
            <div className="min-h-48">
              <h2 className="font-sans text-[clamp(1.4rem,2.2vw,2rem)]">Issue explanation</h2>
              <p className="mt-4 leading-relaxed">
                Select Explain next to an issue to request an AI-generated explanation grounded in
                relevant passages from the measure.
              </p>
              <p className="mt-4 text-sm">
                No issue explanation is generated until you choose one.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
