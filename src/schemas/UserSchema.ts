import { z } from 'zod';
import { weightSchema } from './weightSchema';
import { dietSchema } from './dietSchema';
import { trainingWeekSchema } from './trainingWeekSchema';
import { historySchema } from './historySchema';

export const UserSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address'),
    sex: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    zipCode: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    birthDate: z.string().optional(),
    phone: z.string().optional(),
    currentWeight: z.string().optional(),
    currentBf: z.string().optional(),
    height: z.string().optional(),

    oldWeights: z.array(weightSchema).optional(),
    trainingWeeks: z.array(trainingWeekSchema).optional(),
    diets: z.array(dietSchema).optional(),
    history: z.array(historySchema).optional(),
  })
);

export type UserSchemaType = z.infer<typeof UserSchema>;
export const ProfessionalUserSchema = z.object({
  bio: z.string().optional(),
  experience: z.number().min(0, 'Experience must be a positive number').optional(),
  specialties: z.string().optional(),
  certifications: z.string().optional(),
  education: z.string().optional(),
  reviews: z.string().optional(),

  // Professional Settings
  workStartHour: z.number().min(0).max(23),
  workEndHour: z.number().min(0).max(23),
  appointmentDuration: z.number().min(15).max(240),
  workDays: z.string(),
  bufferBetweenSlots: z.number().min(0).max(60),
  maxAdvanceBooking: z.number().min(1).max(365),
  autoAcceptMeetings: z.boolean(),
  timeZone: z.string(),
});
