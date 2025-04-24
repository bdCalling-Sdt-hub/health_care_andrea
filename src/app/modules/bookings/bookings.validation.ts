import { z } from 'zod'

export const BookingsValidations = {
  create: z.object({
    body: z.object({
      user: z.string(),
      firstName: z.string(),
      lastName: z.string().optional(),
      contact: z.string(),
      email: z.string(),
      industry: z.string(),
      country: z.string(),
      state: z.string(),
      service: z.string(),
      message: z.string(),
      date: z.string(),
      time: z.string(),
      timeCode: z.number(),
    }),
  }),

  update: z.object({
    body: z.object({
      user: z.string(),
      firstName: z.string(),
      lastName: z.string().optional(),
      contact: z.string(),
      email: z.string(),
      industry: z.string(),
      country: z.string(),
      state: z.string(),
      service: z.string(),
      message: z.string(),
      date: z.string(), // Add the date field to the validation schema
      time: z.string(),
      timeCode: z.number(),
    }),
  }),
}
