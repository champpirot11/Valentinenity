import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift as GiftIcon, Sparkles, Heart, ChevronRight, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Gift } from '../types.ts';

interface GachaProps {
  gifts: Gift[];
  finalMessage: string;
  finalImageUrl?: string;
  onComplete: () => void;
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-600'
};

export const Gacha: React.FC<GachaProps> = ({ gifts, finalMessage, finalImageUrl, onComplete }) => {
  const [openedGifts, setOpenedGifts] = useState<string[]>([]);
  const [currentGift, setCurrentGift] = useState<Gift | null>(null);
  const [showFinal, setShowFinal] = useState(false);

  const handleOpenGift = (gift: Gift) => {
    if (openedGifts.includes(gift.id)) return;
    
    setCurrentGift(gift);
    setOpenedGifts(prev => [...prev, gift.id]);
    
    if (gift.rarity === 'legendary' || gift.rarity === 'epic') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: gift.rarity === 'legendary' ? ['#FFD700', '#FFA500', '#FF4500'] : ['#A855F7', '#D8B4FE', '#7C3AED']
      });
    }
  };

  useEffect(() => {
    const giftsCount = (gifts || []).length;
    if (openedGifts.length === giftsCount && giftsCount > 0 && !currentGift) {
      const timer = setTimeout(() => setShowFinal(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [openedGifts, gifts, currentGift]);

  if (showFinal) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center space-y-8 font-['Kanit']"
      >
        <motion.div 
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-full max-w-sm bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-red-500 relative"
        >
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg -rotate-12">
            <Heart size={32} fill="currentColor" />
          </div>
          
          {finalImageUrl && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 border-2 border-gray-100 shadow-inner">
              <img src={finalImageUrl} alt="Love" className="w-full h-full object-cover" />
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ถึงคนพิเศษของฉัน...</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm italic">
            "{finalMessage}"
          </p>
          
          <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100">
            <button 
              onClick={onComplete}
              className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              จบภารกิจด้วยความรัก <Heart size={18} fill="currentColor" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const safeGifts = gifts || [];

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6 space-y-8 font-['Kanit']">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-500" /> ตู้สุ่มของขวัญพิเศษ
        </h1>
        <p className="text-sm text-gray-500">เลือกกล่องของขวัญเพื่อเปิดดูความในใจ ({openedGifts.length}/{safeGifts.length})</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {safeGifts.map((gift) => {
          const isOpened = openedGifts.includes(gift.id);
          return (
            <motion.button
              key={gift.id}
              whileHover={!isOpened ? { scale: 1.05, rotate: 2 } : {}}
              whileTap={!isOpened ? { scale: 0.95 } : {}}
              onClick={() => handleOpenGift(gift)}
              className={`aspect-square rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden border-4 ${
                isOpened 
                  ? 'bg-gray-100 border-gray-200 grayscale' 
                  : `bg-gradient-to-br ${RARITY_COLORS[gift.rarity]} border-white shadow-xl`
              }`}
            >
              <div className={`p-4 rounded-2xl ${isOpened ? 'bg-gray-200' : 'bg-white/20 backdrop-blur-sm'}`}>
                <GiftIcon size={32} className={isOpened ? 'text-gray-400' : 'text-white'} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isOpened ? 'text-gray-400' : 'text-white'}`}>
                {isOpened ? 'OPENED' : gift.rarity}
              </span>
              {!isOpened && (
                <div className="absolute top-2 right-2">
                  <Star size={12} className="text-white/50 fill-white/50" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {currentGift && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              className="w-full max-w-sm bg-white rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className={`h-32 bg-gradient-to-r ${RARITY_COLORS[currentGift.rarity]} flex items-center justify-center relative`}>
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-5xl border-4 border-white absolute -bottom-12">
                  {currentGift.imageUrl ? (
                    <img src={currentGift.imageUrl} className="w-full h-full object-cover rounded-2xl" />
                  ) : currentGift.emoji}
                </div>
              </div>
              
              <div className="pt-16 p-8 text-center space-y-4">
                <div className="space-y-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border-2 ${
                    currentGift.rarity === 'legendary' ? 'border-yellow-500 text-yellow-600 bg-yellow-50' :
                    currentGift.rarity === 'epic' ? 'border-purple-500 text-purple-600 bg-purple-50' :
                    currentGift.rarity === 'rare' ? 'border-blue-500 text-blue-600 bg-blue-50' :
                    'border-gray-500 text-gray-600 bg-gray-50'
                  }`}>
                    {currentGift.rarity}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">{currentGift.name}</h3>
                </div>
                
                <p className="text-sm text-gray-500 font-medium">{currentGift.description}</p>
                
                <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 italic text-gray-700 text-sm">
                  "{currentGift.message}"
                </div>

                <button 
                  onClick={() => setCurrentGift(null)}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  เก็บไว้ในใจ <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
