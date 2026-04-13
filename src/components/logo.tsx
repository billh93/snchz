export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SNCHZ logo"
    >
      {/* Triangle: the delta, symbol of change */}
      <path
        d="M50 10 L90 82 L10 82 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Eye: the all-seeing, symbol of awareness */}
      <path
        d="M50 40 C40 40, 30 52, 30 52 C30 52, 40 64, 50 64 C60 64, 70 52, 70 52 C70 52, 60 40, 50 40Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Iris: the point of focus */}
      <circle cx="50" cy="52" r="5.5" fill="currentColor" />
    </svg>
  );
}
