
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout.tsx';
import { Welcome } from './components/Welcome.tsx';
import { Login, LoginDestination } from './components/Login.tsx';
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
  const [scene, setScene] = useState<Scene>(Scene.WELCOME);
  const [isTestMode, setIsTestMode] = useState(false);
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('valentine_quest_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const handleLoginSuccess = (destination: LoginDestination) => {
    if (destination === 'ADMIN' as any) {
      setScene(Scene.ADMIN);
      return;
    }
    
    switch (destination) {
      case 'GACHA':
        setScene(Scene.GACHA);
        break;
      case 'MEMORIES':
        setIsTestMode(false);
        setScene(Scene.KEEP_MEMORIES);
        break;
      case 'MEMORIES_TEST':
        setIsTestMode(true);
        setScene(Scene.KEEP_MEMORIES);
        break;
      case 'INTRO':
      default:
        setScene(Scene.INTRO);
        break;
    }
  };

  const saveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem('valentine_quest_config', JSON.stringify(newConfig));
  };

  const handleReset = () => {
    setScene(Scene.WELCOME);
    setIsTestMode(false);
  };

  const renderScene = () => {
    switch (scene) {
      case Scene.WELCOME:
        return <Welcome onStart={() => setScene(Scene.LOGIN)} config={config} />;
      case Scene.LOGIN:
        return <Login onSuccess={handleLoginSuccess} config={config} />;
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
        return <Admin config={config} onSave={saveConfig} onBack={() => setScene(Scene.LOGIN)} />;
      default:
        return <Welcome onStart={() => setScene(Scene.LOGIN)} config={config} />;
    }
  };

  return (
    <Layout config={config}>
      {renderScene()}
    </Layout>
  );
}

export default App;
