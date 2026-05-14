'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { LANGUAGES } from '@/lib/languages';
import { IconSun, IconMoon, IconSwap, IconChevronDown } from './Icons';
import styles from './Header.module.css';

function LangPicker({ value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = LANGUAGES.find(l => l.code === value) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler); };
  }, []);

  return (
    <div className={styles.langPicker} ref={ref}>
      <button
        className={styles.langTrigger}
        onClick={() => setOpen(!open)}
        aria-label={label}
      >
        <span className={styles.langFlag}>{selected.flag}</span>
        <span className={styles.langName}>{selected.name}</span>
        <span className={`${styles.langChevron} ${open ? styles.langChevronUp : ''}`}>
          <IconChevronDown size={14} />
        </span>
      </button>

      {open && (
        <div className={styles.langDropdown}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              className={`${styles.langOption} ${l.code === value ? styles.langOptionActive : ''}`}
              onClick={() => { onChange(l.code); setOpen(false); }}
            >
              <span className={styles.langOptFlag}>{l.flag}</span>
              <span className={styles.langOptName}>{l.name}</span>
              {l.code === value && <span className={styles.langOptCheck}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
          <LangPicker value={sourceLang} onChange={onSourceChange} label="Source language" />

          <button className={styles.swapBtn} onClick={handleSwap} aria-label="Swap languages">
            <IconSwap size={16} />
          </button>

          <LangPicker value={targetLang} onChange={onTargetChange} label="Target language" />
        </div>
      ) : (
        <div className={styles.langBarSimple}>
          <span className={styles.langLabel}>Patient Language:</span>
          <LangPicker value={targetLang} onChange={onTargetChange} label="Patient language" />
        </div>
      )}
    </header>
  );
}
