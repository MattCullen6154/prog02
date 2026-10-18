export default function PromptDisclosure({ prompt, open, onToggle }) {
  return (
    <div className="mt-5">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="font-sans text-left text-sm font-bold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        {open ? '⌄ Hide the prompt that will be sent' : '> Show the prompt that will be sent'}
      </button>
      {open && (
        <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap border border-black/20 bg-white/70 p-3 font-sans text-xs leading-relaxed">
          {prompt}
        </pre>
      )}
    </div>
  );
}
