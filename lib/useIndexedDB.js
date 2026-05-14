'use client';
import { useCallback, useRef, useEffect } from 'react';
import { openDB } from 'idb';

const DB_NAME = 'MediSpeakDB';
const DB_VERSION = 3;

function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('patients')) {
        const store = db.createObjectStore('patients', { keyPath: 'id', autoIncrement: true });
        store.createIndex('name', 'name');
        store.createIndex('createdAt', 'createdAt');
      }
      if (!db.objectStoreNames.contains('communications')) {
        const store = db.createObjectStore('communications', { keyPath: 'id', autoIncrement: true });
        store.createIndex('patientId', 'patientId');
        store.createIndex('timestamp', 'timestamp');
      }
      if (!db.objectStoreNames.contains('audio_cache')) {
        db.createObjectStore('audio_cache');
      }
      if (!db.objectStoreNames.contains('custom_phrases')) {
        const store = db.createObjectStore('custom_phrases', { keyPath: 'id', autoIncrement: true });
        store.createIndex('category', 'category');
        store.createIndex('createdAt', 'createdAt');
      }
      if (!db.objectStoreNames.contains('custom_education')) {
        const store = db.createObjectStore('custom_education', { keyPath: 'id', autoIncrement: true });
        store.createIndex('createdAt', 'createdAt');
      }
    },
  });
}

export function useIndexedDB() {
  const dbRef = useRef(null);

  useEffect(() => {
    getDB().then(db => { dbRef.current = db; });
  }, []);

  const getAudio = useCallback(async (path) => {
    const db = await getDB();
    return db.get('audio_cache', path);
  }, []);

  const saveAudio = useCallback(async (path, blob) => {
    const db = await getDB();
    return db.put('audio_cache', blob, path);
  }, []);

  const addPatient = useCallback(async (patient) => {
    const db = await getDB();
    const record = { ...patient, createdAt: new Date().toISOString(), communications: [] };
    const id = await db.add('patients', record);
    return { ...record, id };
  }, []);

  const getPatients = useCallback(async () => {
    const db = await getDB();
    return db.getAllFromIndex('patients', 'createdAt');
  }, []);

  const getPatient = useCallback(async (id) => {
    const db = await getDB();
    return db.get('patients', id);
  }, []);

  const updatePatient = useCallback(async (patient) => {
    const db = await getDB();
    return db.put('patients', patient);
  }, []);

  const deletePatient = useCallback(async (id) => {
    const db = await getDB();
    const tx = db.transaction(['patients', 'communications'], 'readwrite');
    await tx.objectStore('patients').delete(id);
    const commStore = tx.objectStore('communications');
    const comms = await commStore.index('patientId').getAllKeys(id);
    for (const key of comms) await commStore.delete(key);
    await tx.done;
  }, []);

  const addCommunication = useCallback(async (patientId, comm) => {
    const db = await getDB();
    const record = { ...comm, patientId, timestamp: new Date().toISOString() };
    return db.add('communications', record);
  }, []);

  const getCommunications = useCallback(async (patientId) => {
    const db = await getDB();
    return db.getAllFromIndex('communications', 'patientId', patientId);
  }, []);

  const exportData = useCallback(async () => {
    const db = await getDB();
    const patients = await db.getAll('patients');
    const communications = await db.getAll('communications');
    return JSON.stringify({ patients, communications, exportedAt: new Date().toISOString() }, null, 2);
  }, []);

  // ── Custom Phrases ──
  const addCustomPhrase = useCallback(async (phrase) => {
    const db = await getDB();
    const record = { ...phrase, createdAt: new Date().toISOString() };
    const id = await db.add('custom_phrases', record);
    return { ...record, id };
  }, []);

  const getCustomPhrases = useCallback(async () => {
    const db = await getDB();
    return db.getAll('custom_phrases');
  }, []);

  const deleteCustomPhrase = useCallback(async (id) => {
    const db = await getDB();
    return db.delete('custom_phrases', id);
  }, []);

  // ── Custom Education ──
  const addCustomEducation = useCallback(async (topic) => {
    const db = await getDB();
    const record = { ...topic, createdAt: new Date().toISOString() };
    const id = await db.add('custom_education', record);
    return { ...record, id };
  }, []);

  const getCustomEducation = useCallback(async () => {
    const db = await getDB();
    return db.getAll('custom_education');
  }, []);

  const deleteCustomEducation = useCallback(async (id) => {
    const db = await getDB();
    return db.delete('custom_education', id);
  }, []);

  return {
    getAudio, saveAudio,
    addPatient, getPatients, getPatient, updatePatient, deletePatient,
    addCommunication, getCommunications, exportData,
    addCustomPhrase, getCustomPhrases, deleteCustomPhrase,
    addCustomEducation, getCustomEducation, deleteCustomEducation,
  };
}
