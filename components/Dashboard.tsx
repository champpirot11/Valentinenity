import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Copy, 
  Share2, 
  Settings, 
  Play, 
  Image as ImageIcon, 
  LogOut, 
  Check, 
  MessageCircle, 
  Instagram,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AppConfig } from '../types.ts';
import { User, signOut } from 'firebase/auth';
import { auth } from '../firebase.ts';

interface DashboardProps {
  config: AppConfig;
  user: User;
  onEdit: () => void;
  onTest: () => void;
  onGallery: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ config, user, onEdit, onTest, onGallery }) => {
  const [copied, setCopied] = useState(false);
  const playUrl = `${window.location.origin}/play/${user.uid}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(playUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLine = () => {
    const text = `มาเล่นเกมพิเศษที่ฉันทำไว้ให้คุณ 💕`;
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text + ' ' + playUrl)}`);
  };

  const handleShareMessenger = () => {
    window.open(`fb-messenger://share/?link=${encodeURIComponent(playUrl)}`);
  };

  const handleSignOut = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      signOut(auth);
    }
  };

  return (
    <div className="space-y-6 font-['Kanit'] pb-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-xl font-bold">💕 ยินดีต้อนรับกลับมา, {config.adminName}!</h1>
          <p className="text-xs opacity-90 mt-1">วันนี้คุณพร้อมส่งความรักหรือยัง?</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12">
          <HeartIcon size={120} />
        </div>
      </motion.div>

      {/* Share Section */}
      <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-gray-50 space-y-4">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <Share2 size={18} className="text-blue-500" /> URL สำหรับคนพิเศษ
        </h2>
        
        <div className="flex flex-col items-center gap-4 bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="bg-white p-2 rounded-xl shadow-sm">
            <QRCodeCanvas value={playUrl} size={120} />
          </div>
          <div className="w-full">
            <p className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-wider">Link สำหรับแชร์</p>
            <div className="flex gap-2">
              <input 
                readOnly 
                value={playUrl}
                className="flex-1 bg-white border-2 border-gray-100 rounded-lg p-2 text-[10px] font-mono outline-none"
              />
              <button 
                onClick={handleCopy}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={handleShareLine}
            className="flex flex-col items-center gap-1 p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-colors border-2 border-green-100"
          >
            <MessageCircle size={20} />
            <span className="text-[10px] font-bold">LINE</span>
          </button>
          <button 
            onClick={handleShareMessenger}
            className="flex flex-col items-center gap-1 p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors border-2 border-blue-100"
          >
            <Share2 size={20} />
            <span className="text-[10px] font-bold">Messenger</span>
          </button>
          <button 
            onClick={handleCopy}
            className="flex flex-col items-center gap-1 p-3 bg-purple-50 text-purple-600 rounded-2xl hover:bg-purple-100 transition-colors border-2 border-purple-100"
          >
            <Instagram size={20} />
            <span className="text-[10px] font-bold">Instagram</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-gray-50">
        <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ExternalLink size={18} className="text-orange-500" /> สรุปการตั้งค่า
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-pink-50 p-3 rounded-2xl border-2 border-pink-100">
            <p className="text-[10px] text-pink-400 font-bold uppercase">คนพิเศษ</p>
            <p className="text-sm font-bold text-pink-700">{config.partnerName}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-2xl border-2 border-blue-100">
            <p className="text-[10px] text-blue-400 font-bold uppercase">รหัสผ่าน</p>
            <p className="text-sm font-bold text-blue-700 font-mono tracking-widest">{config.specialDate}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-2xl border-2 border-green-100">
            <p className="text-[10px] text-green-400 font-bold uppercase">คำถาม</p>
            <p className="text-sm font-bold text-green-700">{(config.questions || []).length} ข้อ</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-2xl border-2 border-purple-100">
            <p className="text-[10px] text-purple-400 font-bold uppercase">ของขวัญ</p>
            <p className="text-sm font-bold text-purple-700">{(config.gifts || []).length} ชิ้น</p>
          </div>
        </div>
      </div>

      {/* Management Actions */}
      <div className="grid grid-cols-1 gap-3">
        <button 
          onClick={onEdit}
          className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md border-2 border-gray-50 hover:bg-gray-50 transition-colors text-left group"
        >
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Settings size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">แก้ไขการตั้งค่า</p>
            <p className="text-[10px] text-gray-400">ปรับเปลี่ยนข้อมูล คำถาม และของขวัญ</p>
          </div>
        </button>

        <button 
          onClick={onTest}
          className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md border-2 border-gray-50 hover:bg-gray-50 transition-colors text-left group"
        >
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">ทดสอบเล่นเกม</p>
            <p className="text-[10px] text-gray-400">ลองเล่นในมุมมองของคนพิเศษ</p>
          </div>
        </button>

        <button 
          onClick={onGallery}
          className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md border-2 border-gray-50 hover:bg-gray-50 transition-colors text-left group"
        >
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <ImageIcon size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">ดูรูปภาพที่เก็บไว้</p>
            <p className="text-[10px] text-gray-400">ดูรูปที่แฟนถ่ายเก็บไว้ในภารกิจ</p>
          </div>
        </button>

        <button 
          onClick={handleSignOut}
          className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl shadow-md border-2 border-red-100 hover:bg-red-100 transition-colors text-left group mt-4"
        >
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <LogOut size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-600">ออกจากระบบ</p>
          </div>
        </button>
      </div>
    </div>
  );
};

const HeartIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);
