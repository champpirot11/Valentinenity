import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Settings, 
  Gift as GiftIcon, 
  MessageSquare, 
  CheckCircle, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Image as ImageIcon,
  Star
} from 'lucide-react';
import { AppConfig, QuizQuestion, Gift } from '../types.ts';
import { uploadToCloudinary } from '../cloudinary.ts';

interface SetupProps {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
}

const PRESET_GIFTS: Partial<Gift>[] = [
  {
    name: "ความทรงจำแรกพบ",
    emoji: "💫",
    rarity: "legendary",
    description: "วันที่พิเศษที่สุด",
    message: "วันที่เราพบกันครั้งแรก..."
  },
  {
    name: "ช่วงเวลาแห่งรอยยิ้ม",
    emoji: "😊",
    rarity: "epic",
    description: "ทุกครั้งที่เห็นเธอยิ้ม",
    message: "รอยยิ้มของเธอทำให้ฉันมีความสุข..."
  },
  {
    name: "คำสัญญา",
    emoji: "🤝",
    rarity: "rare",
    description: "สัญญาที่เรามีต่อกัน",
    message: "ฉันสัญญาว่าจะอยู่เคียงข้างเธอเสมอ..."
  },
  {
    name: "ความรัก",
    emoji: "❤️",
    rarity: "legendary",
    description: "สิ่งที่มีค่าที่สุด",
    message: "ฉันรักเธอมากที่สุดในโลก..."
  },
  {
    name: "ความฝัน",
    emoji: "✨",
    rarity: "epic",
    description: "อนาคตของเราสองคน",
    message: "เราจะสร้างอนาคตที่สวยงามด้วยกัน..."
  }
];

