'use client';
import Image from 'next/image';
import { LANGUAGES } from '@/lib/languages';
import { IconSun, IconMoon, IconSwap } from './Icons';
import styles from './Header.module.css';

export default function Header({ sourceLang, targetLang, onSourceChange, onTargetChange, isOnline, theme, onThemeToggle, activeTab }) {
  const handleSwap = () => {
    onSourceChange(targetLang);
    onTargetChange(sourceLang);
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
