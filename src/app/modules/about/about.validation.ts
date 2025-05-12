import { z } from 'zod'

const descriptionsItemSchema = z.object({
  heading: z.string(),
  body: z.string(),
})

export const AboutValidations = {
  create: z.object({
    body: z.object({
      descriptions: z.array(descriptionsItemSchema).optional(),
      type: z.string(z.enum(['mission', 'vision', 'values'])),
    }),
  }),

  update: z.object({
    _id: z.string().optional(),
    descriptions: z.array(descriptionsItemSchema).optional(),
    type: z.string().optional(),
  }),
}
