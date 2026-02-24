
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase.ts';
import { Layout } from './components/Layout.tsx';
import { Auth } from './components/Auth.tsx';
import { Setup } from './components/Setup.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { Intro } from './components/Intro.tsx';
import { Quiz } from './components/Quiz.tsx';
import { MemoryGame } from './components/MemoryGame.tsx';
import { ShooterGame } from './components/ShooterGame.tsx';
import { LevelUp } from './components/LevelUp.tsx';
import { Gacha } from './components/Gacha.tsx';
import { KeepMemories } from './components/KeepMemories.tsx';
import { Admin } from './components/Admin.tsx';
import { PhotoGallery } from './components/PhotoGallery.tsx';
import { PlayerLogin } from './components/PlayerLogin.tsx';
import { Welcome } from './components/Welcome.tsx';
import { Scene, AppConfig } from './types.ts';

const DEFAULT_CONFIG: AppConfig = {
  adminName: 'Champ',
  dialogueEmoji: '🧙🏻‍♂️',
  primaryColor: 'green',
  secondaryColor: 'pink',
  partnerName: 'Oui',
  specialDate: '29062544',
  hint1: 'วันเกิดเค้าไง',
  hint2: 'DDMMYYYY นะ',
  questions: [
    {
      question: "แชมป์ชอบกินอะไร?",
      options: ["ข้าวผัดใส่แครอทเยอะๆ", "ผัดพริกแกงไก่เผ็ดๆ", "ถั่วลันเตา", "ข้าวกะเพราหมูกรอบ"],
      correctIndex: 0
    }
  ],
  gifts: [],
  finalMessage: 'ขอบคุณที่เป็นส่วนหนึ่งในชีวิตฉัน...',
  finalImageUrl: ''
};

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scene, setScene] = useState<Scene>(Scene.AUTH);
  const [isTestMode, setIsTestMode] = useState(false);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isPlayerMode, setIsPlayerMode] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check for Player Mode via Query Params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const playerId = params.get('playerId');
    
    if (playerId) {
      setIsPlayerMode(true);
      fetchPlayerConfig(playerId);
    }
  }, [location.search]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // If we are in player mode, we don't handle auth state for the creator
      if (new URLSearchParams(window.location.search).get('playerId')) {
        setUser(currentUser);
        return;
      }

      setUser(currentUser);
      if (currentUser) {
        await fetchUserStatus(currentUser.uid);
      } else {
        setScene(Scene.AUTH);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserStatus = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const mergedConfig = { ...DEFAULT_CONFIG, ...(data.config || {}) };
        setConfig(mergedConfig);
        
        if (data.isSetupComplete === true) {
          setScene(Scene.DASHBOARD);
        } else {
          setScene(Scene.SETUP);
        }
      } else {
        // New user doc
        await setDoc(doc(db, 'users', uid), {
          email: auth.currentUser?.email,
          createdAt: serverTimestamp(),
          isSetupComplete: false,
          config: DEFAULT_CONFIG
        });
        setConfig(DEFAULT_CONFIG);
        setScene(Scene.SETUP);
      }
    } catch (error) {
      console.error("Error fetching user status:", error);
      setScene(Scene.AUTH);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayerConfig = async (uid: string) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const mergedConfig = { ...DEFAULT_CONFIG, ...(docSnap.data().config || {}) };
        setConfig(mergedConfig);
        setScene(Scene.PLAYER_LOGIN);
      } else {
        alert("ไม่พบข้อมูลผู้ใช้นี้");
        setScene(Scene.AUTH);
      }
    } catch (error) {
      console.error("Error fetching player config:", error);
      alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      setScene(Scene.AUTH);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig: AppConfig, setupComplete: boolean = true) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { 
        config: newConfig, 
        isSetupComplete: setupComplete,
        email: user.email,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      setConfig(newConfig);
      if (setupComplete) {
        setScene(Scene.DASHBOARD);
      }
    } catch (error) {
      console.error("Error saving config:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleReset = () => {
    if (isPlayerMode || isTestMode) {
      setScene(Scene.PLAYER_LOGIN);
    } else {
      setScene(Scene.DASHBOARD);
    }
    setIsTestMode(false);
  };

  if (loading) {
    return (
      <Layout config={config}>
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-['Kanit'] font-bold text-pink-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const renderScene = () => {
    switch (scene) {
      case Scene.AUTH:
        return <Auth onSuccess={() => {}} />;
      case Scene.SETUP:
        return <Setup config={config} onSave={(cfg) => saveConfig(cfg, true)} />;
      case Scene.DASHBOARD:
        return (
          <Dashboard 
            config={config} 
            user={user!} 
            onEdit={() => setScene(Scene.ADMIN)} 
            onTest={() => { setIsTestMode(true); setScene(Scene.PLAYER_LOGIN); }}
            onGallery={() => setScene(Scene.PHOTO_GALLERY)}
          />
        );
      case Scene.PLAYER_LOGIN:
        return <PlayerLogin config={config} onSuccess={() => setScene(Scene.INTRO)} isTestMode={isTestMode} />;
      case Scene.WELCOME:
        return <Welcome config={config} onStart={() => setScene(Scene.PLAYER_LOGIN)} />;
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
        return (
          <Gacha 
            gifts={config.gifts} 
            finalMessage={config.finalMessage} 
            finalImageUrl={config.finalImageUrl}
            onComplete={() => setScene(Scene.KEEP_MEMORIES)} 
          />
        );
      case Scene.KEEP_MEMORIES:
        return (
          <KeepMemories 
            userId={isPlayerMode ? (new URLSearchParams(location.search).get('playerId') || '') : (user?.uid || '')} 
            onComplete={handleReset} 
          />
        );
      case Scene.ADMIN:
        return <Admin config={config} onSave={(cfg) => saveConfig(cfg, true)} onBack={() => setScene(Scene.DASHBOARD)} />;
      case Scene.PHOTO_GALLERY:
        return <PhotoGallery userId={user?.uid || ''} onBack={() => setScene(Scene.DASHBOARD)} />;
      default:
        return <Auth onSuccess={() => {}} />;
    }
  };

  return (
    <Layout config={config}>
      {renderScene()}
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;


