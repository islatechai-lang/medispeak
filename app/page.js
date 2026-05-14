'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import TranslateScreen from '@/components/TranslateScreen';
import VoiceScreen from '@/components/VoiceScreen';
import SymptomsScreen from '@/components/SymptomsScreen';
import PhrasesScreen from '@/components/PhrasesScreen';
import EducationScreen from '@/components/EducationScreen';
import HistoryScreen from '@/components/HistoryScreen';
import EmergencyPanel from '@/components/EmergencyPanel';
import OfflineModal from '@/components/OfflineModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState('translate');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ceb');
  const [isOnline, setIsOnline] = useState(true);
  const [theme, setTheme] = useState('light');
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('medispeak_theme');
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Register Service Worker for offline audio caching
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('[App] Service Worker registered, scope:', reg.scope);
      }).catch((err) => {
        console.warn('[App] Service Worker registration failed:', err);
      });
    }
  }, []);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('medispeak_theme', next);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'translate':
        return <TranslateScreen sourceLang={sourceLang} targetLang={targetLang} />;
      case 'voice':
        return <VoiceScreen sourceLang={sourceLang} targetLang={targetLang} />;
      case 'symptoms':
        return <SymptomsScreen targetLang={targetLang} />;
      case 'phrases':
        return <PhrasesScreen targetLang={targetLang} />;
      case 'education':
        return <EducationScreen targetLang={targetLang} />;
      case 'history':
        return <HistoryScreen />;
      default:
        return <TranslateScreen sourceLang={sourceLang} targetLang={targetLang} />;
    }
  };

  return (
    <div className="appContainer">
      <Header
        sourceLang={sourceLang}
        targetLang={targetLang}
        onSourceChange={setSourceLang}
        onTargetChange={setTargetLang}
        isOnline={isOnline}
        theme={theme}
        onThemeToggle={toggleTheme}
        activeTab={activeTab}
      />
      <main className="mainContent fadeIn" key={activeTab}>
        {renderScreen()}
      </main>

      {/* Emergency floating button */}
      <button
        className="emergencyFab"
        onClick={() => setShowEmergency(true)}
        aria-label="Emergency phrases"
        title="Emergency Phrases"
      >
        🚨
      </button>

      <EmergencyPanel
        targetLang={targetLang}
        onTargetChange={setTargetLang}
        isOpen={showEmergency}
        onClose={() => setShowEmergency(false)}
      />

      <OfflineModal isOnline={isOnline} />

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
