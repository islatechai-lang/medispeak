'use client';
import { useState, useRef } from 'react';
import { IconVolume, IconStop } from './Icons';
import styles from './SpeakButton.module.css';

/**
 * SpeakButton — plays audio for given text.
 * Priority: 1) Pre-generated file from /audio/  2) Gemini TTS API  3) Browser TTS fallback
 */
export default function SpeakButton({ text, langCode = 'en', size = 'md', label, audioId }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const stopCurrent = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioRef.current.src.startsWith('blob:')) URL.revokeObjectURL(audioRef.current.src);
    }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsLoading(false);
  };

  const playAudioUrl = (url) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setIsSpeaking(false); resolve(); };
      audio.onerror = () => { setIsSpeaking(false); setIsLoading(false); reject(); };
      
      audio.play().then(() => {
        setIsSpeaking(true);
        setIsLoading(false);
      }).catch((err) => {
        setIsLoading(false);
        reject(err);
      });
    });
  };

  const handleClick = async () => {
    if (isSpeaking) { stopCurrent(); return; }
    if (!text?.trim()) return;

    setIsLoading(true);

    // 1) Try pre-generated audio file
    if (audioId && langCode !== 'en') {
      const fileUrl = `/audio/${langCode}/${audioId}.wav`;
      try {
        // Do not use fetch() here because it fails when offline even if the file is in browser cache.
        // new Audio() will automatically use the browser's disk cache.
        await playAudioUrl(fileUrl);
        return; // If successful, exit.
      } catch (e) {
        // File not found or not cached. Proceed to fallback.
      }
    }

    // 2) Try Gemini TTS API
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 500), langCode }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        playAudioUrl(url).catch(() => {});
        return;
      }
    } catch {}

    // 3) Fallback: browser TTS
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode === 'ceb' || langCode === 'tl' ? 'fil' : langCode;
      
      let ttsTimeout;
      
      utterance.onstart = () => {
        clearTimeout(ttsTimeout);
        setIsSpeaking(true);
        setIsLoading(false);
      };
      
      utterance.onend = () => {
        clearTimeout(ttsTimeout);
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        clearTimeout(ttsTimeout);
        setIsSpeaking(false);
        setIsLoading(false);
      };
      
      window.speechSynthesis.speak(utterance);
      
      // Safety timeout: if TTS engine hangs (common when offline without local voices)
      ttsTimeout = setTimeout(() => {
        if (!isSpeaking) {
          window.speechSynthesis?.cancel();
          setIsSpeaking(false);
          setIsLoading(false);
        }
      }, 2000);
      
    } catch {
      setIsSpeaking(false);
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`${styles.speakBtn} ${styles[size]} ${isSpeaking ? styles.active : ''} ${isLoading ? styles.loading : ''}`}
      onClick={handleClick}
      disabled={isLoading}
      title={isSpeaking ? 'Stop' : 'Listen'}
      aria-label={isSpeaking ? 'Stop speaking' : `Listen in ${langCode}`}
    >
      <span className={styles.icon}>
        {isLoading ? (
          <span className={styles.spinner}></span>
        ) : isSpeaking ? (
          <IconStop size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
        ) : (
          <IconVolume size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        )}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </button>
  );
}
