
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase.ts';
import { Layout } from './components/Layout.tsx';
import { Welcome } from './components/Welcome.tsx';
import { Auth } from './components/Auth.tsx';
import { Intro } from './components/Intro.tsx';
import { Quiz } from './components/Quiz.tsx';
import { MemoryGame } from './components/MemoryGame.tsx';
import { ShooterGame } from './components/ShooterGame.tsx';
import { LevelUp } from './components/LevelUp.tsx';
import { Gacha } from './components/Gacha.tsx';
import { KeepMemories } from './components/KeepMemories.tsx';
import { Admin } from './components/Admin.tsx';
import { Scene, AppConfig } from './types.ts';

const DEFAULT_CONFIG: AppConfig = {
  adminName: 'Champ',
  dialogueEmoji: '🧙🏻‍♂️',
  primaryColor: 'green',
  secondaryColor: 'pink',
  partnerName: 'Oui',
  specialDate: '29062544',
  questions: [
    {
      question: "แชมป์ชอบกินอะไร?",
      options: ["ข้าวผัดใส่แครอทเยอะๆ", "ผัดพริกแกงไก่เผ็ดๆ", "ถั่วลันเตา", "ข้าวกะเพราหมูกรอบ"],
      correctIndex: 0
    },
    {
      question: "เราเจอกันที่ไหน?",
      options: ["ทินเดอร์", "ห้องสมุด", "วัด", "บนบีทีเอส"],
      correctIndex: 0 
    }
  ]
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scene, setScene] = useState<Scene>(Scene.WELCOME);
  const [isTestMode, setIsTestMode] = useState(false);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchConfig(currentUser.uid);
      } else {
        setConfig(DEFAULT_CONFIG);
        setScene(Scene.AUTH);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchConfig = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setConfig(docSnap.data().config);
      } else {
        // Create initial config for new user
        const initialData = {
          email: auth.currentUser?.email,
          createdAt: serverTimestamp(),
          config: DEFAULT_CONFIG
        };
        await setDoc(docRef, initialData);
        setConfig(DEFAULT_CONFIG);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  };

  const saveConfig = async (newConfig: AppConfig) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { config: newConfig }, { merge: true });
      setConfig(newConfig);
    } catch (error) {
      console.error("Error saving config:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleAuthSuccess = () => {
    setScene(Scene.INTRO);
  };

  const handleReset = () => {
    setScene(Scene.WELCOME);
    setIsTestMode(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-['Kanit'] font-bold text-green-700">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  const renderScene = () => {
    switch (scene) {
      case Scene.WELCOME:
        return <Welcome onStart={() => setScene(user ? Scene.INTRO : Scene.AUTH)} config={config} />;
      case Scene.AUTH:
        return <Auth onSuccess={handleAuthSuccess} />;
      case Scene.INTRO:
        return <Intro onNext={() => setScene(Scene.QUIZ)} config={config} />;
      case Scene.QUIZ:
        return <Quiz onComplete={() => setScene(Scene.MEMORY_GAME)} config={config} />;
      case Scene.MEMORY_GAME:
        return <MemoryGame onComplete={() => setScene(Scene.SHOOTER_GAME)} config={config} />;
      case Scene.SHOOTER_GAME:
        return <ShooterGame onComplete={() => setScene(Scene.LEVEL_UP)} config={config} />;
      case Scene.LEVEL_UP:
        return <LevelUp onComplete={() => setScene(Scene.GACHA)} config={config} />;
      case Scene.GACHA:
        return <Gacha onReset={handleReset} onKeepMemories={() => setScene(Scene.KEEP_MEMORIES)} config={config} />;
      case Scene.KEEP_MEMORIES:
        return <KeepMemories onRestart={handleReset} testMode={isTestMode} config={config} />;
      case Scene.ADMIN:
        return <Admin config={config} onSave={saveConfig} onBack={() => setScene(Scene.INTRO)} />;
      default:
        return <Welcome onStart={() => setScene(user ? Scene.INTRO : Scene.AUTH)} config={config} />;
    }
  };

  return (
    <Layout config={config}>
      {user && scene !== Scene.ADMIN && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button 
            onClick={() => setScene(Scene.ADMIN)}
            className="bg-gray-800 text-white p-2 rounded-lg text-xs font-bold border-b-2 border-gray-900 active:translate-y-0.5"
          >
            ⚙️ ตั้งค่า
          </button>
        </div>
      )}
      {renderScene()}
    </Layout>
  );
}

export default App;

