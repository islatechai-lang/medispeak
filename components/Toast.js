'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, show, onHide }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (show) {
      timerRef.current = setTimeout(() => onHide(), 2500);
      return () => clearTimeout(timerRef.current);
    }
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div className={styles.toast}>
      <span className={styles.icon}>✓</span>
      <span className={styles.text}>{message}</span>
    </div>
  );
}
