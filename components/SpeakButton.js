'use client';
import { useState, useRef } from 'react';
import { IconVolume, IconStop } from './Icons';
import styles from './SpeakButton.module.css';

export default function SpeakButton({ text, langCode = 'en', size = 'md', label }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const handleClick = async () => {
    if (isSpeaking) {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        URL.revokeObjectURL(audioRef.current.src);
      }
      setIsSpeaking(false);
      return;
    }

    if (!text?.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 500), langCode }),
      });

      if (!res.ok) {
        throw new Error('TTS request failed');
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
      setIsSpeaking(true);
    } catch (err) {
      console.error('TTS error:', err);
      // Fallback to browser TTS
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode === 'ceb' ? 'fil' : langCode === 'tl' ? 'fil' : langCode;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      } catch {
        setIsSpeaking(false);
      }
    } finally {
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
