import { useEffect, useState } from 'react';
import { getTopicEvidence } from '../utils/topicKeywords.js';
import { getModelText } from '../utils/modelResponse.js';

export default function IssueExplanation({ measure, sourceText, topic }) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ status: 'loading', text: '' });

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
    const prompt = `Explain how the legal text below relates to "${topic.label}" for ${measure.label}. Use only the provided excerpts, summarize relevant provisions in 2–4 concise sentences, and do not infer effects not stated in the text. If the connection is not direct, say so. Do not give an opinion or introduce outside facts.\n\n${excerpts
      .map((excerpt, index) => `Excerpt ${index + 1}:\n${excerpt}`)
      .join('\n\n')}`;

    globalThis.prog02OpenRouter
      .askModel(prompt)
      .then((response) => {
        const text = getModelText(response);
        if (!text) throw new Error('The model returned an empty explanation. Please try again.');
        if (current) setResult({ status: 'success', text });
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
          <p className="whitespace-pre-wrap py-5 leading-relaxed">{result.text}</p>
          {result.status === 'success' && (
            <button
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
              className="mb-4 bg-[#d9d9d9] px-4 py-2 hover:bg-[#c9c9c9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
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
