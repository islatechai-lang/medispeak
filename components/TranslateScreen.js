'use client';
import { useState } from 'react';
import { getLangName } from '@/lib/languages';
import { IconCopy } from './Icons';
import SpeakButton from './SpeakButton';
import LoadingSpinner from './LoadingSpinner';
import styles from './TranslateScreen.module.css';

export default function TranslateScreen({ sourceLang, targetLang }) {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          sourceLang,
          targetLang,
          context: 'nurse-patient communication in a healthcare setting',
        }),
      });

      if (!res.ok) throw new Error('Translation failed');

      const data = await res.json();
      setTranslation(data);
      setHistory(prev => [
        { input: inputText.trim(), output: data.translation, from: sourceLang, to: targetLang, time: new Date() },
        ...prev.slice(0, 9),
      ]);
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
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.inputCard}>
        <div className={styles.cardHeader}>
          <span className={styles.langTag}>{getLangName(sourceLang)}</span>
        </div>
        <textarea
          className={styles.textarea}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type nursing instruction or message..."
          rows={3}
          aria-label="Text to translate"
        />
        <div className={styles.inputActions}>
          <span className={styles.charCount}>{inputText.length}/500</span>
          <button
            className={styles.translateBtn}
            onClick={handleTranslate}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className={styles.loadingWrap}>
          <LoadingSpinner size="md" text="Translating with AI..." />
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
          {history.map((item, i) => (
            <div key={i} className={styles.historyItem}>
              <p className={styles.historyInput}>{item.input}</p>
              <p className={styles.historyOutput}>{item.output}</p>
              <div className={styles.historyMeta}>
                <span>{getLangName(item.from)} → {getLangName(item.to)}</span>
                <SpeakButton text={item.output} langCode={item.to} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
