'use client';
import { useState, useEffect, useCallback } from 'react';
import { useIndexedDB } from '@/lib/useIndexedDB';
import { getLangName, LANGUAGES } from '@/lib/languages';
import { IconSearch, IconPlus, IconDownload, IconArrowLeft, IconChevronRight, IconTrash } from './Icons';
import styles from './HistoryScreen.module.css';

export default function HistoryScreen() {
  const { addPatient, getPatients, deletePatient, getCommunications, exportData } = useIndexedDB();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [communications, setCommunications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ name: '', age: '', langPreference: 'ceb', notes: '' });

  const loadPatients = useCallback(async () => {
    const list = await getPatients();
    setPatients(list.reverse());
  }, [getPatients]);

  useEffect(() => { loadPatients(); }, [loadPatients]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await addPatient({ ...form, age: parseInt(form.age) || 0 });
    setForm({ name: '', age: '', langPreference: 'ceb', notes: '' });
    setShowAddForm(false);
    loadPatients();
  };

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    const comms = await getCommunications(patient.id);
    setCommunications(comms.reverse());
  };

  const handleDeletePatient = async (id) => {
    if (confirm('Delete this patient record?')) {
      await deletePatient(id);
      setSelectedPatient(null);
      loadPatients();
    }
  };

  const handleExport = async () => {
    const data = await exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medispeak-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedPatient) {
    return (
      <div className={styles.screen}>
        <button className={styles.backBtn} onClick={() => setSelectedPatient(null)}>
          <IconArrowLeft size={14} /> Back to Patients
        </button>
        <div className={styles.patientDetail}>
          <div className={styles.patientHeader}>
            <span className={styles.avatar}>{selectedPatient.name[0]?.toUpperCase()}</span>
            <div>
              <h3 className={styles.patientName}>{selectedPatient.name}</h3>
              <p className={styles.patientMeta}>
                {selectedPatient.age ? `${selectedPatient.age} yrs · ` : ''}
                {getLangName(selectedPatient.langPreference)}
              </p>
            </div>
          </div>
          {selectedPatient.notes && <p className={styles.patientNotes}>{selectedPatient.notes}</p>}
          <button className={styles.deleteBtn} onClick={() => handleDeletePatient(selectedPatient.id)}>
            <IconTrash size={14} /> Delete Patient Record
          </button>
        </div>

        <h4 className={styles.sectionTitle}>Communication Log</h4>
        {communications.length === 0 ? (
          <p className={styles.empty}>No communication records yet.</p>
        ) : (
          communications.map((comm, i) => (
            <div key={i} className={styles.commCard}>
              <p className={styles.commText}>{comm.text}</p>
              <span className={styles.commTime}>{new Date(comm.timestamp).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.topBar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}><IconSearch size={15} /></span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.topActions}>
          <button className={styles.addBtn} onClick={() => setShowAddForm(true)}>
            <IconPlus size={14} /> Add
          </button>
          <button className={styles.exportBtn} onClick={handleExport} title="Export data">
            <IconDownload size={16} />
          </button>
        </div>
      </div>

      {showAddForm && (
        <form className={styles.addForm} onSubmit={handleAddPatient}>
          <h3 className={styles.formTitle}>New Patient</h3>
          <input className={styles.formInput} placeholder="Patient name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className={styles.formInput} type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          <select className={styles.formSelect} value={form.langPreference} onChange={(e) => setForm({ ...form, langPreference: e.target.value })}>
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
          </select>
          <textarea className={styles.formTextarea} placeholder="Notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowAddForm(false)}>Cancel</button>
            <button type="submit" className={styles.saveBtn}>Save Patient</button>
          </div>
        </form>
      )}

      <div className={styles.patientList}>
        {filteredPatients.length === 0 && (
          <p className={styles.empty}>{patients.length === 0 ? 'No patients yet. Add your first patient.' : 'No patients found.'}</p>
        )}
        {filteredPatients.map(patient => (
          <button key={patient.id} className={styles.patientCard} onClick={() => handleSelectPatient(patient)}>
            <span className={styles.avatar}>{patient.name[0]?.toUpperCase()}</span>
            <div className={styles.patientInfo}>
              <p className={styles.patientCardName}>{patient.name}</p>
              <p className={styles.patientCardMeta}>
                {patient.age ? `${patient.age} yrs · ` : ''}
                {getLangName(patient.langPreference)} · {new Date(patient.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={styles.chevron}><IconChevronRight size={16} /></span>
          </button>
        ))}
      </div>
    </div>
  );
}
