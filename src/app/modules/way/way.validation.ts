import { z } from 'zod'

const contentsItemSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})
const createWayZodSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    subDescription: z.string(),
    contents: z.array(contentsItemSchema),
  }),
})

const updateWayZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    subDescription: z.string().optional(),
    contents: z.array(contentsItemSchema).optional(),
  }),
})
export const WayValidation = {
  createWayZodSchema,
  updateWayZodSchema,
}
