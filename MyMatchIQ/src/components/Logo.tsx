interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 48 }: LogoProps) {
  return (
    <img
      src="/my-match-iq-logo.png"
      alt="My Match IQ"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}