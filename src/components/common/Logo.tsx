import React from 'react';
import { useApp } from '../../context/AppContext';
import defaultLogo from '../../assets/images/baunia_builders_logo_1787927051112.jpg';

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
  const { settings } = useApp();
  const logoSrc = settings?.logoUrl || defaultLogo;

  const sizeMap = {
    sm: { icon: 36, text: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 46, text: 'text-base', sub: 'text-xs' },
    lg: { icon: 60, text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 80, text: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Baunia Builders Logo Image */}
      <div 
        className="relative flex items-center justify-center rounded-xl overflow-hidden bg-white p-0.5 shadow-md ring-1 ring-slate-200/80 shrink-0"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <img 
          src={logoSrc} 
          alt="বাউনিয়া বিল্ডার্স লোগো" 
          className="w-full h-full object-contain rounded-lg"
          referrerPolicy="no-referrer"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className={`font-bold tracking-tight ${isLight ? 'text-white' : 'text-slate-900'} ${currentSize.text}`}>
            {settings?.nameBn || 'বাউনিয়া বিল্ডার্স'}
          </div>
          <div className={`font-semibold tracking-wider uppercase ${isLight ? 'text-amber-300' : 'text-blue-800'} ${currentSize.sub}`}>
            {settings?.nameEn || 'Baunia Builders'}
          </div>
        </div>
      )}
    </div>
  );
};
