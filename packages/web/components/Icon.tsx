'use client';

import { designTokens } from '@h4shed/skill-frontend-design';

interface IconProps {
  name: keyof typeof designTokens.icons;
  size?: number;
  className?: string;
  color?: string;
}

export default function Icon({ name, size = 24, className = '', color }: IconProps) {
  const iconPath = designTokens.icons[name];
  if (!iconPath) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={color ? className : `text-current ${className}`}
      style={color ? { color } : undefined}
    >
      <path d={iconPath} />
    </svg>
  );
}
