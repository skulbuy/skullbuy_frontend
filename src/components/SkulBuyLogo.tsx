import React from 'react';

interface SkulBuyLogoProps {
  className?: string;
  badge?: string;
  showBadge?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
}

export const SkulBuyLogo: React.FC<SkulBuyLogoProps> = ({
  className = '',
  badge = 'FUTMINNA',
  showBadge = true,
  size = 'md',
  variant = 'full',
}) => {
  // Height presets for the official logo
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8 sm:h-9',
    lg: 'h-11 sm:h-12',
    xl: 'h-16 sm:h-20',
  };

  const logoSrc = '/assets/aistudio/1sk_7de89084.png';

  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      <img
        src={logoSrc}
        alt="SkulBuy"
        className={`${sizeClasses[size]} w-auto object-contain shrink-0`}
        loading="eager"
      />
      {showBadge && badge && (
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200/80 shrink-0 self-center">
          {badge}
        </span>
      )}
    </div>
  );
};
