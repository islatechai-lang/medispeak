'use client';
import { useState, useMemo, useEffect } from 'react';
import { PHRASE_CATEGORIES, PHRASES } from '@/lib/phrasesData';
import { useIndexedDB } from '@/lib/useIndexedDB';
import { IconSearch, IconPin } from './Icons';
import SpeakButton from './SpeakButton';
import styles from './PhrasesScreen.module.css';

export default function PhrasesScreen({ targetLang }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhrase, setNewPhrase] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [customPhrases, setCustomPhrases] = useState([]);
  const { addCustomPhrase, getCustomPhrases, deleteCustomPhrase } = useIndexedDB();

  const [pinned, setPinned] = useState(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('medispeak_pinned_phrases') || '[]'); }
      catch { return []; }
    }
    return [];
  });

  // Load custom phrases from IndexedDB
  useEffect(() => {
    if (getCustomPhrases) {
      getCustomPhrases().then(setCustomPhrases).catch(() => {});
    }
  }, [getCustomPhrases]);

  // Merge built-in + custom phrases
  const allPhrases = useMemo(() => {
    const custom = customPhrases.map(p => ({
      ...p,
      id: `custom_${p.id}`,
      isCustom: true,
    }));
    return [...PHRASES, ...custom];
  }, [customPhrases]);

  const filteredPhrases = useMemo(() => {
    let list = allPhrases;
    if (activeCategory === 'pinned') {
      list = list.filter(p => pinned.includes(p.id));
    } else if (activeCategory === 'custom') {
      list = list.filter(p => p.isCustom);
    } else if (activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.en.toLowerCase().includes(q) || (p[targetLang] && p[targetLang].toLowerCase().includes(q)));
    }
    return list;
  }, [activeCategory, searchQuery, targetLang, pinned, allPhrases]);

  const togglePin = (id) => {
    const updated = pinned.includes(id) ? pinned.filter(f => f !== id) : [...pinned, id];
    setPinned(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('medispeak_pinned_phrases', JSON.stringify(updated));
    }
  };

  const handleAddPhrase = async () => {
    if (!newPhrase.trim()) return;
    setIsGenerating(true);
    setGenError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'translate_phrase', text: newPhrase.trim() }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed (${res.status})`);
      }

      const { translations } = await res.json();

      const phrase = {
        en: newPhrase.trim(),
        category: newCategory,
        tl: translations.tl || '',
        ceb: translations.ceb || '',
        ilo: translations.ilo || '',
        war: translations.war || '',
      };

      const saved = await addCustomPhrase(phrase);
      setCustomPhrases(prev => [...prev, saved]);
      setNewPhrase('');
      setShowAddModal(false);
    } catch (err) {
      setGenError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCustom = async (customId) => {
    const dbId = parseInt(customId.replace('custom_', ''));
    await deleteCustomPhrase(dbId);
    setCustomPhrases(prev => prev.filter(p => p.id !== dbId));
  };

  return (
    <div className={styles.screen}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}><IconSearch size={16} /></span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search phrases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search phrases"
        />
        <button className={styles.addBtn} onClick={() => setShowAddModal(true)} title="Add custom phrase">+</button>
      </div>

      <div className={styles.categoryScroll}>
        <button
          className={`${styles.catPill} ${activeCategory === 'all' ? styles.activePill : ''}`}
          onClick={() => setActiveCategory('all')}
        >All</button>
        <button
          className={`${styles.catPill} ${activeCategory === 'pinned' ? styles.activePill : ''}`}
          onClick={() => setActiveCategory('pinned')}
        >
          <IconPin size={12} filled={activeCategory === 'pinned'} /> Pinned
        </button>
        {customPhrases.length > 0 && (
          <button
            className={`${styles.catPill} ${activeCategory === 'custom' ? styles.activePill : ''}`}
            onClick={() => setActiveCategory('custom')}
          >✨ My Phrases</button>
        )}
        {PHRASE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`${styles.catPill} ${activeCategory === cat.id ? styles.activePill : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className={styles.phraseList}>
        {filteredPhrases.length === 0 && (
          <p className={styles.empty}>
            {activeCategory === 'pinned' ? 'No pinned phrases yet.' : activeCategory === 'custom' ? 'No custom phrases yet. Tap + to add one!' : 'No phrases found.'}
          </p>
        )}
        {filteredPhrases.map(phrase => (
          <div key={phrase.id} className={`${styles.phraseCard} ${phrase.isCustom ? styles.customCard : ''}`}>
            <div className={styles.phraseContent}>
              <p className={styles.phraseEn}>{phrase.en}</p>
              <p className={styles.phraseTl}>{phrase[targetLang] || phrase.en}</p>
              {phrase.isCustom && <span className={styles.customBadge}>Custom</span>}
            </div>
            <div className={styles.phraseActions}>
              <SpeakButton text={phrase[targetLang] || phrase.en} langCode={targetLang} size="sm" />
              {phrase.isCustom ? (
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteCustom(phrase.id)}
                  title="Delete custom phrase"
                >✕</button>
              ) : (
                <button
                  className={`${styles.pinBtn} ${pinned.includes(phrase.id) ? styles.pinActive : ''}`}
                  onClick={() => togglePin(phrase.id)}
                  aria-label={pinned.includes(phrase.id) ? 'Unpin phrase' : 'Pin phrase'}
                >
                  <IconPin size={16} filled={pinned.includes(phrase.id)} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Phrase Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => !isGenerating && setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Add Custom Phrase</h3>
            <p className={styles.modalDesc}>Type a phrase in English. AI will translate it to all supported languages.</p>

            <input
              type="text"
              className={styles.modalInput}
              placeholder="e.g. Please drink more water"
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              disabled={isGenerating}
              autoFocus
            />

            <select
              className={styles.modalSelect}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              disabled={isGenerating}
            >
              {PHRASE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon || ''} {cat.name}</option>
              ))}
            </select>

            {genError && <p className={styles.errorText}>{genError}</p>}

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowAddModal(false)} disabled={isGenerating}>Cancel</button>
              <button className={styles.submitBtn} onClick={handleAddPhrase} disabled={isGenerating || !newPhrase.trim()}>
                {isGenerating ? 'Translating...' : 'Add Phrase'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
