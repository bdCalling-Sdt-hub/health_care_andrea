import { z } from 'zod'

const contentsItemSchema = z.object({
  heading: z.string(),
  body: z.string(),
})

export const createHcZodSchema = z.object({
  body: z.object({
    label: z.string(),
    title: z.string(),
    description: z.string(),
    contents: z.array(contentsItemSchema).min(1), // At least one item in the array,
    footer: z.string(),
  }),
})

const updateHCZodSchema = z.object({
  body: z.object({
    label: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    contents: z.array(contentsItemSchema).optional(),
    footer: z.string().optional(),
  }),
})

export const HcValidation = {
  createHcZodSchema,
  updateHCZodSchema,
}
