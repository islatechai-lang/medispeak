'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getLangName } from '@/lib/languages';
import { useIndexedDB } from '@/lib/useIndexedDB';
import { IconCopy, IconTrash, IconMicrophone, IconStop } from './Icons';
import SpeakButton from './SpeakButton';
import LoadingSpinner from './LoadingSpinner';
import Toast from './Toast';
import styles from './TranslateScreen.module.css';

export default function TranslateScreen({ sourceLang, targetLang }) {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingSTT, setIsProcessingSTT] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [longPressId, setLongPressId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const longPressTimer = useRef(null);
  const { addRecentTranslation, getRecentTranslations, deleteRecentTranslation } = useIndexedDB();

  useEffect(() => {
    if (getRecentTranslations) {
      getRecentTranslations().then(setHistory).catch(() => {});
    }
  }, [getRecentTranslations]);

  const showToast = useCallback((message) => {
    setToast({ show: true, message });
  }, []);

  const startRecording = useCallback(async () => {
    setError('');
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
    setIsProcessingSTT(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', sourceLang);

      const res = await fetch('/api/stt', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('STT failed');

      const data = await res.json();
      
      if (data.transcript) {
        setInputText(data.transcript);
        // Automatically trigger translation after voice input
        handleTranslate(data.transcript);
      } else {
        setError('No speech detected. Please try again.');
      }
    } catch (err) {
      console.error('STT error:', err);
      setError('Speech recognition failed. Please try again.');
    } finally {
      setIsProcessingSTT(false);
    }
  };

  const handleToggleMic = () => {
    if (isListening) stopRecording();
    else startRecording();
  };

  const handleTranslate = async (textToTranslate) => {
    const text = typeof textToTranslate === 'string' ? textToTranslate : inputText;
    if (!text.trim()) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          sourceLang,
          targetLang,
          context: 'nurse-patient communication in a healthcare setting',
        }),
      });

      if (!res.ok) throw new Error('Translation failed');

      const data = await res.json();
      setTranslation(data);

      const record = {
        input: text.trim(),
        output: data.translation,
        from: sourceLang,
        to: targetLang
      };

      const saved = await addRecentTranslation(record);
      setHistory(prev => [saved, ...prev].slice(0, 10));
    } catch (err) {
      setError('Translation failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const handleCopy = () => {
    if (translation?.translation) {
      navigator.clipboard.writeText(translation.translation);
      showToast('Copied to clipboard');
    }
  };

  // Long press handlers
  const handleTouchStart = (id) => {
    longPressTimer.current = setTimeout(() => {
      setLongPressId(id);
    }, 600);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  const handleDeleteHistory = async (id) => {
    await deleteRecentTranslation(id);
    setHistory(prev => prev.filter(item => item.id !== id));
    setLongPressId(null);
    showToast('Entry deleted');
  };

  return (
    <div className={styles.screen}>
      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />

      <div className={styles.inputCard}>
        <div className={styles.cardHeader}>
          <span className={styles.langTag}>{getLangName(sourceLang)}</span>
        </div>
        <textarea
          className={styles.textarea}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type message or hold mic below to speak..."
          rows={3}
          disabled={isListening}
          aria-label="Text to translate"
        />
        <div className={styles.inputActions}>
          <span className={styles.charCount}>{inputText.length}/500</span>
          <button
            className={styles.translateBtn}
            onClick={handleTranslate}
            disabled={!inputText.trim() || isLoading || isListening || isProcessingSTT}
          >
            {isLoading ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </div>

      <div className={styles.micFabContainer}>
        <p className={styles.micInstruction}>
          {isListening ? 'Release to translate' : 'Hold to speak'}
        </p>
        <button
          className={`${styles.voiceFab} ${isListening ? styles.listening : ''}`}
          onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
          onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
          onTouchCancel={(e) => { e.preventDefault(); stopRecording(); }}
          disabled={isLoading || isProcessingSTT}
          aria-label="Speak message"
        >
          <span className={styles.micIcon}>
            {isListening ? <IconStop size={32} /> : <IconMicrophone size={32} />}
          </span>
          {isListening && <span className={styles.pulse}></span>}
        </button>
      </div>

      {(isLoading || isProcessingSTT) && (
        <div className={styles.loadingWrap}>
          <LoadingSpinner 
            size="md" 
            text={isProcessingSTT ? 'Converting voice to text...' : 'Translating with AI...'} 
          />
        </div>
      )}

      {error && <div className={styles.errorCard}>{error}</div>}

      {translation && !isLoading && (
        <div className={styles.resultCard}>
          <div className={styles.cardHeader}>
            <span className={styles.langTag}>{getLangName(targetLang)}</span>
            <div className={styles.resultActions}>
              <SpeakButton text={translation.translation} langCode={targetLang} size="sm" />
              <button className={styles.copyBtn} onClick={handleCopy} title="Copy">
                <IconCopy size={14} />
              </button>
            </div>
          </div>
          <p className={styles.translationText}>{translation.translation}</p>
          {translation.pronunciation && (
            <p className={styles.pronunciation}>
              <span className={styles.pronLabel}>Pronunciation:</span> {translation.pronunciation}
            </p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className={styles.historySection}>
          <h3 className={styles.historyTitle}>Recent Translations</h3>
          <div className={styles.historyList}>
            {history.map((item) => (
              <div
                key={item.id}
                className={`${styles.historyItem} ${longPressId === item.id ? styles.longPressed : ''}`}
                onTouchStart={() => handleTouchStart(item.id)}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onContextMenu={(e) => { e.preventDefault(); setLongPressId(item.id); }}
              >
                {longPressId === item.id ? (
                  <div className={styles.longPressActions}>
                    <button className={styles.lpCancelBtn} onClick={() => setLongPressId(null)}>Cancel</button>
                    <button className={styles.lpDeleteBtn} onClick={() => handleDeleteHistory(item.id)}>
                      <IconTrash size={14} /> Delete
                    </button>
                  </div>
                ) : (
                  <>
                    <p className={styles.historyInput}>{item.input}</p>
                    <p className={styles.historyOutput}>{item.output}</p>
                    <div className={styles.historyMeta}>
                      <span>{getLangName(item.from)} → {getLangName(item.to)}</span>
                      <SpeakButton text={item.output} langCode={item.to} size="sm" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
