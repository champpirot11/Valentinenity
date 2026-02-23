
import React, { useState } from 'react';
import { AppConfig, QuizQuestion } from '../types.ts';

interface AdminProps {
  config: AppConfig;
  onSave: (newConfig: AppConfig) => void;
  onBack: () => void;
}

type AdminTab = 'GENERAL' | 'QUIZ';

export const Admin: React.FC<AdminProps> = ({ config, onSave, onBack }) => {
  const [formData, setFormData] = useState<AppConfig>(config);
  const [activeTab, setActiveTab] = useState<AdminTab>('GENERAL');

  const handleSave = () => {
    onSave(formData);
    alert("บันทึกการตั้งค่าเรียบร้อยแล้ว!");
  };

  const updateField = (field: keyof AppConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Quiz Management
  const addQuestion = () => {
    const newQ: QuizQuestion = {
      question: "คำถามใหม่?",
      options: ["ตัวเลือก 1", "ตัวเลือก 2"],
      correctIndex: 0
    };
    updateField('questions', [...formData.questions, newQ]);
  };

  const removeQuestion = (index: number) => {
    const updated = formData.questions.filter((_, i) => i !== index);
    updateField('questions', updated);
  };

  const updateQuestion = (index: number, updatedQ: QuizQuestion) => {
    const updated = [...formData.questions];
    updated[index] = updatedQ;
    updateField('questions', updated);
  };

  const addOption = (qIndex: number) => {
    const q = formData.questions[qIndex];
    updateQuestion(qIndex, { ...q, options: [...q.options, `ตัวเลือก ${q.options.length + 1}`] });
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const q = formData.questions[qIndex];
    if (q.options.length <= 2) return alert("ต้องมีอย่างน้อย 2 ตัวเลือก");
    const newOptions = q.options.filter((_, i) => i !== oIndex);
    let newCorrect = q.correctIndex;
    if (newCorrect >= newOptions.length) newCorrect = 0;
    updateQuestion(qIndex, { ...q, options: newOptions, correctIndex: newCorrect });
  };

  return (
    <div className="flex flex-col h-full font-['Kanit'] -m-6 text-gray-900">
      {/* Admin Nav */}
      <div className="bg-gray-900 text-white p-4 flex gap-4 shrink-0 overflow-x-auto border-b-4 border-gray-700">
        <button 
          onClick={() => setActiveTab('GENERAL')}
          className={`px-4 py-2 text-xs font-bold rounded shrink-0 transition-colors ${activeTab === 'GENERAL' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          ทั่วไป
        </button>
        <button 
          onClick={() => setActiveTab('QUIZ')}
          className={`px-4 py-2 text-xs font-bold rounded shrink-0 transition-colors ${activeTab === 'QUIZ' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          จัดการคำถาม
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
        {activeTab === 'GENERAL' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold border-b-2 border-gray-100 pb-2 text-gray-800">⚙️ ตั้งค่าทั่วไป</h2>
            
            <div className="space-y-4 text-xs">
              <section className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <h3 className="font-bold mb-3 text-blue-600 uppercase tracking-wider">Profile Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1.5 font-semibold text-gray-600">ชื่อของคุณ (Admin):</label>
                    <input 
                      type="text" 
                      value={formData.adminName}
                      onChange={(e) => updateField('adminName', e.target.value)}
                      className="w-full py-3 px-3 border-2 border-gray-300 rounded focus:border-blue-500 outline-none leading-relaxed text-sm shadow-sm bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 font-semibold text-gray-600">อีโมจิประจำตัว:</label>
                    <input 
                      type="text" 
                      value={formData.dialogueEmoji}
                      onChange={(e) => updateField('dialogueEmoji', e.target.value)}
                      className="w-full py-3 px-3 border-2 border-gray-300 rounded text-center text-2xl focus:border-blue-500 outline-none shadow-sm bg-white"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <h3 className="font-bold mb-3 text-pink-600 uppercase tracking-wider">Target Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1.5 font-semibold text-gray-600">ชื่อคนพิเศษ:</label>
                    <input 
                      type="text" 
                      value={formData.partnerName}
                      onChange={(e) => updateField('partnerName', e.target.value)}
                      className="w-full py-3 px-3 border-2 border-gray-300 rounded focus:border-pink-500 outline-none leading-relaxed text-sm shadow-sm bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 font-semibold text-red-600">รหัสผ่านพิเศษ (DDMMYYYY):</label>
                    <input 
                      type="text" 
                      maxLength={8}
                      placeholder="เช่น 14022026"
                      value={formData.specialDate}
                      onChange={(e) => updateField('specialDate', e.target.value)}
                      className="w-full py-3 px-3 border-2 border-gray-300 rounded font-mono tracking-widest focus:border-red-500 outline-none text-sm shadow-sm bg-white text-gray-900"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'QUIZ' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b-2 border-gray-100 pb-2">
               <h2 className="text-base font-bold text-gray-800">📝 จัดการคำถาม Quiz</h2>
               <button 
                onClick={addQuestion}
                className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-3 py-2 rounded font-bold shadow-sm transition-colors"
               >
                 + เพิ่มคำถาม
               </button>
            </div>

            <div className="space-y-6">
              {formData.questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-white border-2 border-gray-200 p-4 rounded-lg relative shadow-sm">
                  <button 
                    onClick={() => removeQuestion(qIdx)}
                    className="absolute top-2 right-2 text-red-500 text-xs font-bold hover:bg-red-50 p-1 rounded"
                  >
                    ลบ ✕
                  </button>
                  
                  <div className="mb-4">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-tighter">คำถามที่ {qIdx + 1}</label>
                    <input 
                      type="text" 
                      value={q.question}
                      onChange={(e) => updateQuestion(qIdx, { ...q, question: e.target.value })}
                      className="w-full py-3 px-3 border-2 border-gray-100 rounded text-sm font-bold focus:border-blue-400 outline-none leading-relaxed shadow-sm bg-white text-gray-900"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-tighter">ตัวเลือก (เลือกปุ่มหน้าข้อที่ถูกต้อง)</label>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name={`correct-${qIdx}`}
                          checked={q.correctIndex === oIdx}
                          onChange={() => updateQuestion(qIdx, { ...q, correctIndex: oIdx })}
                          className="w-5 h-5 cursor-pointer shrink-0 accent-green-600"
                        />
                        <input 
                          type="text" 
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...q.options];
                            newOpts[oIdx] = e.target.value;
                            updateQuestion(qIdx, { ...q, options: newOpts });
                          }}
                          className={`flex-1 py-3 px-3 border-2 rounded text-xs focus:border-blue-400 outline-none leading-relaxed shadow-sm text-gray-900 transition-colors ${q.correctIndex === oIdx ? 'border-green-500 bg-green-50 font-semibold' : 'border-gray-100 bg-white'}`}
                        />
                        <button 
                          onClick={() => removeOption(qIdx, oIdx)}
                          className="text-gray-400 hover:text-red-500 text-sm px-2 shrink-0 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addOption(qIdx)}
                      className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-400 text-[10px] rounded hover:bg-gray-50 mt-1 font-bold transition-colors"
                    >
                      + เพิ่มตัวเลือก
                    </button>
                  </div>
                </div>
              ))}
              {formData.questions.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-xs italic">ยังไม่มีคำถาม กดปุ่มเพิ่มคำถามด้านบนเพื่อเริ่มต้น</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Admin Footer */}
      <div className="p-4 bg-gray-50 border-t-2 border-gray-200 flex flex-col gap-2 shrink-0">
        <button 
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 border-b-4 border-blue-800 rounded-lg font-bold active:translate-y-1 active:border-b-0 shadow-md text-sm tracking-wide transition-all"
        >
          บันทึกการตั้งค่าทั้งหมด
        </button>
        <button 
          onClick={onBack}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-bold text-[10px] active:translate-y-1 transition-all"
        >
          กลับไปหน้าล็อคอิน
        </button>
      </div>
    </div>
  );
};
