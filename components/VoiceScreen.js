'use client';
import { useState, useRef, useCallback } from 'react';
import { getLangName } from '@/lib/languages';
import { IconMicrophone, IconStop } from './Icons';
import MediActivation from './MediActivation';
import SpeakButton from './SpeakButton';
import LoadingSpinner from './LoadingSpinner';
import styles from './VoiceScreen.module.css';

export default function VoiceScreen({ sourceLang, targetLang }) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [translation, setTranslation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [mediActive, setMediActive] = useState(false);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = useCallback(async () => {
    setError('');
    setTranscript('');
    setTranslation(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          channelCount: 1, 
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start(250);
      setIsListening(true);
    } catch (err) {
      console.error('Mic error:', err);
      setError('Could not access microphone. Please allow microphone permission.');
    }
  }, [sourceLang]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsListening(false);
  }, []);

  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', sourceLang);

      const res = await fetch('/api/stt', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('STT failed');

      const data = await res.json();
      
      if (data.transcript) {
        setTranscript(data.transcript);
        if (autoTranslate) {
          await handleTranslate(data.transcript);
        }
      } else {
        setError('No speech detected. Please try again.');
      }
    } catch (err) {
      console.error('STT error:', err);
      setError('Speech recognition failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranslate = async (text) => {
    if (!text?.trim()) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), sourceLang, targetLang, context: 'spoken nurse-patient communication' }),
      });
      if (res.ok) {
        const data = await res.json();
        setTranslation(data);
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleToggleMic = () => {
    if (isListening) stopRecording();
    else startRecording();
  };

  return (
    <div className={styles.screen}>
      {/* Medi Activation — Wake Word Feature */}
      <MediActivation
        sourceLang={sourceLang}
        targetLang={targetLang}
        isActive={mediActive}
        onToggle={() => setMediActive(!mediActive)}
      />

      <div className={styles.introWrap}>
        <p className={styles.introText}>
          Speak directly into the microphone for instant translation. You can toggle auto-translate for a faster conversation.
        </p>
      </div>

      <div className={styles.micSection}>
        <p className={styles.instruction}>
          {isListening ? `Recording in ${getLangName(sourceLang)}...` : isProcessing ? 'Processing speech...' : 'Tap to start speaking'}
        </p>
        <button
          className={`${styles.micBtn} ${isListening ? styles.listening : ''}`}
          onClick={handleToggleMic}
          disabled={isProcessing}
          aria-label={isListening ? 'Stop recording' : 'Start recording'}
        >
          <span className={styles.micIcon}>
            {isListening ? <IconStop size={28} /> : <IconMicrophone size={28} />}
          </span>
          {isListening && (
            <>
              <span className={styles.pulse}></span>
              <span className={styles.pulse2}></span>
            </>
          )}
        </button>
        <div className={styles.toggleRow}>
          <label className={styles.toggle}>
            <input type="checkbox" checked={autoTranslate} onChange={(e) => setAutoTranslate(e.target.checked)} />
            <span className={styles.toggleSlider}></span>
            <span className={styles.toggleLabel}>Auto-translate</span>
          </label>
        </div>
      </div>

      {isProcessing && <LoadingSpinner size="md" text="Recognizing speech with Deepgram..." />}

      {error && <div className={styles.errorCard}>{error}</div>}

      {transcript && !isProcessing && (
        <div className={styles.transcriptCard}>
          <div className={styles.transcriptHeader}>
            <span className={styles.langTag}>{getLangName(sourceLang)}</span>
            <SpeakButton text={transcript} langCode={sourceLang} size="sm" />
          </div>
          <p className={styles.transcriptText}>{transcript}</p>
          {!autoTranslate && (
            <div className={styles.manualWrap}>
              <button className={styles.manualTranslateBtn} onClick={() => handleTranslate(transcript)}>
                Translate
              </button>
            </div>
          )}
        </div>
      )}

      {isTranslating && <LoadingSpinner size="md" text="Translating..." />}

      {translation && !isTranslating && (
        <div className={styles.resultCard}>
          <div className={styles.transcriptHeader}>
            <span className={styles.langTagResult}>{getLangName(targetLang)}</span>
            <SpeakButton 
              text={translation.translation} 
              langCode={targetLang} 
              size="md" 
              label="Play" 
              autoPlay={autoTranslate} 
            />
          </div>
          <p className={styles.resultText}>{translation.translation}</p>
          {translation.pronunciation && (
            <p className={styles.pronunciation}>{translation.pronunciation}</p>
          )}
        </div>
      )}
    </div>
  );
}
