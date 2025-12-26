import React from 'react';
import { Platform } from '../types';
import { PLATFORMS } from '../constants';
import * as Icons from 'lucide-react';

interface PlatformSelectorProps {
  currentPlatformId: string;
  onSelect: (id: string) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ currentPlatformId, onSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {PLATFORMS.map((platform) => {
        const IconComponent = (Icons as any)[platform.iconName] || Icons.HelpCircle;
        const isActive = currentPlatformId === platform.id;

        return (
          <button
            key={platform.id}
            onClick={() => onSelect(platform.id)}
            className={`
              relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
              ${isActive 
                ? 'bg-slate-800 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/50' 
                : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'}
            `}
          >
            <IconComponent 
              size={20} 
              className={`transition-colors duration-300 ${isActive ? platform.accentColor : 'text-slate-500'}`} 
            />
            <span>{platform.name}</span>
            
            {/* Active Indicator Dot */}
            {isActive && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${platform.accentColor.replace('text-', 'bg-')}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${platform.accentColor.replace('text-', 'bg-')}`}></span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;