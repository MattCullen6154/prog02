import { useEffect, useState } from 'react';
import { getTopicEvidence } from '../utils/topicKeywords.js';
import { parseTopicExplanation } from '../utils/topicExplanation.js';
import PromptDisclosure from './PromptDisclosure.jsx';
import SourceCitation from './SourceCitation.jsx';
import TopicOpinion from './TopicOpinion.jsx';

export default function IssueExplanation({ measure, sourceText, topic }) {
  const [attempt, setAttempt] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [result, setResult] = useState({ status: 'loading', explanation: null, text: '' });

  useEffect(() => {
    let current = true;
    const excerpts = getTopicEvidence(sourceText, topic);

    if (excerpts.length === 0) {
      setResult({
        status: 'empty',
        text: `No tracked ${topic.label.toLowerCase()} keywords were found in the operative text. This rough count can miss relevant provisions.`,
      });
      return () => {
        current = false;
      };
    }

    setResult({ status: 'loading', text: '' });
    const prompt = `Analyze how ${measure.label} relates to "${topic.label}" using only the legal excerpts below. Return only a valid JSON object with this exact shape:
{
  "textSays": [
    {
      "text": "One neutral, factual summary sentence describing what the law says about this topic. Do not infer effects or include an opinion.",
      "sourceQuote": "An exact, contiguous quote copied from the legal excerpts that supports this sentence."
    }
  ],
  "opinion": {
    "leaning": "strongly_favorable | favorable | slightly_favorable | mixed | slightly_unfavorable | unfavorable | strongly_unfavorable | unclear",
    "rationale": {
      "text": "A separate AI opinion assessing whether the measure is likely favorable or unfavorable for this topic, based only on these excerpts. Explain the reasoning without presenting it as fact.",
      "sourceQuote": "An exact, contiguous quote copied from the legal excerpts that supports this reasoning."
    },
    "pointsInFavor": [{"text": "A concise reason supported by the excerpts.", "sourceQuote": "An exact quote supporting this point."}],
    "pointsAgainst": [{"text": "A concise concern supported by the excerpts.", "sourceQuote": "An exact quote supporting this point."}],
    "uncertainties": ["Important uncertainty or effect not stated in the excerpts, or an empty array."]
  }
}

Choose exactly one leaning. Use "mixed" when meaningful benefits and harms are balanced, and "unclear" when the excerpts do not support a defensible direction. Favorable means likely beneficial to the named issue; unfavorable means likely harmful to it. Assess only the effect on "${topic.label}", not whether the measure is good overall. Keep the factual summary and opinion separate. Do not add outside facts. Do not treat keyword frequency as evidence of impact. Do not invent benefits or harms when the legal text does not support them. Every factual summary sentence, rationale, and listed point must include a short exact quote from the provided legal excerpts. Copy sourceQuote verbatim, preserving wording and punctuation; do not paraphrase or combine separate excerpts. Use empty arrays for points or uncertainties when appropriate. If the text is not directly related, say so and use "unclear".\n\n${excerpts
      .map((excerpt, index) => `Excerpt ${index + 1}:\n${excerpt}`)
      .join('\n\n')}`;
    setPromptText(prompt);

    globalThis.prog02OpenRouter
      .askModel(prompt)
      .then((response) => {
        const explanation = parseTopicExplanation(response.choices?.[0]?.message?.content);
        if (current) setResult({ status: 'success', explanation, text: '' });
      })
      .catch((error) => {
        if (current) setResult({ status: 'error', text: error.message });
      });

    return () => {
      current = false;
    };
  }, [attempt, measure.label, sourceText, topic]);

  return (
    <section aria-live="polite" aria-busy={result.status === 'loading'}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#8ccaeb] pb-3">
        <h3 className="font-sans text-xl font-semibold">{topic.label}</h3>
        <span className="bg-[#f1dd9e] px-3 py-1 text-xs font-semibold">
          {result.status === 'empty' ? 'Keyword check' : 'AI-generated explanation'}
        </span>
      </div>
      {promptText && (
        <PromptDisclosure
          prompt={promptText}
          open={showPrompt}
          onToggle={() => setShowPrompt((open) => !open)}
        />
      )}
      {result.status === 'loading' ? (
        <p className="py-5">Generating a focused explanation…</p>
      ) : result.status === 'error' ? (
        <div role="alert" className="py-5">
          <p>{result.text}</p>
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
            className="mt-4 bg-[#d9d9d9] px-4 py-2 hover:bg-[#c9c9c9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {result.status === 'success' ? (
            <>
              <section className="pt-5">
                <h4 className="font-sans text-sm font-semibold italic uppercase tracking-wide">
                  What the text says
                </h4>
                <div className="space-y-3 pt-2 leading-relaxed">
                  {result.explanation.textSays.map((sentence, index) => (
                    <p key={`${sentence.text}-${index}`}>
                      {sentence.text}
                      <SourceCitation sourceText={sourceText} quote={sentence.sourceQuote} />
                    </p>
                  ))}
                </div>
              </section>
              <TopicOpinion opinion={result.explanation.opinion} sourceText={sourceText} />
            </>
          ) : (
            <p className="whitespace-pre-wrap py-5 leading-relaxed">{result.text}</p>
          )}
          {result.status === 'success' && (
            <button
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
              className="mt-4 bg-[#d9d9d9] px-4 py-2 hover:bg-[#c9c9c9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Generate again
            </button>
          )}
        </>
      )}
      <p className="border-t border-[#8ccaeb] pt-3 text-xs">
        AI summaries can be incomplete. Check the original legal text before drawing conclusions.
      </p>
    </section>
  );
}
