import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../firebase.ts';

interface AuthProps {
  onSuccess: () => void;
}

type AuthMode = 'LOGIN' | 'REGISTER';

export const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const translateError = (code: string) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return "อีเมลนี้ถูกใช้งานแล้ว";
      case 'auth/invalid-email':
        return "รูปแบบอีเมลไม่ถูกต้อง";
      case 'auth/weak-password':
        return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
      case 'auth/user-not-found':
        return "ไม่พบบัญชีผู้ใช้นี้";
      case 'auth/wrong-password':
        return "รหัสผ่านไม่ถูกต้อง";
      case 'auth/invalid-credential':
        return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      default:
        return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'REGISTER') {
        if (password.length < 6) {
          throw { code: 'auth/weak-password' };
        }
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(translateError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 font-['Kanit']">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border-4 border-gray-900">
        {/* Tabs */}
        <div className="flex mb-8 bg-gray-100 p-1 rounded-xl border-2 border-gray-200">
          <button
            onClick={() => { setMode('LOGIN'); setError(''); }}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              mode === 'LOGIN' 
                ? 'bg-white text-blue-600 shadow-sm border-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => { setMode('REGISTER'); setError(''); }}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              mode === 'REGISTER' 
                ? 'bg-white text-green-600 shadow-sm border-2 border-green-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ลงทะเบียน
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {mode === 'LOGIN' ? 'ยินดีต้อนรับกลับมา! 👋' : 'สร้างบัญชีใหม่ ✨'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">อีเมล</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">รหัสผ่าน</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
              placeholder="••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl text-sm font-bold animate-shake">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all border-b-4 active:translate-y-1 active:border-b-0 ${
              mode === 'LOGIN' 
                ? 'bg-blue-600 border-blue-800 hover:bg-blue-700' 
                : 'bg-green-600 border-green-800 hover:bg-green-700'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                กำลังดำเนินการ...
              </div>
            ) : (
              mode === 'LOGIN' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
