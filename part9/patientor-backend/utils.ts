import { z } from 'zod';
import { Gender } from './types';
import { HealthCheckRating } from './types';

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string()
});

export const NewEntrySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("HealthCheck"),
    description: z.string(),
    date: z.string().date(),
    specialist: z.string(),
    diagnosisCodes: z.array(z.string()).optional(),
    healthCheckRating: z.nativeEnum(HealthCheckRating)
  }),
  z.object({
    type: z.literal("Hospital"),
    description: z.string(),
    date: z.string().date(),
    specialist: z.string(),
    diagnosisCodes: z.array(z.string()).optional(),
    discharge: z.object({
      date: z.string().date(),
      criteria: z.string()
    })
  }),
  z.object({
    type: z.literal("OccupationalHealthcare"),
    description: z.string(),
    date: z.string().date(),
    specialist: z.string(),
    diagnosisCodes: z.array(z.string()).optional(),
    employerName: z.string(),
    sickLeave: z.object({
      startDate: z.string().date(),
      endDate: z.string().date()
    }).optional()
  })
]);