'use client';
import { useState, useEffect } from 'react';
import styles from './OfflineModal.module.css';
import { IconWifiOff } from './Icons';

export default function OfflineModal({ isOnline }) {
  const [show, setShow] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Only show once per offline session
    if (!isOnline && !hasShown) {
      setShow(true);
      setHasShown(true);
    } else if (isOnline) {
      setHasShown(false);
      setShow(false);
    }
  }, [isOnline, hasShown]);

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconWrap}>
          <IconWifiOff size={32} />
        </div>
        <h2 className={styles.title}>You are offline</h2>
        <p className={styles.desc}>
          MediSpeak is currently running in offline mode. Some features may be limited:
        </p>
        <ul className={styles.list}>
          <li>• <strong>Voice Translations</strong> will only use pre-downloaded phrases.</li>
          <li>• <strong>Custom typing translation</strong> will not work.</li>
          <li>• <strong>Speech-to-Text (Voice Screen)</strong> will not work.</li>
        </ul>
        <p className={styles.sub}>
          Emergency phrases and symptom categories will continue to work normally using local data.
        </p>
        <button className={styles.btn} onClick={() => setShow(false)}>
          Got it
        </button>
      </div>
    </div>
  );
}
