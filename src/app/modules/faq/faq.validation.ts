import { z } from 'zod'

export const FaqValidations = {
  create: z.object({
    body: z.object({
      question: z.string(),
      answer: z.string(),
    }),
  }),

  update: z.object({
    body: z.object({
      question: z.string().optional(),
      answer: z.string().optional(),
    }),
  }),
}
