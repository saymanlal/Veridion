export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
      <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#c29943" strokeWidth="4.5" />
      <line x1="4" y1="50" x2="96" y2="50" stroke="#c29943" strokeWidth="1" opacity="0.2" />
      <path d="M50 4 C 65 25, 65 75, 50 96 C 35 75, 35 25, 50 4 Z" fill="none" stroke="#c29943" strokeWidth="1.5" opacity="0.35" />
      <path d="M28 32 L50 72 L72 32" fill="none" stroke="#c29943" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
