import { z } from 'zod'

export const PublicValidations = {
  create: z.object({
    body: z.object({
      content: z.string(),
      type: z.enum(['privacy-policy', 'terms-and-condition']),
    }),
  }),

  update: z.object({
    body: z.object({
      content: z.string(),
      type: z.enum(['privacy-policy', 'terms-and-condition']),
    }),
  }),
}
