import { useState } from 'react';
import '../../js/openrouter.js';
import OfficeExplainer from './OfficeExplainer.jsx';
import OfficeHeader from './OfficeHeader.jsx';
import OfficeIllustration from './OfficeIllustration.jsx';
import OfficeSourceCard from './OfficeSourceCard.jsx';
import { buildOfficeImagePrompt, buildOfficePrompt, getModelText } from './officePrompts.js';

function costLabel(cost) {
  return typeof cost === 'number' ? `$${cost.toFixed(4)}` : 'Not reported';
}

export default function OfficeDetail({ office, onClose }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [explanation, setExplanation] = useState({ status: 'idle' });
  const [illustration, setIllustration] = useState({ status: 'idle' });
  const explanationPrompt = buildOfficePrompt(office);
  const imagePrompt = buildOfficeImagePrompt(office);

  async function generateExplanation() {
    setExplanation({ status: 'loading' });
    const startedAt = performance.now();

    try {
      const data = await globalThis.prog02OpenRouter.askModel(explanationPrompt);
      const content = getModelText(data.choices?.[0]?.message?.content);
      if (!content) throw new Error('The model returned an empty explanation.');
      setExplanation({
        status: 'success',
        content,
        elapsedMs: performance.now() - startedAt,
        cost: data.usage?.cost,
      });
    } catch (error) {
      setExplanation({ status: 'error', message: error.message });
    }
  }

  async function generateIllustration() {
    setIllustration({ status: 'loading' });
    const startedAt = performance.now();

    try {
      const image = await globalThis.prog02OpenRouter.generateImage(imagePrompt);
      setIllustration({
        status: 'success',
        ...image,
        elapsedMs: performance.now() - startedAt,
      });
    } catch (error) {
      setIllustration({ status: 'error', message: error.message });
    }
  }

  return (
    <main className="mx-auto w-[85.35vw] max-w-[1229px] pb-8 max-[700px]:w-auto max-[700px]:px-4">
      <OfficeHeader office={office} onClose={onClose} />
      <OfficeSourceCard office={office} />
      <div className="mt-[clamp(18px,2.43vw,35px)] grid grid-cols-[1.35fr_1fr] items-stretch gap-[clamp(14px,1.6vw,23px)] max-[850px]:grid-cols-1">
        <OfficeExplainer
          office={office}
          prompt={explanationPrompt}
          showPrompt={showPrompt}
          onTogglePrompt={() => setShowPrompt((current) => !current)}
          onGenerate={generateExplanation}
          result={explanation}
          costLabel={costLabel}
        />
        <OfficeIllustration
          office={office}
          prompt={imagePrompt}
          showPrompt={showImagePrompt}
          onTogglePrompt={() => setShowImagePrompt((current) => !current)}
          onGenerate={generateIllustration}
          result={illustration}
          costLabel={costLabel}
        />
      </div>
    </main>
  );
}
