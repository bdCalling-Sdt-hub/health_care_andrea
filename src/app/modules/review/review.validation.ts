import { z } from 'zod'

export const ReviewValidations = {
  create: z.object({
    name: z.string(),
    industry: z.string(),
    title: z.string(),
    review: z.string(),
    rating: z.number(),
  }),

  update: z.object({
    name: z.string().optional(),
    industry: z.string().optional(),
    title: z.string().optional(),
    review: z.string().optional(),
    rating: z.number().optional(),
  }),
}
