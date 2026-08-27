import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  isLight?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true,
  isLight = false 
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 42, text: 'text-base', sub: 'text-xs' },
    lg: { icon: 54, text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 72, text: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Visual Emblem SVG inspired by Baunia Builders */}
      <div 
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-2 shadow-md ring-1 ring-blue-400/30 text-white shrink-0"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow"
        >
          {/* Architectural Building Structure & Shield */}
          <path 
            d="M50 8L88 28V72L50 92L12 72V28L50 8Z" 
            stroke="#93c5fd" 
            strokeWidth="3" 
            fill="url(#logoGrad)"
          />
          {/* Skyline / Towers */}
          <path 
            d="M32 68V42L44 34V68M44 68V26L56 18V68M56 68V38L68 46V68" 
            stroke="#ffffff" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Golden Foundation Arc */}
          <path 
            d="M26 74C38 80 62 80 74 74" 
            stroke="#fbbf24" 
            strokeWidth="3.5" 
            strokeLinecap="round"
          />
          {/* Central Star / Diamond */}
          <circle cx="50" cy="18" r="3" fill="#fbbf24" />
          
          <defs>
            <linearGradient id="logoGrad" x1="12" y1="8" x2="88" y2="92" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e40af" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className={`font-bold tracking-tight ${isLight ? 'text-white' : 'text-slate-900'} ${currentSize.text}`}>
            বাউনিয়া বিল্ডার্স
          </div>
          <div className={`font-semibold tracking-wider uppercase ${isLight ? 'text-blue-200' : 'text-blue-700'} ${currentSize.sub}`}>
            Baunia Builders
          </div>
        </div>
      )}
    </div>
  );
};
