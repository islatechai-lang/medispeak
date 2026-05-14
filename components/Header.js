'use client';
import { useState } from 'react';
import Image from 'next/image';
import { LANGUAGES } from '@/lib/languages';
import { SYMPTOMS } from '@/lib/symptomsData';
import { PHRASES } from '@/lib/phrasesData';
import { useIndexedDB } from '@/lib/useIndexedDB';
import { IconSun, IconMoon, IconSwap, IconDownload, IconCheck } from './Icons';
import styles from './Header.module.css';

export default function Header({ sourceLang, targetLang, onSourceChange, onTargetChange, isOnline, theme, onThemeToggle, activeTab }) {
  const [dlStatus, setDlStatus] = useState('idle'); // idle, loading, success
  const { saveAudio } = useIndexedDB();

  const handleSwap = () => {
    onSourceChange(targetLang);
    onTargetChange(sourceLang);
  };

  const handleDownloadAll = async () => {
    if (dlStatus === 'loading') return;
    setDlStatus('loading');

    const tasks = [];

    // Queue Symptoms
    Object.values(SYMPTOMS).flat().forEach(s => {
      tasks.push({ id: s.id, type: 'symptoms' });
    });

    // Queue Phrases
    PHRASES.forEach(p => {
      tasks.push({ id: p.id, type: 'phrases' });
    });

    // Emergency
    ['emg_1', 'emg_2', 'emg_3', 'emg_4', 'emg_5', 'emg_6', 'emg_7', 'emg_8'].forEach(id => {
      tasks.push({ id, type: 'emergency' });
    });

    try {
      let count = 0;
      for (const task of tasks) {
        const path = `${targetLang}/${task.type}/${task.id}`;
        const url = `/audio/${path}.wav`;
        
        try {
          const res = await fetch(url);
          if (res.ok) {
            const blob = await res.blob();
            await saveAudio(path, blob);
            count++;
          }
        } catch (e) {
          // Ignore 404s for non-generated files
        }
      }
      setDlStatus('success');
      setTimeout(() => setDlStatus('idle'), 3000);
    } catch (err) {
      console.error('Download failed', err);
      setDlStatus('idle');
    }
  };

  const showFullLangBar = activeTab === 'translate' || activeTab === 'voice';

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.brand}>
          <span className={styles.logoIcon}>
            <Image src="/medispeak_logo.png" alt="MediSpeak" width={40} height={40} className={styles.logoImg} />
          </span>
          <div>
            <h1 className={styles.title}>MediSpeak</h1>
            <p className={styles.subtitle}>Nurse-Patient Communication</p>
          </div>
        </div>
        <div className={styles.topActions}>
          {isOnline && (
            <button
              className={`${styles.downloadBtn} ${dlStatus === 'loading' ? styles.loading : ''} ${dlStatus === 'success' ? styles.success : ''}`}
              onClick={handleDownloadAll}
              disabled={dlStatus === 'loading'}
              title="Download regional audio for offline use"
            >
              {dlStatus === 'loading' ? (
                <span className={styles.spinner}></span>
              ) : dlStatus === 'success' ? (
                <IconCheck size={16} />
              ) : (
                <IconDownload size={16} />
              )}
            </button>
          )}
          <button
            className={styles.themeBtn}
            onClick={onThemeToggle}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
          </button>
          <div className={`${styles.statusBadge} ${isOnline ? styles.online : styles.offline}`}>
            <span className={styles.statusDot}></span>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {showFullLangBar ? (
        <div className={styles.langBar}>
          <select
            className={styles.langSelect}
            value={sourceLang}
            onChange={(e) => onSourceChange(e.target.value)}
            aria-label="Source language"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>

          <button className={styles.swapBtn} onClick={handleSwap} aria-label="Swap languages">
            <IconSwap size={16} />
          </button>

          <select
            className={styles.langSelect}
            value={targetLang}
            onChange={(e) => onTargetChange(e.target.value)}
            aria-label="Target language"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className={styles.langBarSimple}>
          <span className={styles.langLabel}>Patient Language:</span>
          <select
            className={styles.langSelect}
            value={targetLang}
            onChange={(e) => onTargetChange(e.target.value)}
            aria-label="Patient language"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
        </div>
      )}
    </header>
  );
}
