interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 48 }: LogoProps) {
  // Simple SVG logo with heart icon
  const logoSvg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M24 42C24 42 8 28 8 18C8 12.477 12.477 8 18 8C20.5 8 22.5 9 24 10.5C25.5 9 27.5 8 30 8C35.523 8 40 12.477 40 18C40 28 24 42 24 42Z"
        fill="url(#gradient)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="gradient" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ec4899" />
          <stop offset="1" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
    </svg>
  );

  return logoSvg;
}