import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Sparkles, Heart, CheckCircle, Save, ArrowLeft } from 'lucide-react';
import { uploadToCloudinary } from '../cloudinary.ts';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.ts';

interface KeepMemoriesProps {
  userId: string;
  onComplete: () => void;
}

export const KeepMemories: React.FC<KeepMemoriesProps> = ({ userId, onComplete }) => {
  const [selectedType, setSelectedType] = useState<'pixel' | 'photo' | 'gif' | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedType) return;

    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(file, `valentine/photos/${userId}`);
      
      await addDoc(collection(db, 'photos'), {
        userId,
        imageUrl,
        type: selectedType,
        createdAt: serverTimestamp()
      });

      setSaved(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกรูปภาพ");
    } finally {
      setLoading(false);
    }
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6 font-['Kanit']">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl"
        >
          <CheckCircle size={48} />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 text-center">บันทึกความทรงจำแล้ว!</h2>
        <p className="text-sm text-gray-500 text-center">รูปภาพของคุณถูกเก็บไว้ในแกลเลอรี่แล้วครับ</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6 space-y-8 font-['Kanit']">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Camera className="text-blue-500" /> เก็บความทรงจำ
        </h1>
        <p className="text-sm text-gray-500">เลือกประเภทของความทรงจำที่คุณอยากบันทึกไว้</p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        <button 
          onClick={() => setSelectedType('pixel')}
          className={`p-6 rounded-3xl border-4 flex items-center gap-4 transition-all ${selectedType === 'pixel' ? 'bg-blue-50 border-blue-500 shadow-lg' : 'bg-white border-gray-100 hover:border-blue-200'}`}
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Sparkles size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-800">Pixel Art Memory</p>
            <p className="text-[10px] text-gray-400">บันทึกรูปภาพในสไตล์พิกเซลสุดคลาสสิก</p>
          </div>
        </button>

        <button 
          onClick={() => setSelectedType('photo')}
          className={`p-6 rounded-3xl border-4 flex items-center gap-4 transition-all ${selectedType === 'photo' ? 'bg-purple-50 border-purple-500 shadow-lg' : 'bg-white border-gray-100 hover:border-purple-200'}`}
        >
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
            <ImageIcon size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-800">Classic Photo</p>
            <p className="text-[10px] text-gray-400">บันทึกรูปภาพความประทับใจแบบปกติ</p>
          </div>
        </button>

        <button 
          onClick={() => setSelectedType('gif')}
          className={`p-6 rounded-3xl border-4 flex items-center gap-4 transition-all ${selectedType === 'gif' ? 'bg-orange-50 border-orange-500 shadow-lg' : 'bg-white border-gray-100 hover:border-orange-200'}`}
        >
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
            <Heart size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-800">Animated GIF</p>
            <p className="text-[10px] text-gray-400">บันทึกช่วงเวลาเคลื่อนไหวที่น่าจดจำ</p>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {selectedType && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm"
          >
            <label className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 cursor-pointer transition-all shadow-lg border-b-4 active:translate-y-1 active:border-b-0 ${
              loading ? 'bg-gray-400 border-gray-600 cursor-not-allowed' : 'bg-green-600 border-green-800 text-white hover:bg-green-700'
            }`}>
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  กำลังอัพโหลด...
                </>
              ) : (
                <>
                  <Save size={20} /> เลือกรูปภาพเพื่อบันทึก
                </>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
                disabled={loading}
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={onComplete}
        className="text-xs text-gray-400 font-bold hover:text-gray-600 transition-colors flex items-center gap-2"
      >
        ข้ามขั้นตอนนี้ไปก่อน <ArrowLeft size={14} className="rotate-180" />
      </button>
    </div>
  );
};
