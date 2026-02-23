
import React, { useState } from 'react';
import { AppConfig } from '../types.ts';

export type LoginDestination = 'INTRO' | 'GACHA' | 'MEMORIES' | 'MEMORIES_TEST' | 'ADMIN';

interface LoginProps {
  onSuccess: (destination: LoginDestination) => void;
  config: AppConfig;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, config }) => {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handlePress = (num: string) => {
    if (code.length < 8) {
      const newCode = code + num;
      setCode(newCode);
      if (newCode.length === 8) {
        checkCode(newCode);
      }
    }
  };

  const handleClear = () => {
    setCode('');
    setErrorMsg('');
  };

  const handleBackspace = () => {
    setCode(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const checkCode = (inputCode: string) => {
    // Admin Password
    if (inputCode === '00000000') {
      onSuccess('ADMIN' as LoginDestination);
      return;
    }

    // Cheat code: Skip to Gacha
    if (inputCode === '41280000') {
      onSuccess('GACHA');
      return;
    }
    
    // Cheat code: Skip to Photo Booth
    if (inputCode === '45777777') {
      onSuccess('MEMORIES');
      return;
    }

    // Correct code: based on config
    if (inputCode === config.specialDate) {
      onSuccess('INTRO');
    } else {
      setAttempts(prev => prev + 1);
      setCode('');
      if (attempts === 0) {
        setErrorMsg("Hint: วันพิเศษของเรา? (DDMMYYYY)");
      } else if (attempts === 1) {
        setErrorMsg(`ลองรหัส ${config.specialDate} ดูสิ`);
      } else {
        setErrorMsg("รหัสผิดนะบี๋ ลองใหม่เร็ว");
      }
    }
  };

  return (
    <div className="flex flex-col h-full items-center pt-6 px-4">
      <h2 className="text-gray-900 text-sm mb-4 text-center font-bold tracking-wider">PASSWORD</h2>
      
      <div className="bg-gray-900 border-4 border-gray-700 w-full p-4 mb-4 text-center rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
        <span className="text-xl tracking-[0.2em] text-green-400 font-bold font-mono">
          {code.padEnd(8, '_')}
        </span>
      </div>

      <div className="h-12 mb-2 text-center">
        {errorMsg && (
          <p className="text-[10px] text-red-600 font-bold typewriter-cursor leading-tight">
            {errorMsg}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handlePress(num.toString())}
            className="aspect-square bg-white border-2 border-b-[6px] border-gray-800 text-gray-900 active:border-b-2 active:translate-y-[4px] rounded-lg font-bold text-xl shadow-md transition-all"
          >
            {num}
          </button>
        ))}
        <button 
          onClick={handleClear} 
          className="col-span-1 bg-red-100 text-red-800 text-xs rounded-lg border-2 border-b-[6px] border-red-800 active:border-b-2 active:translate-y-[4px] font-bold shadow-md flex items-center justify-center transition-all"
        >
          CLR
        </button>
        <button 
           onClick={() => handlePress('0')}
           className="aspect-square bg-white border-2 border-b-[6px] border-gray-800 text-gray-900 active:border-b-2 active:translate-y-[4px] rounded-lg font-bold text-xl shadow-md transition-all"
        >
          0
        </button>
        <button 
          onClick={handleBackspace}
          className="col-span-1 bg-yellow-100 text-yellow-800 text-xs rounded-lg border-2 border-b-[6px] border-yellow-600 active:border-b-2 active:translate-y-[4px] font-bold shadow-md flex items-center justify-center transition-all"
        >
          DEL
        </button>
      </div>
    </div>
  );
};
