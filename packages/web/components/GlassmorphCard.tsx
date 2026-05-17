'use client';

interface GlassmorphCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassmorphCard({ children, className = '', onClick }: GlassmorphCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        backdrop-blur-[22px] bg-gradient-to-br from-[#050508] to-[#0a0a0f]
        border border-white/8
        rounded-[24px] p-6
        shadow-[0_24px_80px_rgba(0,0,0,0.45),inset_0_0_28px_rgba(168,85,247,0.06)]
        hover:border-white/15 transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
