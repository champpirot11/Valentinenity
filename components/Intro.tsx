
import React, { useState, useEffect } from 'react';
import { AppConfig } from '../types.ts';

interface IntroProps {
  onNext: () => void;
  config: AppConfig;
}

export const Intro: React.FC<IntroProps> = ({ onNext, config }) => {
  const fullText = `หวัดดี ${config.partnerName}! ยินดีต้อนรับสู่โลกของเค้านะครับ ช่วยทำภารกิจให้สำเร็จเพื่อรับของขวัญด้วยนะ!`;
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + fullText.charAt(index));
        setIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [index, fullText]);

  const color = config.primaryColor || 'green';

  return (
    <div className="flex flex-col justify-end h-full pb-8 px-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-8xl drop-shadow-md animate-float">{config.dialogueEmoji}</div>
      </div>
      
      <div className="bg-white border-4 border-double border-gray-900 p-6 relative shadow-[8px_8px_0_rgba(0,0,0,0.1)] rounded-lg">
        <div className={`absolute -top-3 left-4 bg-${color}-100 px-2 border-2 border-gray-900 text-[10px] font-bold text-${color}-800 uppercase tracking-wider transform -rotate-2`}>
          {config.adminName} SAYS:
        </div>
        
        <p className="text-sm leading-relaxed min-h-[80px] text-gray-900 font-['Kanit'] font-medium">
          {displayedText}
          <span className="typewriter-cursor"></span>
        </p>
        
        {index >= fullText.length && (
          <div className="mt-4 flex justify-end">
             <button 
              onClick={onNext}
              className={`bg-${color}-600 text-white text-[10px] px-6 py-3 border-b-4 border-${color}-800 active:border-b-0 active:translate-y-[2px] font-bold rounded shadow-md`}
             >
               พร้อมแล้ว! &lt;3
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
