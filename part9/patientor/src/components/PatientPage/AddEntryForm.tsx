import { useState, SyntheticEvent } from "react";
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Alert, 
  OutlinedInput, 
  Box, 
  Chip,
  SelectChangeEvent,
  Typography
} from "@mui/material";

import { HealthCheckRating, Diagnosis, Patient } from "../../types";
import patientService from "../../services/patients";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  patientId: string;
  setPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  diagnoses: Diagnosis[];
}

const AddEntryForm = ({ modalOpen, onClose, patientId, setPatient, diagnoses }: Props) => {
  // Common State
  const [type, setType] = useState("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // HealthCheck State
  const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);

  // Hospital State
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  // Occupational State
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  if (!modalOpen) return null;

  const onDiagnosisChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const { target: { value } } = event;
    setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const submit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setError(null);

    try {
      // 1. Create Base Object
      const baseEntry = {
        description,
        date,
        specialist,
        diagnosisCodes,
      };

      let newEntry: any;

      // 2. Construct specific entry based on type
      switch (type) {
        case "HealthCheck":
          newEntry = {
            ...baseEntry,
            type: "HealthCheck",
            healthCheckRating: Number(healthCheckRating)
          };
          break;

        case "Hospital":
          newEntry = {
            ...baseEntry,
            type: "Hospital",
            discharge: {
              date: dischargeDate,
              criteria: dischargeCriteria
            }
          };
          break;

        case "OccupationalHealthcare":
          newEntry = {
            ...baseEntry,
            type: "OccupationalHealthcare",
            employerName,
            sickLeave: sickLeaveStart && sickLeaveEnd ? {
              startDate: sickLeaveStart,
              endDate: sickLeaveEnd
            } : undefined
          };
          break;
        
        default:
          throw new Error("Invalid entry type");
      }

      // 3. Send to Backend
      const addedEntry = await patientService.createEntry(patientId, newEntry);
      
      // 4. Update Frontend State
      setPatient((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          entries: prev.entries ? prev.entries.concat(addedEntry) : [addedEntry]
        };
      });

      // 5. Cleanup
      onClose();
      // Optional: Reset form fields here if you want
      setDescription("");
      setDate("");
      setSpecialist("");
      setDiagnosisCodes([]);
      
    } catch (e: any) {
      const msg = e.response?.data?.error?.[0]?.message || e.response?.data?.error || "Error adding entry";
      console.error(e);
      setError(msg);
    }
  };

  return (
    <div style={{ border: '2px dotted black', padding: '20px', marginTop: '20px' }}>
      <h3>New Entry</h3>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <form onSubmit={submit}>
        {/* TYPE SELECTOR */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type" onChange={({ target }) => setType(target.value)}>
            <MenuItem value="HealthCheck">HealthCheck</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
          </Select>
        </FormControl>

        {/* COMMON FIELDS */}
        <TextField 
          label="Description" fullWidth margin="dense" 
          value={description} onChange={({ target }) => setDescription(target.value)} 
        />
        <TextField 
          label="Date" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }}
          value={date} onChange={({ target }) => setDate(target.value)} 
        />
        <TextField 
          label="Specialist" fullWidth margin="dense" 
          value={specialist} onChange={({ target }) => setSpecialist(target.value)} 
        />

        {/* DIAGNOSIS MULTI-SELECT */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Diagnosis Codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={onDiagnosisChange}
            input={<OutlinedInput label="Diagnosis Codes" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {diagnoses.map((d) => (
              <MenuItem key={d.code} value={d.code}>
                {d.code} - {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* CONDITIONAL FIELDS */}
        
        {type === "HealthCheck" && (
           <TextField 
             select label="Health Rating" fullWidth margin="dense"
             value={healthCheckRating} 
             onChange={({ target }) => setHealthCheckRating(Number(target.value))}
           >
             <MenuItem value={0}>Healthy</MenuItem>
             <MenuItem value={1}>Low Risk</MenuItem>
             <MenuItem value={2}>High Risk</MenuItem>
             <MenuItem value={3}>Critical Risk</MenuItem>
           </TextField>
        )}

        {type === "Hospital" && (
          <>
            <TextField 
              label="Discharge Date" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }}
              value={dischargeDate} onChange={({ target }) => setDischargeDate(target.value)} 
            />
            <TextField 
              label="Discharge Criteria" fullWidth margin="dense" 
              value={dischargeCriteria} onChange={({ target }) => setDischargeCriteria(target.value)} 
            />
          </>
        )}

        {type === "OccupationalHealthcare" && (
          <>
            <TextField 
              label="Employer Name" fullWidth margin="dense" 
              value={employerName} onChange={({ target }) => setEmployerName(target.value)} 
            />
            <Typography variant="subtitle2" sx={{ mt: 1 }}>Sick Leave (Optional)</Typography>
            <div style={{ display: 'flex', gap: '10px' }}>
              <TextField 
                label="Start" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }}
                value={sickLeaveStart} onChange={({ target }) => setSickLeaveStart(target.value)} 
              />
              <TextField 
                label="End" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }}
                value={sickLeaveEnd} onChange={({ target }) => setSickLeaveEnd(target.value)} 
              />
            </div>
          </>
        )}

        {/* BUTTONS */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button color="secondary" variant="contained" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Add</Button>
        </Box>
      </form>
    </div>
  );
};

export default AddEntryForm;