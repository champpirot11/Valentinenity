import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, HelpCircle, AlertCircle } from 'lucide-react';
import { AppConfig } from '../types.ts';

interface PlayerLoginProps {
  config: AppConfig;
  onSuccess: () => void;
  isTestMode?: boolean;
}

export const PlayerLogin: React.FC<PlayerLoginProps> = ({ config, onSuccess, isTestMode }) => {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === config.specialDate) {
      onSuccess();
    } else {
      setAttempts(prev => prev + 1);
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 500);
    }
  };

  const getHint = () => {
    if (attempts === 1) return config.hint1;
    if (attempts >= 2) return config.hint2;
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6 font-['Kanit']">
      {isTestMode && (
        <div className="fixed top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg z-50 animate-pulse">
          โหมดทดสอบ
        </div>
      )}

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-white p-8 rounded-[2.5rem] shadow-2xl border-4 border-gray-900 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100 rounded-full opacity-50" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-100 rounded-full opacity-50" />

        <div className="relative z-10 text-center space-y-6">
          <div className="w-20 h-20 bg-pink-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg rotate-3">
            <Lock size={40} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">ภารกิจลับเพื่อคุณ</h1>
            <p className="text-sm text-gray-500">กรุณาใส่รหัสผ่าน 8 หลักเพื่อเริ่มต้น</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={`relative transition-transform ${error ? 'animate-shake' : ''}`}>
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                maxLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-xl font-mono tracking-[0.5em] focus:border-pink-500 focus:bg-white outline-none transition-all shadow-inner"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold border-b-4 border-gray-700 active:translate-y-1 active:border-b-0 transition-all shadow-lg"
            >
              ยืนยันรหัสผ่าน
            </button>
          </form>

          <AnimatePresence>
            {attempts > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-50 border-2 border-blue-100 rounded-2xl space-y-2"
              >
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                  <HelpCircle size={14} />
                  <span>คำใบ้จาก {config.adminName}</span>
                </div>
                <p className="text-sm text-blue-800 font-medium">
                  {getHint()}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-500 font-bold text-xs">
              <AlertCircle size={14} />
              <span>รหัสผ่านไม่ถูกต้อง ลองใหม่อีกครั้งนะ</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
