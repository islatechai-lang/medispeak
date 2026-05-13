'use client';
import { useState } from 'react';
import { EDUCATION_TOPICS } from '@/lib/educationData';
import { IconChevronDown } from './Icons';
import SpeakButton from './SpeakButton';
import styles from './EducationScreen.module.css';

export default function EducationScreen({ targetLang }) {
  const [expandedTopic, setExpandedTopic] = useState(null);

  const getTitle = (topic) => topic.title[targetLang] || topic.title.en;
  const getContent = (topic) => {
    const lang = topic.content[targetLang] ? targetLang : 'en';
    return topic.content[lang] || topic.content.en;
  };

  return (
    <div className={styles.screen}>
      <p className={styles.intro}>Health education materials translated for your patients.</p>

      <div className={styles.topicList}>
        {EDUCATION_TOPICS.map(topic => {
          const isExpanded = expandedTopic === topic.id;
          const content = getContent(topic);
          const title = getTitle(topic);

          return (
            <div key={topic.id} className={`${styles.topicCard} ${isExpanded ? styles.expanded : ''}`}>
              <button className={styles.topicHeader} onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}>
                <div className={styles.topicInfo}>
                  <span className={styles.topicIcon} style={{ color: topic.color }}>{topic.icon}</span>
                  <div>
                    <p className={styles.topicTitle}>{title}</p>
                    {topic.title.en !== title && <p className={styles.topicTitleEn}>{topic.title.en}</p>}
                  </div>
                </div>
                <span className={`${styles.chevron} ${isExpanded ? styles.chevronUp : ''}`}>
                  <IconChevronDown size={18} />
                </span>
              </button>

              {isExpanded && (
                <div className={styles.topicContent}>
                  <ul className={styles.contentList}>
                    {content.map((item, i) => (
                      <li key={i} className={styles.contentItem}>
                        <span className={styles.bullet} style={{ color: topic.color }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.contentActions}>
                    <SpeakButton text={content.join('. ')} langCode={targetLang} size="md" label="Read Aloud" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
