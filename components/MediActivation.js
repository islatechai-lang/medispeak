'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { getLangName } from '@/lib/languages';
import { IconMicrophone, IconStop } from './Icons';
import SpeakButton from './SpeakButton';
import LoadingSpinner from './LoadingSpinner';
import styles from './MediActivation.module.css';

/**
 * MediActivation — "Medi Speak" Wake-Word Voice Command
 * 
 * Continuously listens for the wake phrase "Medi Speak" using the Web Speech API.
 * When triggered, it records the full command, transcribes via Deepgram, 
 * translates via Gemini, and speaks the result via Gemini TTS.
 * 
 * Example: "Medi Speak, tell the nurse I feel dizzy"
 *   → Detects wake word → Captures "tell the nurse I feel dizzy"
 *   → Translates to target language → Speaks aloud
 */
export default function MediActivation({ sourceLang, targetLang, isActive, onToggle }) {
  const [status, setStatus] = useState('idle'); // idle | listening | triggered | processing | speaking
  const [detectedCommand, setDetectedCommand] = useState('');
  const [translation, setTranslation] = useState(null);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // Start wake-word listening
  const startWakeWordListener = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('Speech recognition not supported. Use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase().trim();
        
        // Check for wake word "medi speak" or variations
        if (transcript.includes('medi speak') || transcript.includes('medispeak') || transcript.includes('medi-speak')) {
          // Extract the command after the wake word
          const parts = transcript.split(/medi[\s-]?speak/i);
          const command = parts[parts.length - 1]?.trim();
          
          if (event.results[i].isFinal && command) {
            recognition.stop();
            handleWakeWordTriggered(command);
          } else if (event.results[i].isFinal && !command) {
            // Wake word detected but no command yet — start recording for command
            recognition.stop();
            startCommandRecording();
          }
        }
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        console.error('Wake word error:', e.error);
      }
      // Restart listening after error
      if (isActiveRef.current) {
        setTimeout(() => {
          try { recognition.start(); } catch {}
        }, 1000);
      }
    };

    recognition.onend = () => {
      // Auto-restart if still active
      if (isActiveRef.current && status !== 'triggered' && status !== 'processing') {
        setTimeout(() => {
          try { recognition.start(); } catch {}
        }, 300);
      }
    };

    recognitionRef.current = recognition;
    setStatus('listening');
    setError('');
    try { recognition.start(); } catch {}
  }, [status]);

  // Stop wake-word listening
  const stopWakeWordListener = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setStatus('idle');
  }, []);

  // Start/stop based on isActive
  useEffect(() => {
    if (isActive) {
      startWakeWordListener();
    } else {
      stopWakeWordListener();
    }
    return () => stopWakeWordListener();
  }, [isActive]);

  // Record command after wake word is detected alone
  const startCommandRecording = async () => {
    setStatus('triggered');
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm',
      });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processCommand(blob);
      };

      recorder.start(250);

      // Auto-stop after 8 seconds
      setTimeout(() => {
        if (recorder.state !== 'inactive') {
          recorder.stop();
          stream.getTracks().forEach(t => t.stop());
        }
      }, 8000);
    } catch {
      setError('Microphone access denied');
      setStatus('listening');
    }
  };

  // Process recorded command via Deepgram
  const processCommand = async (audioBlob) => {
    setStatus('processing');
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'command.webm');
      formData.append('language', sourceLang);

      const sttRes = await fetch('/api/stt', { method: 'POST', body: formData });
      if (!sttRes.ok) throw new Error('STT failed');
      
      const sttData = await sttRes.json();
      if (sttData.transcript) {
        await handleWakeWordTriggered(sttData.transcript);
      } else {
        setError('No command detected. Try again.');
        restartListening();
      }
    } catch {
      setError('Command processing failed');
      restartListening();
    }
  };

  // Handle the full command after wake word
  const handleWakeWordTriggered = async (command) => {
    // Clean command - remove common prefixes
    const cleanCmd = command
      .replace(/^(tell|say|translate|open and tell|open and say)\s+(the\s+)?(nurse|patient|doctor)\s+(that\s+)?/i, '')
      .replace(/^,?\s*/, '')
      .trim();
    
    const finalText = cleanCmd || command;
    setDetectedCommand(finalText);
    setStatus('processing');

    try {
      // Translate
      const translateRes = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: finalText,
          sourceLang,
          targetLang,
          context: 'urgent nurse-patient voice command communication',
        }),
      });

      if (!translateRes.ok) throw new Error('Translation failed');
      const translateData = await translateRes.json();
      setTranslation(translateData);
      setStatus('speaking');

      // Auto-play TTS
      try {
        const ttsRes = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: translateData.translation, langCode: targetLang }),
        });

        if (ttsRes.ok) {
          const audioBlob = await ttsRes.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            restartListening();
          };
          await audio.play();
        } else {
          restartListening();
        }
      } catch {
        restartListening();
      }
    } catch {
      setError('Translation failed');
      restartListening();
    }
  };

  const restartListening = () => {
    setTimeout(() => {
      if (isActiveRef.current) {
        setStatus('listening');
        setDetectedCommand('');
        setTranslation(null);
        setError('');
        startWakeWordListener();
      } else {
        setStatus('idle');
      }
    }, 3000);
  };

  const statusText = {
    idle: 'Medi Activation is off',
    listening: 'Listening for "Medi Speak"...',
    triggered: 'Command detected — recording...',
    processing: 'Processing command...',
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
              <p className={styles.desc}>Say "Medi Speak" followed by your command</p>
            </div>
          </div>
          <button
            className={`${styles.toggleBtn} ${isActive ? styles.active : ''}`}
            onClick={onToggle}
          >
            {isActive ? 'ON' : 'OFF'}
          </button>
        </div>

        {isActive && (
          <div className={styles.body}>
            <div className={`${styles.statusRow} ${styles[status]}`}>
              <span className={styles.statusDot}></span>
              <span className={styles.statusText}>{statusText[status]}</span>
            </div>

            {status === 'listening' && (
              <div className={styles.waveContainer}>
                <div className={styles.wave}></div>
                <div className={styles.wave}></div>
                <div className={styles.wave}></div>
                <div className={styles.wave}></div>
                <div className={styles.wave}></div>
              </div>
            )}

            {status === 'processing' && <LoadingSpinner size="sm" />}

            {detectedCommand && (
              <div className={styles.commandCard}>
                <p className={styles.commandLabel}>Detected:</p>
                <p className={styles.commandText}>"{detectedCommand}"</p>
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

            <p className={styles.example}>
              💡 Example: "Medi Speak, I feel dizzy" → auto-translates & speaks
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
