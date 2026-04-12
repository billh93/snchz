export function PearLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 128"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Pear logo"
    >
      {/* Leaf */}
      <path d="M58 12 C64 4 76 2 74 14 C68 12 60 14 58 12Z" />
      {/* Stem */}
      <path
        d="M50 20 Q51 10 54 14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Body with bite on upper right */}
      <path
        d="
          M50 22
          C34 22 26 32 26 44
          C26 56 10 70 8 86
          C4 108 26 126 50 126
          C74 126 96 108 92 86
          C90 70 74 56 74 44
          C74 36 72 30 68 26
          C64 32 60 28 62 24
          C58 22 54 22 50 22
          Z
        "
      />
    </svg>
  );
}
