'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { EDUCATION_TOPICS } from '@/lib/educationData';
import { useIndexedDB } from '@/lib/useIndexedDB';
import { IconChevronDown } from './Icons';
import SpeakButton from './SpeakButton';
import Toast from './Toast';
import styles from './EducationScreen.module.css';

export default function EducationScreen({ targetLang }) {
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [customTopics, setCustomTopics] = useState([]);
  const [longPressId, setLongPressId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const longPressTimer = useRef(null);
  const { addCustomEducation, getCustomEducation, deleteCustomEducation } = useIndexedDB();

  useEffect(() => {
    if (getCustomEducation) {
      getCustomEducation().then(setCustomTopics).catch(() => {});
    }
  }, [getCustomEducation]);

  const allTopics = [
    ...EDUCATION_TOPICS,
    ...customTopics.map(t => ({ ...t, isCustom: true, icon: t.icon || '📝', color: t.color || '#8B5CF6' })),
  ];

  const getTitle = (topic) => {
    if (topic.title?.[targetLang]) return topic.title[targetLang];
    return topic.title?.en || topic.topic || 'Untitled';
  };

  const getContent = (topic) => {
    const lang = topic.content?.[targetLang] ? targetLang : 'en';
    return topic.content?.[lang] || topic.content?.en || [];
  };

  const showToast = useCallback((message) => {
    setToast({ show: true, message });
  }, []);

  // Long press handlers
  const handleTouchStart = (id) => {
    longPressTimer.current = setTimeout(() => {
      setLongPressId(id);
    }, 600);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  const handleGenerate = async () => {
    if (!newTopic.trim()) return;
    setIsGenerating(true);
    setGenError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'generate_education', topic: newTopic.trim() }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed (${res.status})`);
      }

      const { education } = await res.json();

      const topicData = {
        topic: newTopic.trim(),
        icon: '📝',
        color: '#8B5CF6',
        title: education.title,
        content: education.content,
      };

      const saved = await addCustomEducation(topicData);
      setCustomTopics(prev => [...prev, saved]);
      setNewTopic('');
      setShowAddModal(false);
      showToast('Topic created successfully!');
    } catch (err) {
      setGenError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteCustomEducation(id);
    setCustomTopics(prev => prev.filter(t => t.id !== id));
    setLongPressId(null);
    showToast('Topic deleted');
  };

  return (
    <div className={styles.screen}>
      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />

      <div className={styles.headerRow}>
        <p className={styles.intro}>Health education materials translated for your patients.</p>
        <button className={styles.addTopicBtn} onClick={() => setShowAddModal(true)} title="Add topic">
          + Add Topic
        </button>
      </div>

      <div className={styles.topicList}>
        {allTopics.map((topic, idx) => {
          const topicKey = topic.isCustom ? topic.id : topic.id || `builtin_${idx}`;
          const isExpanded = expandedTopic === topicKey;
          const content = getContent(topic);
          const title = getTitle(topic);
          const isLongPressed = longPressId === topicKey;

          return (
            <div
              key={topicKey}
              className={`${styles.topicCard} ${isExpanded ? styles.expanded : ''} ${topic.isCustom ? styles.customCard : ''} ${isLongPressed ? styles.longPressed : ''}`}
              onTouchStart={() => topic.isCustom && handleTouchStart(topicKey)}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onContextMenu={(e) => { if (topic.isCustom) { e.preventDefault(); setLongPressId(topicKey); } }}
            >
              {isLongPressed ? (
                <div className={styles.longPressActions}>
                  <button className={styles.lpCancelBtn} onClick={() => setLongPressId(null)}>Cancel</button>
                  <button className={styles.lpDeleteBtn} onClick={() => handleDelete(topicKey)}>🗑 Delete</button>
                </div>
              ) : (
                <>
                  <button className={styles.topicHeader} onClick={() => setExpandedTopic(isExpanded ? null : topicKey)}>
                    <div className={styles.topicInfo}>
                      <span className={styles.topicIcon} style={{ color: topic.color }}>{topic.icon}</span>
                      <div className={styles.topicMeta}>
                        <p className={styles.topicTitle}>
                          {topic.isCustom && <span className={styles.customBadge}>Custom</span>}
                          {title}
                        </p>
                        {topic.title?.en !== title && <p className={styles.topicTitleEn}>{topic.title?.en}</p>}
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
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Topic Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => !isGenerating && setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Add Health Education Topic</h3>
            <p className={styles.modalDesc}>
              Enter a topic (e.g. "Fever", "Diabetes", "Hand Washing"). AI will generate educational content in all supported languages.
            </p>

            <input
              type="text"
              className={styles.modalInput}
              placeholder="e.g. Fever Management"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              disabled={isGenerating}
              autoFocus
            />

            {genError && <p className={styles.errorText}>{genError}</p>}

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowAddModal(false)} disabled={isGenerating}>Cancel</button>
              <button className={styles.submitBtn} onClick={handleGenerate} disabled={isGenerating || !newTopic.trim()}>
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
