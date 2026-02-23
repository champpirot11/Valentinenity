
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.ts';
import { AppConfig, QuizQuestion, Gift } from '../types.ts';
import { 
  Settings, 
  MessageSquare, 
  Gift as GiftIcon, 
  Heart, 
  LogOut, 
  Save, 
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { uploadToCloudinary } from '../cloudinary.ts';

interface AdminProps {
  config: AppConfig;
  onSave: (newConfig: AppConfig) => void;
  onBack: () => void;
}

type AdminTab = 'GENERAL' | 'QUIZ' | 'GIFTS' | 'LETTER';

export const Admin: React.FC<AdminProps> = ({ config, onSave, onBack }) => {
  const [formData, setFormData] = useState<AppConfig>(config);
  const [activeTab, setActiveTab] = useState<AdminTab>('GENERAL');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      alert("บันทึกการตั้งค่าเรียบร้อยแล้ว!");
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      await signOut(auth);
    }
  };

  const updateField = (field: keyof AppConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  return (
    <div className="flex flex-col h-full font-['Kanit'] -m-6 text-gray-900 bg-gray-50">
      {/* Admin Nav */}
      <div className="bg-white p-4 flex gap-2 shrink-0 overflow-x-auto border-b-2 border-gray-100 sticky top-0 z-20">
        <button 
          onClick={() => setActiveTab('GENERAL')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl shrink-0 transition-all ${activeTab === 'GENERAL' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          <Settings size={14} /> ทั่วไป
        </button>
        <button 
          onClick={() => setActiveTab('QUIZ')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl shrink-0 transition-all ${activeTab === 'QUIZ' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          <MessageSquare size={14} /> Quiz
        </button>
        <button 
          onClick={() => setActiveTab('GIFTS')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl shrink-0 transition-all ${activeTab === 'GIFTS' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          <GiftIcon size={14} /> ของขวัญ
        </button>
        <button 
          onClick={() => setActiveTab('LETTER')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl shrink-0 transition-all ${activeTab === 'LETTER' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          <Heart size={14} /> จดหมาย
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'GENERAL' && (
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-3xl shadow-sm border-2 border-gray-100 space-y-4">
              <h3 className="font-bold text-blue-600 uppercase tracking-wider text-xs flex items-center gap-2">
                <Settings size={16} /> Profile Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase">ชื่อของคุณ (Admin)</label>
                  <input 
                    type="text" 
                    value={formData.adminName || ''}
                    onChange={(e) => updateField('adminName', e.target.value)}
                    className="w-full p-3 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase">อีโมจิประจำตัว</label>
                  <input 
                    type="text" 
                    value={formData.dialogueEmoji || ''}
                    onChange={(e) => updateField('dialogueEmoji', e.target.value)}
                    className="w-full p-3 border-2 border-gray-100 rounded-2xl text-center text-2xl focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-sm border-2 border-gray-100 space-y-4">
              <h3 className="font-bold text-pink-600 uppercase tracking-wider text-xs flex items-center gap-2">
                <Heart size={16} /> Target Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase">ชื่อคนพิเศษ</label>
                  <input 
                    type="text" 
                    value={formData.partnerName || ''}
                    onChange={(e) => updateField('partnerName', e.target.value)}
                    className="w-full p-3 border-2 border-gray-100 rounded-2xl focus:border-pink-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase">รหัสผ่านพิเศษ (8 หลัก)</label>
                  <input 
                    type="text" 
                    maxLength={8}
                    value={formData.specialDate || ''}
                    onChange={(e) => updateField('specialDate', e.target.value.replace(/\D/g, ''))}
                    className="w-full p-3 border-2 border-gray-100 rounded-2xl font-mono tracking-widest focus:border-red-500 outline-none text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase">คำใบ้ที่ 1</label>
                    <input 
                      type="text" 
                      value={formData.hint1 || ''}
                      onChange={(e) => updateField('hint1', e.target.value)}
                      className="w-full p-3 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none text-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase">คำใบ้ที่ 2</label>
                    <input 
                      type="text" 
                      value={formData.hint2 || ''}
                      onChange={(e) => updateField('hint2', e.target.value)}
                      className="w-full p-3 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none text-[10px]"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'QUIZ' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
               <h2 className="text-sm font-bold text-gray-800">📝 จัดการคำถาม Quiz</h2>
                <button 
                onClick={() => {
                  const newQ: QuizQuestion = { question: "คำถามใหม่?", options: ["ตัวเลือก 1", "ตัวเลือก 2"], correctIndex: 0 };
                  updateField('questions', [...(formData.questions || []), newQ]);
                }}
                className="bg-green-600 text-white text-[10px] px-3 py-2 rounded-xl font-bold shadow-sm hover:bg-green-700 transition-colors"
               >
                 + เพิ่มคำถาม
               </button>
            </div>

            <div className="space-y-6">
              {(formData.questions || []).map((q, qIdx) => (
                <div key={qIdx} className="bg-white border-2 border-gray-100 p-6 rounded-3xl relative shadow-sm">
                  <button 
                    onClick={() => updateField('questions', (formData.questions || []).filter((_, i) => i !== qIdx))}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="mb-4">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">คำถามที่ {qIdx + 1}</label>
                    <input 
                      type="text" 
                      value={q.question}
                      onChange={(e) => {
                        const newQs = [...(formData.questions || [])];
                        newQs[qIdx].question = e.target.value;
                        updateField('questions', newQs);
                      }}
                      className="w-full p-3 border-2 border-gray-50 rounded-2xl text-sm font-bold focus:border-blue-400 outline-none bg-gray-50"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">ตัวเลือก (เลือกปุ่มหน้าข้อที่ถูกต้อง)</label>
                    {(q.options || []).map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name={`correct-${qIdx}`}
                          checked={q.correctIndex === oIdx}
                          onChange={() => {
                            const newQs = [...(formData.questions || [])];
                            newQs[qIdx].correctIndex = oIdx;
                            updateField('questions', newQs);
                          }}
                          className="w-5 h-5 cursor-pointer accent-green-600"
                        />
                        <input 
                          type="text" 
                          value={opt}
                          onChange={(e) => {
                            const newQs = [...(formData.questions || [])];
                            newQs[qIdx].options[oIdx] = e.target.value;
                            updateField('questions', newQs);
                          }}
                          className={`flex-1 p-3 border-2 rounded-2xl text-xs outline-none transition-all ${q.correctIndex === oIdx ? 'border-green-500 bg-green-50 font-bold' : 'border-gray-50 bg-gray-50'}`}
                        />
                        <button 
                          onClick={() => {
                            if ((q.options || []).length <= 2) return;
                            const newQs = [...(formData.questions || [])];
                            newQs[qIdx].options = q.options.filter((_, i) => i !== oIdx);
                            if (newQs[qIdx].correctIndex >= newQs[qIdx].options.length) newQs[qIdx].correctIndex = 0;
                            updateField('questions', newQs);
                          }}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        const newQs = [...(formData.questions || [])];
                        newQs[qIdx].options.push(`ตัวเลือกใหม่`);
                        updateField('questions', newQs);
                      }}
                      className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-400 text-[10px] rounded-2xl hover:bg-gray-50 font-bold transition-colors"
                    >
                      + เพิ่มตัวเลือก
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'GIFTS' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
               <h2 className="text-sm font-bold text-gray-800">🎁 จัดการของขวัญ Gacha</h2>
               {(formData.gifts || []).length < 5 && (
                 <button 
                  onClick={() => {
                    const newGift: Gift = {
                      id: Math.random().toString(36).substr(2, 9),
                      name: 'ของขวัญใหม่',
                      emoji: '🎁',
                      rarity: 'common',
                      description: 'คำอธิบายสั้นๆ',
                      message: 'ข้อความในกล่อง...',
                      order: (formData.gifts || []).length
                    };
                    updateField('gifts', [...(formData.gifts || []), newGift]);
                  }}
                  className="bg-purple-600 text-white text-[10px] px-3 py-2 rounded-xl font-bold shadow-sm hover:bg-purple-700 transition-colors"
                 >
                   + เพิ่มของขวัญ
                 </button>
               )}
            </div>

            <div className="space-y-6">
              {(formData.gifts || []).map((g, idx) => (
                <div key={g.id} className="bg-white border-2 border-gray-100 p-6 rounded-3xl relative shadow-sm space-y-4">
                  <button 
                    onClick={() => updateField('gifts', (formData.gifts || []).filter(item => item.id !== g.id))}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-4xl relative group overflow-hidden">
                      {g.imageUrl ? <img src={g.imageUrl} className="w-full h-full object-cover" /> : g.emoji}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                        <ImageIcon className="text-white" size={24} />
                        <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'gift', g.id)} />
                      </label>
                    </div>
                    <div className="flex-1 space-y-2">
                      <input 
                        type="text" 
                        value={g.name || ''}
                        onChange={(e) => {
                          const newGifts = [...(formData.gifts || [])];
                          newGifts[idx].name = e.target.value;
                          updateField('gifts', newGifts);
                        }}
                        className="w-full p-2 border-b-2 border-gray-100 focus:border-purple-500 outline-none font-bold text-sm bg-transparent"
                        placeholder="ชื่อของขวัญ"
                      />
                      <select 
                        value={g.rarity}
                        onChange={(e) => {
                          const newGifts = [...(formData.gifts || [])];
                          newGifts[idx].rarity = e.target.value as any;
                          updateField('gifts', newGifts);
                        }}
                        className="text-[10px] font-bold p-2 rounded-xl border-2 border-gray-100 bg-gray-50"
                      >
                        <option value="common">Common</option>
                        <option value="rare">Rare</option>
                        <option value="epic">Epic</option>
                        <option value="legendary">Legendary</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">คำอธิบายสั้น</label>
                    <input 
                      type="text" 
                      value={g.description || ''}
                      onChange={(e) => {
                        const newGifts = [...(formData.gifts || [])];
                        newGifts[idx].description = e.target.value;
                        updateField('gifts', newGifts);
                      }}
                      className="w-full p-3 border-2 border-gray-50 rounded-2xl text-xs bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">ข้อความเมื่อเปิดกล่อง</label>
                    <textarea 
                      value={g.message || ''}
                      onChange={(e) => {
                        const newGifts = [...(formData.gifts || [])];
                        newGifts[idx].message = e.target.value;
                        updateField('gifts', newGifts);
                      }}
                      className="w-full p-3 border-2 border-gray-50 rounded-2xl text-xs h-24 bg-gray-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'LETTER' && (
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-3xl shadow-sm border-2 border-gray-100 space-y-4">
              <h3 className="font-bold text-red-600 uppercase tracking-wider text-xs flex items-center gap-2">
                <Heart size={16} /> Final Message
              </h3>
              
              <div className="w-full aspect-video bg-gray-50 rounded-3xl border-4 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group">
                {formData.finalImageUrl ? (
                  <img src={formData.finalImageUrl} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="text-gray-300 mb-2" size={48} />
                    <p className="text-xs text-gray-400 font-bold">อัพโหลดรูปภาพประกอบ</p>
                  </>
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <span className="text-white font-bold text-sm">เปลี่ยนรูปภาพ</span>
                  <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'final')} />
                </label>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase">ข้อความจดหมายรัก</label>
                <textarea 
                  value={formData.finalMessage || ''}
                  onChange={(e) => updateField('finalMessage', e.target.value)}
                  className="w-full p-4 border-2 border-gray-100 rounded-3xl h-64 focus:border-red-500 outline-none text-sm bg-gray-50"
                  placeholder="เขียนความในใจของคุณ..."
                />
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Admin Footer */}
      <div className="p-6 bg-white border-t-2 border-gray-100 flex flex-col gap-3 shrink-0 sticky bottom-0">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 border-b-4 border-blue-800 rounded-2xl font-bold active:translate-y-1 active:border-b-0 shadow-lg text-sm tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'กำลังบันทึก...' : <><Save size={18} /> บันทึกการตั้งค่าทั้งหมด</>}
        </button>
        <div className="flex gap-3">
          <button 
            onClick={onBack}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded-2xl font-bold text-xs active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> กลับหน้าหลัก
          </button>
          <button 
            onClick={handleSignOut}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-2xl font-bold text-xs active:translate-y-1 transition-all border-2 border-red-100 flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
};

