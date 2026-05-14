'use client';
import { useCallback, useRef, useEffect } from 'react';
import { openDB } from 'idb';

const DB_NAME = 'MediSpeakDB';
const DB_VERSION = 1;

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
    },
  });
}

export function useIndexedDB() {
  const dbRef = useRef(null);

  useEffect(() => {
    getDB().then(db => { dbRef.current = db; });
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

  return {
    addPatient, getPatients, getPatient, updatePatient, deletePatient,
    addCommunication, getCommunications, exportData,
  };
}
