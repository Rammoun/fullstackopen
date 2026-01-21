import { Entry } from "../../types";
import { Box, Typography } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface Props {
	entry: Entry;
	getDiagnosisName: (code: string) => string;
}

const EntryDetails: React.FC<Props> = ({ entry, getDiagnosisName }) => {
	const style = {
		border: "1px solid black",
		borderRadius: "5px",
		padding: "10px",
		marginBottom: "10px",
	};

	const assertNever = (value: never): never => {
		throw new Error(
			`Unhandled discriminated union member: ${JSON.stringify(value)}`,
		);
	};

	switch (entry.type) {
		case "Hospital":
			return (
				<Box sx={style}>
					<Typography variant='body1'>
						{entry.date} <LocalHospitalIcon />
					</Typography>
					<Typography variant='body2'>
						<i>{entry.description}</i>
					</Typography>
					<Typography variant='body2'>
						Discharged: {entry.discharge.date} - {entry.discharge.criteria}
					</Typography>
					<Typography variant='body2'>
						diagnose by {entry.specialist}
					</Typography>
					{entry.diagnosisCodes && (
						<ul>
							{entry.diagnosisCodes.map((code) => (
								<li key={code}>
									{code} {getDiagnosisName(code)}
								</li>
							))}
						</ul>
					)}
				</Box>
			);

		case "OccupationalHealthcare":
			return (
				<Box sx={style}>
					<Typography variant='body1'>
						{entry.date} <WorkIcon /> {entry.employerName}
					</Typography>
					<Typography variant='body2'>
						<i>{entry.description}</i>
					</Typography>
					{entry.sickLeave && (
						<Typography variant='body2'>
							Sick leave: {entry.sickLeave.startDate} to{" "}
							{entry.sickLeave.endDate}
						</Typography>
					)}
					<Typography variant='body2'>
						diagnose by {entry.specialist}
					</Typography>
					{entry.diagnosisCodes && (
						<ul>
							{entry.diagnosisCodes.map((code) => (
								<li key={code}>
									{code} {getDiagnosisName(code)}
								</li>
							))}
						</ul>
					)}
				</Box>
			);

		case "HealthCheck":
			const color =
				entry.healthCheckRating === 0
					? "green"
					: entry.healthCheckRating === 1
						? "yellow"
						: entry.healthCheckRating === 2
							? "orange"
							: "red";

			return (
				<Box sx={style}>
					<Typography variant='body1'>
						{entry.date} <FavoriteIcon />
					</Typography>
					<Typography variant='body2'>
						<i>{entry.description}</i>
					</Typography>
					<FavoriteIcon style={{ color: color }} />
					<Typography variant='body2'>
						diagnose by {entry.specialist}
					</Typography>
				</Box>
			);

		default:
			return assertNever(entry);
	}
};

export default EntryDetails;
