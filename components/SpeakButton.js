'use client';
import { useState, useRef, useEffect } from 'react';
import { useIndexedDB } from '@/lib/useIndexedDB';
import { IconVolume, IconStop, IconAlert } from './Icons';
import styles from './SpeakButton.module.css';

// Global reference to stop the currently playing audio across all SpeakButton instances
let globalStopCurrent = null;

/**
 * SpeakButton — plays audio for given text.
 * Priority: 1) IndexedDB cache  2) Pre-generated file  3) Gemini TTS API
 */
export default function SpeakButton({ text, langCode = 'en', size = 'md', label, audioId, autoPlay = false }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const audioRef = useRef(null);
  const { getAudio, saveAudio } = useIndexedDB();

  // Auto-play when text/audioId changes
  useEffect(() => {
    if (autoPlay && text) {
      setIsLoading(true); // Start spinning immediately
      const timer = setTimeout(() => {
        handleClick(true);
      }, 100);
      return () => {
        clearTimeout(timer);
        setIsLoading(false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, audioId, autoPlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSpeaking) stopCurrent();
    };
  }, [isSpeaking]);

  const stopCurrent = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsLoading(false);

    if (globalStopCurrent === stopCurrent) {
      globalStopCurrent = null;
    }
  };

  const showError = () => {
    setIsError(true);
    setTimeout(() => setIsError(false), 2000);
  };

  const playAudioUrl = (url) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audioRef.current = audio;

      // onplaying guarantees the browser actually started outputting sound
      audio.onplaying = () => {
        setIsSpeaking(true);
        setIsLoading(false);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        if (globalStopCurrent === stopCurrent) globalStopCurrent = null;
        resolve();
      };

      audio.onerror = (err) => {
        setIsSpeaking(false);
        setIsLoading(false);
        if (globalStopCurrent === stopCurrent) globalStopCurrent = null;
        reject(err);
      };

      audio.play().catch((err) => {
        setIsLoading(false);
        setIsSpeaking(false);
        if (globalStopCurrent === stopCurrent) globalStopCurrent = null;
        reject(err);
      });
    });
  };

  const handleClick = async (forcePlay = false) => {
    if (isSpeaking) {
      stopCurrent();
      if (!forcePlay) return; // Only abort if it was a manual toggle click
    }

    if (!text?.trim()) return;

    // Stop any other currently playing SpeakButton globally
    if (globalStopCurrent) {
      globalStopCurrent();
    }
    globalStopCurrent = stopCurrent;

    setIsLoading(true);

    // Build a cache key for IndexedDB
    const cacheKey = audioId ? `${langCode}/${audioId}` : `${langCode}/tts/${text.slice(0, 100)}`;

    // 1) Try IndexedDB cache (works offline)
    try {
      const cachedBlob = await getAudio(cacheKey);
      if (cachedBlob) {
        const url = URL.createObjectURL(cachedBlob);
        await playAudioUrl(url);
        return;
      }
    } catch (e) {
      // Cache miss or error, continue
    }

    // 2) Try pre-generated audio file from server
    if (audioId && langCode !== 'en') {
      const fileUrl = `/audio/${langCode}/${audioId}.wav`;
      try {
        const res = await fetch(fileUrl);
        if (res.ok) {
          const blob = await res.blob();
          // Save to IndexedDB for offline next time
          try { await saveAudio(cacheKey, blob); } catch {}
          const url = URL.createObjectURL(blob);
          await playAudioUrl(url);
          return;
        }
      } catch (e) {
        console.warn(`Pre-generated file failed: ${fileUrl}`);
      }
    }

    // 3) Try Gemini TTS API
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 500), langCode }),
      });

      if (res.ok) {
        const blob = await res.blob();
        // Save to IndexedDB for offline next time
        try { await saveAudio(cacheKey, blob); } catch {}
        const url = URL.createObjectURL(blob);
        await playAudioUrl(url);
        return;
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error(`TTS API failed: ${res.status} ${errData.error || 'Unknown error'}`);
      }
    } catch (apiErr) {
      console.error('TTS API request failed:', apiErr);
    }

    // 4) All failed — show error
    setIsLoading(false);
    setIsSpeaking(false);
    showError();
    if (globalStopCurrent === stopCurrent) globalStopCurrent = null;
  };

  return (
    <button
      className={`${styles.speakBtn} ${styles[size]} ${isSpeaking ? styles.active : ''} ${isLoading ? styles.loading : ''} ${isError ? styles.error : ''}`}
      onClick={() => handleClick()}
      disabled={isLoading || isError}
      title={isSpeaking ? 'Stop' : isError ? 'Error' : 'Listen'}
      aria-label={isSpeaking ? 'Stop speaking' : `Listen in ${langCode}`}
    >
      <span className={styles.icon}>
        {isLoading ? (
          <span className={styles.spinner}></span>
        ) : isError ? (
          <IconAlert size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
        ) : isSpeaking ? (
          <IconStop size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
        ) : (
          <IconVolume size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        )}
      </span>
      {label && <span className={styles.label}>{isError ? 'Quota Error' : label}</span>}
    </button>
  );
}
