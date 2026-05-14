'use client';
import { useState, useEffect, useRef } from 'react';
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
import { SYMPTOMS } from '@/lib/symptomsData';
import { PHRASES } from '@/lib/phrasesData';
import { useIndexedDB } from '@/lib/useIndexedDB';

export default function Home() {
  const [activeTab, setActiveTab] = useState('translate');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ceb');
  const [isOnline, setIsOnline] = useState(true);
  const [theme, setTheme] = useState('light');
  const [showEmergency, setShowEmergency] = useState(false);
  const [audioCached, setAudioCached] = useState(false);
  const downloadedRef = useRef(new Set()); // tracks which langs have been downloaded
  const { saveAudio, getAudio } = useIndexedDB();

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

  // Background audio download — runs silently when online + targetLang changes
  useEffect(() => {
    if (!isOnline || !saveAudio || !getAudio) return;
    if (downloadedRef.current.has(targetLang)) {
      setAudioCached(true);
      return;
    }

    let cancelled = false;

    const downloadAll = async () => {
      const tasks = [];

      // Symptoms
      Object.values(SYMPTOMS).flat().forEach(s => {
        tasks.push(`${targetLang}/symptoms/${s.id}`);
      });

      // Phrases
      PHRASES.forEach(p => {
        tasks.push(`${targetLang}/phrases/${p.id}`);
      });

      // Emergency
      for (let i = 1; i <= 8; i++) {
        tasks.push(`${targetLang}/emergency/emg_${i}`);
      }

      for (const key of tasks) {
        if (cancelled) return;
        try {
          // Skip if already cached
          const existing = await getAudio(key);
          if (existing) continue;

          const res = await fetch(`/audio/${key}.wav`);
          if (res.ok) {
            const blob = await res.blob();
            await saveAudio(key, blob);
          }
        } catch {
          // Silently skip failures
        }
      }

      if (!cancelled) {
        downloadedRef.current.add(targetLang);
        setAudioCached(true);
      }
    };

    setAudioCached(false);
    downloadAll();

    return () => { cancelled = true; };
  }, [isOnline, targetLang, saveAudio, getAudio]);

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

      {/* Emergency floating button with green dot when audio is cached */}
      <button
        className="emergencyFab"
        onClick={() => setShowEmergency(true)}
        aria-label="Emergency phrases"
        title="Emergency Phrases"
      >
        🚨
        {audioCached && <span className="cachedDot"></span>}
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
