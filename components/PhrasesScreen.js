'use client';
import { useState, useMemo } from 'react';
import { PHRASE_CATEGORIES, PHRASES } from '@/lib/phrasesData';
import { IconSearch, IconStar } from './Icons';
import SpeakButton from './SpeakButton';
import styles from './PhrasesScreen.module.css';

export default function PhrasesScreen({ targetLang }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('medispeak_fav_phrases') || '[]'); }
      catch { return []; }
    }
    return [];
  });

  const filteredPhrases = useMemo(() => {
    let list = PHRASES;
    if (activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.en.toLowerCase().includes(q) || (p[targetLang] && p[targetLang].toLowerCase().includes(q)));
    }
    return list;
  }, [activeCategory, searchQuery, targetLang]);

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('medispeak_fav_phrases', JSON.stringify(updated));
    }
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
      </div>

      <div className={styles.categoryScroll}>
        <button
          className={`${styles.catPill} ${activeCategory === 'all' ? styles.activePill : ''}`}
          onClick={() => setActiveCategory('all')}
        >All</button>
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
          <p className={styles.empty}>No phrases found.</p>
        )}
        {filteredPhrases.map(phrase => (
          <div key={phrase.id} className={styles.phraseCard}>
            <div className={styles.phraseContent}>
              <p className={styles.phraseEn}>{phrase.en}</p>
              <p className={styles.phraseTl}>{phrase[targetLang] || phrase.en}</p>
            </div>
            <div className={styles.phraseActions}>
              <SpeakButton text={phrase[targetLang] || phrase.en} langCode={targetLang} size="sm" />
              <button
                className={`${styles.favBtn} ${favorites.includes(phrase.id) ? styles.favActive : ''}`}
                onClick={() => toggleFavorite(phrase.id)}
                aria-label={favorites.includes(phrase.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <IconStar size={16} filled={favorites.includes(phrase.id)} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
