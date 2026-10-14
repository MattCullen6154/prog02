export default function TopicProgressBar({ label, value, maxValue }) {
  const percentage = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;

  return (
    <div
      role="progressbar"
      aria-label={`${label}: ${value} keyword mentions`}
      aria-valuemin={0}
      aria-valuemax={maxValue}
      aria-valuenow={value}
      className="h-3 w-full overflow-hidden border border-black bg-[#d9d9d9]"
    >
      <div
        className="h-full bg-[#c6a54c] transition-[width]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
