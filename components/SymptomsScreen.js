'use client';
import { useState } from 'react';
import { SYMPTOM_CATEGORIES, SYMPTOMS } from '@/lib/symptomsData';
import { IconArrowLeft } from './Icons';
import SpeakButton from './SpeakButton';
import styles from './SymptomsScreen.module.css';

export default function SymptomsScreen({ targetLang }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedSymptom, setSelectedSymptom] = useState(null);

  const handleSymptomTap = (symptom) => {
    setSelectedSymptom(symptom);
  };

  const getTranslatedText = (symptom) => {
    return symptom[targetLang] || symptom.en;
  };

  return (
    <div className={styles.screen}>
      <p className={styles.intro}>Tap a category, then select a symptom to communicate with the patient.</p>

      {!activeCategory ? (
        <div className={styles.categoryGrid}>
          {SYMPTOM_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={styles.categoryCard}
              onClick={() => setActiveCategory(cat.id)}
              style={{ '--cat-color': cat.color }}
            >
              <span className={styles.catIcon}>{cat.icon}</span>
              <span className={styles.catName}>{cat.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.symptomView}>
          <button className={styles.backBtn} onClick={() => { setActiveCategory(null); setSelectedSymptom(null); }}>
            <IconArrowLeft size={14} /> Back to categories
          </button>

          <h3 className={styles.catTitle}>
            {SYMPTOM_CATEGORIES.find(c => c.id === activeCategory)?.icon}{' '}
            {SYMPTOM_CATEGORIES.find(c => c.id === activeCategory)?.name}
          </h3>

          <div className={styles.symptomGrid}>
            {SYMPTOMS[activeCategory]?.map(symptom => (
              <button
                key={symptom.id}
                className={`${styles.symptomCard} ${selectedSymptom?.id === symptom.id ? styles.selected : ''}`}
                onClick={() => handleSymptomTap(symptom)}
              >
                <span className={styles.symptomIcon}>{symptom.icon}</span>
                <span className={styles.symptomName}>{symptom.en}</span>
              </button>
            ))}
          </div>

          {selectedSymptom && (
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <span className={styles.resultIcon}>{selectedSymptom.icon}</span>
                <div>
                  <p className={styles.resultEn}>{selectedSymptom.en}</p>
                  <p className={styles.resultTranslated}>{getTranslatedText(selectedSymptom)}</p>
                </div>
              </div>
              <SpeakButton text={getTranslatedText(selectedSymptom)} langCode={targetLang} size="lg" label="Speak" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
