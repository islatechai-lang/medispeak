'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { getLangName } from '@/lib/languages';
import SpeakButton from './SpeakButton';
import LoadingSpinner from './LoadingSpinner';
import styles from './MediActivation.module.css';

export default function MediActivation({ sourceLang, targetLang, isActive, onToggle }) {
  const [status, setStatus] = useState('idle');
  const [detectedCommand, setDetectedCommand] = useState('');
  const [translation, setTranslation] = useState(null);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const cleanup = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    cleanup();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError('Speech recognition not supported. Use Chrome.');
      return;
    }

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.maxAlternatives = 3;
    recognitionRef.current = rec;

    rec.onresult = (event) => {
      for (let i = 0; i < event.results.length; i++) {
        for (let j = 0; j < event.results[i].length; j++) {
          const text = event.results[i][j].transcript.toLowerCase().trim();
          if (text.includes('medi') || text.includes('medic') || text.includes('speak')) {
            // Extract command after wake word
            const cmd = text
              .replace(/^.*?(medi[\s-]?speak|medispeak|medi|speak)\s*[,.]?\s*/i, '')
              .trim();
            
            if (cmd.length > 2) {
              handleCommand(cmd);
              return;
            } else {
              // Wake word only — start recording for actual command
              startCommandCapture();
              return;
            }
          }
        }
      }
      // No wake word found, restart
      if (isActive) restartQuietly();
    };

    rec.onerror = () => {
      if (isActive) restartQuietly();
    };

    rec.onend = () => {
      if (isActive && status === 'listening') restartQuietly();
    };

    setStatus('listening');
    setError('');
    setDetectedCommand('');
    setTranslation(null);
    try { rec.start(); } catch {}
  }, [isActive, status]);

  const restartQuietly = useCallback(() => {
    setTimeout(() => {
      if (!isActive) return;
      cleanup();
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return;
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.maxAlternatives = 3;
      recognitionRef.current = rec;

      rec.onresult = (event) => {
        for (let i = 0; i < event.results.length; i++) {
          for (let j = 0; j < event.results[i].length; j++) {
            const text = event.results[i][j].transcript.toLowerCase().trim();
            if (text.includes('medi') || text.includes('speak')) {
              const cmd = text.replace(/^.*?(medi[\s-]?speak|medispeak|medi|speak)\s*[,.]?\s*/i, '').trim();
              if (cmd.length > 2) { handleCommand(cmd); return; }
              else { startCommandCapture(); return; }
            }
          }
        }
        if (isActive) restartQuietly();
      };
      rec.onerror = () => { if (isActive) restartQuietly(); };
      rec.onend = () => { if (isActive) restartQuietly(); };
      try { rec.start(); } catch {}
    }, 500);
  }, [isActive]);

  const startCommandCapture = useCallback(() => {
    cleanup();
    setStatus('triggered');
    
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';
    recognitionRef.current = rec;

    rec.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript?.trim();
      if (text) handleCommand(text);
      else { setError('No command heard'); if (isActive) setTimeout(startListening, 2000); }
    };
    rec.onerror = () => { setError('Could not hear command'); if (isActive) setTimeout(startListening, 2000); };
    rec.onend = () => {};
    try { rec.start(); } catch {}
  }, [isActive]);

  const handleCommand = async (command) => {
    const clean = command
      .replace(/^(tell|say|translate|open and tell|open and say)\s+(the\s+)?(nurse|patient|doctor)\s+(that\s+)?/i, '')
      .replace(/^[,.\s]+/, '')
      .trim() || command;

    setDetectedCommand(clean);
    setStatus('processing');

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean, sourceLang, targetLang, context: 'urgent voice command' }),
      });
      if (!res.ok) throw new Error('fail');
      const data = await res.json();
      setTranslation(data);
      setStatus('speaking');

      // Auto-play
      try {
        const ttsRes = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: data.translation, langCode: targetLang }),
        });
        if (ttsRes.ok) {
          const blob = await ttsRes.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.onended = () => { URL.revokeObjectURL(url); if (isActive) setTimeout(startListening, 2000); };
          await audio.play();
        } else if (isActive) setTimeout(startListening, 2000);
      } catch { if (isActive) setTimeout(startListening, 2000); }
    } catch {
      setError('Translation failed');
      if (isActive) setTimeout(startListening, 2000);
    }
  };

  useEffect(() => {
    if (isActive) startListening();
    else { cleanup(); setStatus('idle'); }
    return cleanup;
  }, [isActive]);

  const labels = {
    idle: 'Medi Activation is off',
    listening: 'Listening for "Medi Speak"...',
    triggered: 'Speak your command now...',
    processing: 'Translating...',
    speaking: 'Speaking translation...',
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.icon}>🎯</span>
            <div>
              <h3 className={styles.title}>Medi Activation</h3>
              <p className={styles.desc}>Say &quot;Medi Speak&quot; + your command</p>
            </div>
          </div>
          <button className={`${styles.toggleBtn} ${isActive ? styles.active : ''}`} onClick={onToggle}>
            {isActive ? 'ON' : 'OFF'}
          </button>
        </div>

        {isActive && (
          <div className={styles.body}>
            <div className={`${styles.statusRow} ${styles[status]}`}>
              <span className={styles.statusDot}></span>
              <span className={styles.statusText}>{labels[status]}</span>
            </div>

            {status === 'listening' && (
              <div className={styles.waveContainer}>
                {[0,1,2,3,4].map(i => <div key={i} className={styles.wave}></div>)}
              </div>
            )}

            {status === 'processing' && <LoadingSpinner size="sm" />}

            {detectedCommand && (
              <div className={styles.commandCard}>
                <p className={styles.commandLabel}>You said:</p>
                <p className={styles.commandText}>&quot;{detectedCommand}&quot;</p>
              </div>
            )}

            {translation && (
              <div className={styles.resultCard}>
                <p className={styles.resultLabel}>{getLangName(targetLang)}:</p>
                <p className={styles.resultText}>{translation.translation}</p>
                <SpeakButton text={translation.translation} langCode={targetLang} size="sm" />
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}
            <p className={styles.example}>💡 &quot;Medi Speak, I feel dizzy&quot; → auto-translates &amp; speaks</p>
          </div>
        )}
      </div>
    </div>
  );
}
