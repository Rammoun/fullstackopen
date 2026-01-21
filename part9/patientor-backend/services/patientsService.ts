import { v1 as uuid } from 'uuid';
import patients from '../data/patients';
import { Patient, NonSensitivePatient, NewPatientEntry, Entry } from '../types';

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const id = uuid();
  const newPatient = { id, ...entry, entries: [] };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: Omit<Entry, 'id'>): Entry => {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    throw new Error(`Patient not found`);
  }
  
  const newEntry = {
    id: uuid(),
    ...entry
  } as Entry;

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getNonSensitiveEntries,
  addPatient,
  findById,
  addEntry
};