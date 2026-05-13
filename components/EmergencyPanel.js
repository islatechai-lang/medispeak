'use client';
import { useState } from 'react';
import SpeakButton from './SpeakButton';
import styles from './EmergencyPanel.module.css';

const EMERGENCY_PHRASES = [
  { id: 'emg_1', en: 'Please stay calm.', tl: 'Maging kalmado po kayo.', ceb: 'Pagkalma lang po.', ilo: 'Agkalma ka.', war: 'Pagkalma la.' },
  { id: 'emg_2', en: 'You need to go to the emergency room.', tl: 'Kailangan pumunta sa emergency room.', ceb: 'Kinahanglan moadto sa emergency room.', ilo: 'Masapul nga mapanka iti emergency room.', war: 'Kinahanglan kumadto ha emergency room.' },
  { id: 'emg_3', en: 'Take a deep breath.', tl: 'Huminga ng malalim.', ceb: 'Pagginhawa og lawom.', ilo: 'Angangesem a nauneg.', war: 'Humangos hin halarom.' },
  { id: 'emg_4', en: 'Where is the pain located?', tl: 'Saan ang masakit?', ceb: 'Asa ang sakit?', ilo: 'Sadino ti sakit?', war: 'Diin an masakit?' },
  { id: 'emg_5', en: 'Can you hear me?', tl: 'Naririnig mo ba ako?', ceb: 'Nadungog mo ba ko?', ilo: 'Mangngegnak kadi?', war: 'Nabababati mo ba ako?' },
  { id: 'emg_6', en: 'Do not move.', tl: 'Huwag gumalaw.', ceb: 'Ayaw paglihok.', ilo: 'Dikay aggunay.', war: 'Ayaw paglihok.' },
  { id: 'emg_7', en: 'Help is coming.', tl: 'May darating na tulong.', ceb: 'Naa nay moabot nga tabang.', ilo: 'Umay ti tulong.', war: 'May maabot na bulig.' },
  { id: 'emg_8', en: 'Are you allergic to any medicine?', tl: 'May allergy ka ba sa gamot?', ceb: 'Naa bay allergy sa tambal?', ilo: 'Adda kadi alerhiyam iti agas?', war: 'May allergy ka ba ha tambal?' },
];

export default function EmergencyPanel({ targetLang, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <span className={styles.headerIcon}>🚨</span>
            <div>
              <h2 className={styles.title}>Emergency Phrases</h2>
              <p className={styles.subtitle}>Tap to speak — works offline</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className={styles.list}>
          {EMERGENCY_PHRASES.map((phrase, i) => (
            <div key={i} className={styles.phraseRow}>
              <div className={styles.phraseText}>
                <p className={styles.phraseEn}>{phrase.en}</p>
                <p className={styles.phraseTl}>{phrase[targetLang] || phrase.en}</p>
              </div>
              <SpeakButton text={phrase[targetLang] || phrase.en} langCode={targetLang} size="md" audioId={`emergency/${phrase.id}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
