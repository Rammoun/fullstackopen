import { useState } from "react";
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Alert } from "@mui/material";
import { HealthCheckRating } from "../../types";
import patientService from "../../services/patients";

// ... Props definition ...

const AddEntryForm = ({ modalOpen, onClose, onOpen, patientId, setPatient }: any) => {
  const [type, setType] = useState("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);
  // ... add states for Hospital (discharge) and Occupational (employer) fields ...
  const [error, setError] = useState<string | null>(null);

  if (!modalOpen) return <Button variant="contained" onClick={onOpen}>Add New Entry</Button>;

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const baseEntry = { description, date, specialist };
      let newEntry: any;

      if (type === "HealthCheck") {
        newEntry = { ...baseEntry, type: "HealthCheck", healthCheckRating: Number(healthCheckRating) };
      } 
      // Add 'else if' for Hospital and Occupational...

      const addedEntry = await patientService.createEntry(patientId, newEntry);
      
      // Update parent state
      setPatient((prev: any) => ({ ...prev, entries: prev.entries.concat(addedEntry) }));
      onClose();
    } catch (e: any) {
      const msg = e.response?.data?.error?.[0]?.message || "Error adding entry";
      setError(msg);
    }
  };

  return (
    <div style={{ border: '2px dotted black', padding: '20px', marginTop: '20px' }}>
      <h3>New HealthCheck entry</h3>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={submit}>
        <FormControl fullWidth margin="dense">
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type" onChange={({ target }) => setType(target.value)}>
            <MenuItem value="HealthCheck">HealthCheck</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational</MenuItem>
          </Select>
        </FormControl>

        <TextField label="Description" fullWidth value={description} onChange={({ target }) => setDescription(target.value)} margin="dense" />
        <TextField type="date" fullWidth value={date} onChange={({ target }) => setDate(target.value)} margin="dense" />
        <TextField label="Specialist" fullWidth value={specialist} onChange={({ target }) => setSpecialist(target.value)} margin="dense" />

        {type === "HealthCheck" && (
           <TextField 
             select label="Health Rating" fullWidth 
             value={healthCheckRating} 
             onChange={({ target }) => setHealthCheckRating(Number(target.value))}
             margin="dense"
           >
             <MenuItem value={0}>Healthy</MenuItem>
             <MenuItem value={1}>Low Risk</MenuItem>
             <MenuItem value={2}>High Risk</MenuItem>
             <MenuItem value={3}>Critical Risk</MenuItem>
           </TextField>
        )}

        {/* Add conditional inputs for EmployerName or Discharge criteria here based on 'type' */}

        <Button color="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">Add</Button>
      </form>
    </div>
  );
};

export default AddEntryForm;