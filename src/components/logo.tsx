export function Logo({ className = "h-5" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2">
      {/* Property icon - two overlapping rectangles with arrow */}
      <svg
        className={className}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="4"
          width="10"
          height="12"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-gold"
        />
        <rect
          x="8"
          y="4"
          width="10"
          height="12"
          fill="currentColor"
          className="text-gold/20"
        />
        <path
          d="M14 10L17 10M17 10L15.5 8.5M17 10L15.5 11.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gold"
        />
      </svg>
      <span className="text-lg">
        <span className="font-semibold text-navy">Estate</span>
        <span className="font-semibold text-gold">Flow</span>
      </span>
    </div>
  );
}
