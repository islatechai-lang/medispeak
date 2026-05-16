'use client';
import { IconTranslate, IconMicrophone, IconStethoscope, IconZap, IconBook, IconClipboard } from './Icons';
import styles from './BottomNav.module.css';

const TABS = [
  { id: 'translate', icon: IconTranslate, label: 'Translate' },
  { id: 'symptoms', icon: IconStethoscope, label: 'Symptoms' },
  { id: 'phrases', icon: IconZap, label: 'Phrases' },
  { id: 'education', icon: IconBook, label: 'Learn' },
  { id: 'history', icon: IconClipboard, label: 'History' },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <div className={styles.inner}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <span className={styles.icon}><Icon size={20} /></span>
              <span className={styles.label}>{tab.label}</span>
              {activeTab === tab.id && <span className={styles.indicator}></span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