export const Setup: React.FC<SetupProps> = ({ config, onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AppConfig>(config);
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof AppConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleFinalSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'final' | 'gift', giftId?: string) => {
    try {
      const url = await uploadToCloudinary(file, `valentine/${type === 'final' ? 'final' : 'gifts'}`);
      if (type === 'final') {
        updateField('finalImageUrl', url);
      } else if (giftId) {
        const newGifts = formData.gifts.map(g => g.id === giftId ? { ...g, imageUrl: url, emoji: '' } : g);
        updateField('gifts', newGifts);
      }
    } catch (error) {
      alert("อัพโหลดรูปภาพไม่สำเร็จ");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Settings className="text-blue-500" /> ข้อมูลพื้นฐาน
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">ชื่อของคุณ (Admin)</label>
                <input 
                  type="text" 
                  value={formData.adminName || ''}
                  onChange={(e) => updateField('adminName', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                  placeholder="เช่น แชมป์"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">อีโมจิประจำตัว</label>
                <input 
                  type="text" 
                  value={formData.dialogueEmoji || ''}
                  onChange={(e) => updateField('dialogueEmoji', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl text-center text-2xl focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">ชื่อคนพิเศษ</label>
                <input 
                  type="text" 
                  value={formData.partnerName || ''}
                  onChange={(e) => updateField('partnerName', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 outline-none"
                  placeholder="เช่น อุ๋ย"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">รหัสผ่านพิเศษ 8 หลัก (ตัวเลข)</label>
                <input 
                  type="text" 
                  maxLength={8}
                  value={formData.specialDate || ''}
                  onChange={(e) => updateField('specialDate', e.target.value.replace(/\D/g, ''))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-mono tracking-widest focus:border-red-500 outline-none"
                  placeholder="เช่น 29062544"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">คำใบ้ที่ 1</label>
                  <input 
                    type="text" 
                    value={formData.hint1 || ''}
                    onChange={(e) => updateField('hint1', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">คำใบ้ที่ 2</label>
                  <input 
                    type="text" 
                    value={formData.hint2 || ''}
                    onChange={(e) => updateField('hint2', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="text-green-500" /> คำถาม Quiz
              </h2>
              <button 
                onClick={() => {
                  const newQ: QuizQuestion = { question: 'คำถามใหม่?', options: ['ตัวเลือก 1', 'ตัวเลือก 2'], correctIndex: 0 };
                  updateField('questions', [...formData.questions, newQ]);
                }}
                className="bg-green-500 text-white p-2 rounded-lg text-xs font-bold hover:bg-green-600"
              >
                + เพิ่มคำถาม
              </button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {formData.questions.map((q, idx) => (
                <div key={idx} className="p-4 border-2 border-gray-100 rounded-xl bg-gray-50 relative">
                  <button 
                    onClick={() => updateField('questions', formData.questions.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                  <input 
                    type="text" 
                    value={q.question}
                    onChange={(e) => {
                      const newQs = [...formData.questions];
                      newQs[idx].question = e.target.value;
                      updateField('questions', newQs);
                    }}
                    className="w-full p-2 border-2 border-gray-200 rounded-lg mb-2 text-sm font-bold"
                  />
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex gap-2 items-center">
                        <input 
                          type="radio" 
                          checked={q.correctIndex === oIdx}
                          onChange={() => {
                            const newQs = [...formData.questions];
                            newQs[idx].correctIndex = oIdx;
                            updateField('questions', newQs);
                          }}
                        />
                        <input 
                          type="text" 
                          value={opt}
                          onChange={(e) => {
                            const newQs = [...formData.questions];
                            newQs[idx].options[oIdx] = e.target.value;
                            updateField('questions', newQs);
                          }}
                          className="flex-1 p-2 border-2 border-gray-100 rounded-lg text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <GiftIcon className="text-purple-500" /> ของขวัญ Gacha
              </h2>
              {formData.gifts.length < 5 && (
                <button 
                  onClick={() => {
                    const newGift: Gift = {
                      id: Math.random().toString(36).substr(2, 9),
                      name: 'ของขวัญใหม่',
                      emoji: '🎁',
                      rarity: 'common',
                      description: 'คำอธิบายสั้นๆ',
                      message: 'ข้อความในกล่อง...',
                      order: formData.gifts.length
                    };
                    updateField('gifts', [...formData.gifts, newGift]);
                  }}
                  className="bg-purple-500 text-white p-2 rounded-lg text-xs font-bold hover:bg-purple-600"
                >
                  + เพิ่มของขวัญ
                </button>
              )}
            </div>
            
            {formData.gifts.length === 0 && (
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">
                <p className="text-xs text-gray-400 mb-4">ยังไม่มีของขวัญ เลือกจาก Preset ได้เลย!</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {PRESET_GIFTS.map((p, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        const newGift: Gift = {
                          ...p as Gift,
                          id: Math.random().toString(36).substr(2, 9),
                          order: formData.gifts.length
                        };
                        updateField('gifts', [...formData.gifts, newGift]);
                      }}
                      className="bg-gray-100 p-2 rounded-lg text-[10px] font-bold hover:bg-gray-200"
                    >
                      {p.emoji} {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {formData.gifts.map((g, idx) => (
                <div key={g.id} className="p-4 border-2 border-gray-100 rounded-xl bg-white shadow-sm relative">
                  <button 
                    onClick={() => updateField('gifts', formData.gifts.filter(item => item.id !== g.id))}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl border-2 border-gray-200 overflow-hidden relative group">
                      {g.imageUrl ? <img src={g.imageUrl} className="w-full h-full object-cover" /> : g.emoji}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                        <ImageIcon className="text-white" size={20} />
                        <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'gift', g.id)} />
                      </label>
                    </div>
                    <div className="flex-1 space-y-2">
                      <input 
                        type="text" 
                        value={g.name}
                        onChange={(e) => {
                          const newGifts = [...formData.gifts];
                          newGifts[idx].name = e.target.value;
                          updateField('gifts', newGifts);
                        }}
                        className="w-full p-1 border-b-2 border-gray-100 focus:border-purple-500 outline-none font-bold text-sm"
                        placeholder="ชื่อของขวัญ"
                      />
                      <select 
                        value={g.rarity}
                        onChange={(e) => {
                          const newGifts = [...formData.gifts];
                          newGifts[idx].rarity = e.target.value as any;
                          updateField('gifts', newGifts);
                        }}
                        className="text-[10px] font-bold p-1 rounded border-2 border-gray-100"
                      >
                        <option value="common">Common</option>
                        <option value="rare">Rare</option>
                        <option value="epic">Epic</option>
                        <option value="legendary">Legendary</option>
                      </select>
                    </div>
                  </div>
                  <textarea 
                    value={g.message}
                    onChange={(e) => {
                      const newGifts = [...formData.gifts];
                      newGifts[idx].message = e.target.value;
                      updateField('gifts', newGifts);
                    }}
                    className="w-full mt-2 p-2 border-2 border-gray-50 rounded-lg text-xs h-16"
                    placeholder="ข้อความในกล่อง..."
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="text-red-500" /> จดหมายรัก (ตอนจบ)
            </h2>
            <div className="space-y-4">
              <div className="w-full aspect-video bg-gray-100 rounded-2xl border-4 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group">
                {formData.finalImageUrl ? (
                  <img src={formData.finalImageUrl} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="text-gray-400 mb-2" size={48} />
                    <p className="text-xs text-gray-500 font-bold">อัพโหลดรูปภาพประกอบ</p>
                  </>
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <span className="text-white font-bold">เปลี่ยนรูปภาพ</span>
                  <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'final')} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">ข้อความจดหมาย</label>
                <textarea 
                  value={formData.finalMessage || ''}
                  onChange={(e) => updateField('finalMessage', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl h-40 focus:border-red-500 outline-none text-sm"
                  placeholder="เขียนความในใจของคุณที่นี่..."
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-500" size={48} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">สรุปการตั้งค่า</h2>
            <div className="bg-gray-50 p-6 rounded-2xl text-left space-y-2 border-2 border-gray-100">
              <p className="text-sm"><strong>ชื่อคนพิเศษ:</strong> {formData.partnerName}</p>
              <p className="text-sm"><strong>รหัสผ่าน:</strong> {formData.specialDate}</p>
              <p className="text-sm"><strong>จำนวนคำถาม:</strong> {formData.questions.length} ข้อ</p>
              <p className="text-sm"><strong>จำนวนของขวัญ:</strong> {formData.gifts.length} ชิ้น</p>
            </div>
            <p className="text-xs text-gray-500 italic">
              ตรวจสอบข้อมูลให้เรียบร้อยก่อนกดบันทึกนะครับ
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[500px] flex flex-col font-['Kanit']">
      {/* Progress Bar */}
      <div className="flex gap-1 mb-8">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-all ${step >= i ? 'bg-blue-500' : 'bg-gray-200'}`} />
        ))}
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex gap-4">
        {step > 1 && (
          <button 
            onClick={handleBack}
            className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2 border-b-4 border-gray-300 active:translate-y-1 active:border-b-0"
          >
            <ChevronLeft /> กลับ
          </button>
        )}
        {step < 5 ? (
          <button 
            onClick={handleNext}
            className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 border-b-4 border-blue-800 active:translate-y-1 active:border-b-0"
          >
            ถัดไป <ChevronRight />
          </button>
        ) : (
          <button 
            onClick={handleFinalSave}
            disabled={loading}
            className="flex-[2] py-4 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 border-b-4 border-green-800 active:translate-y-1 active:border-b-0 disabled:opacity-50"
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่าทั้งหมด'} <CheckCircle />
          </button>
        )}
      </div>
    </div>
  );
};
