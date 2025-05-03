import { z } from 'zod'

export const ReviewValidations = {
  create: z.object({
    body: z.object({
      name: z.string(),
      industry: z.string(),
      title: z.string(),
      review: z.string(),
      image: z.array(z.string()),
      rating: z.number(),
    }),
  }),

  update: z.object({
    body: z.object({
      name: z.string().optional(),
      industry: z.string().optional(),
      image: z.array(z.string()).optional(),
      title: z.string().optional(),
      review: z.string().optional(),
      rating: z.number().optional(),
    }),
  }),
}
