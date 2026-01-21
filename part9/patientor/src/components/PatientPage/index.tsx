import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Patient, Diagnosis } from "../../types";
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";
import { Button } from "@mui/material";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const patientData = await patientService.getOne(id);
        setPatient(patientData);
        
        const diagnosisData = await diagnosisService.getAll();
        setDiagnoses(diagnosisData);
      }
    };
    fetchPatient();
  }, [id]);

  const getDiagnosisName = (code: string) => {
    const diagnosis = diagnoses.find(d => d.code === code);
    return diagnosis ? diagnosis.name : code;
  };

  if (!patient) return <div>loading...</div>;

  return (
    <div>
      <h2>{patient.name} {patient.gender === 'male' ? '♂️' : '♀️'}</h2>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>

      {/* This Button opens the form */}
      <Button variant="contained" onClick={() => setModalOpen(true)}>
        Add New Entry
      </Button>
      
      <AddEntryForm 
        modalOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        patientId={patient.id}
        setPatient={setPatient}
        diagnoses={diagnoses}
      />

      <h3>entries</h3>
      {patient.entries?.map(entry => (
        <EntryDetails key={entry.id} entry={entry} getDiagnosisName={getDiagnosisName} />
      ))}
    </div>
  );
};

export default PatientPage;