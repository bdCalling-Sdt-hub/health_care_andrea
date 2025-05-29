import { z } from 'zod'

export const BookingsValidations = {
  create: z.object({
    body: z.object({
      user: z.string().optional(),
      firstName: z.string(),
      lastName: z.string().optional(),
      contact: z.string(),
      email: z.string(),
      industry: z.string(),
      duration: z.number(),
      country: z.string(),
      state: z.string(),
      service: z.string(),
      message: z.string(),
      date: z.string(),
      time: z.string(),
      timezone: z.string(),
      timeCode: z.number(),
    }),
  }),

  update: z.object({
    body: z.object({
      user: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      contact: z.string().optional(),
      email: z.string().optional(),
      duration: z.number().optional(),
      industry: z.string().optional(),
      country: z.string().optional(),
      state: z.string().optional(),
      service: z.string().optional(),
      message: z.string().optional(),
      date: z.string().optional(), // Add the date field to the validation schema
      time: z.string().optional(),
      timeCode: z.number().optional(),
    }),
  }),
}
