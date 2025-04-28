import { z } from 'zod'

const contentsItemSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  details: z.array(z.any()).optional(),
})

const createChallengeZodSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    background: z.string(),
    image: z.array(z.string()),
    contents: z.array(contentsItemSchema),
    footer: z.string(),
  }),
})
const updateChallengeZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    background: z.string().optional(),
    image: z.array(z.string()).optional(),
    contents: z.array(contentsItemSchema).optional(),
    footer: z.string().optional(),
  }),
})

export const ChallengesValidations = {
  createChallengeZodSchema,
  updateChallengeZodSchema,
}
