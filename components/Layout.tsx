
import React from 'react';
import { AppConfig } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  config: AppConfig;
}

export const Layout: React.FC<LayoutProps> = ({ children, config }) => {
  const primaryTailwind = config.primaryColor || 'green';
  
  return (
    <div className={`min-h-screen w-full bg-${primaryTailwind}-100 relative flex flex-col items-center justify-center font-['Press_Start_2P'] py-8 px-4 transition-colors duration-500`}>
      
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-hearts z-0 opacity-60 pointer-events-none"></div>
      
      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="flex justify-between items-end mb-2 px-2">
            <div className="flex gap-1">
                <div className={`w-2 h-2 bg-${primaryTailwind}-700`}></div>
                <div className={`w-2 h-2 bg-${primaryTailwind}-600`}></div>
                <div className={`w-2 h-2 bg-${primaryTailwind}-500`}></div>
            </div>
            <span className={`text-[10px] text-${primaryTailwind}-900 font-bold uppercase`}>{config.adminName}'S QUEST</span>
        </div>

        {/* The Card */}
        <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0_rgba(0,0,0,0.1)] min-h-[600px] rounded-sm flex flex-col relative overflow-hidden">
           {/* Top Bar inside card */}
           <div className={`bg-${primaryTailwind}-700 text-white p-2 border-b-4 border-gray-900 flex justify-between items-center`}>
              <span className="text-xs">♥ {config.partnerName.toUpperCase()}.EXE</span>
              <div className="flex gap-2">
                  <div className="w-3 h-3 border-2 border-white bg-transparent"></div>
                  <div className="w-3 h-3 border-2 border-white bg-white"></div>
              </div>
           </div>

           {/* Content Area */}
           <div className="flex-1 p-6 flex flex-col relative overflow-y-auto">
             {children}
           </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 text-center">
        <p className={`text-[10px] text-${primaryTailwind}-900 font-bold tracking-widest animate-pulse uppercase`}>
           HAPPY VALENTINE DAY <span className={`text-${primaryTailwind}-600`}>♥</span>
        </p>
      </div>
    </div>
  );
};
