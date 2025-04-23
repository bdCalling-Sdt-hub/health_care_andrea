import { z } from 'zod'

const contentsItemSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  descriptions: z.array(z.any()).min(1),
})

const createTabZodSchema = z.object({
  body: z.object({
    service: z.string({ required_error: 'Service ID is required' }),
    tabName: z.string({ required_error: 'Tab Name is required' }),
    contents: z.array(contentsItemSchema),
    image: z.array(z.string()),
    media: z.array(z.string()),
  }),
})

const updateTabZodSchema = z.object({
  body: z.object({
    service: z.string().optional(),
    tabName: z.string().optional(),
    contents: z.array(contentsItemSchema).optional(),
    image: z.array(z.string()).optional(),
    media: z.array(z.string()).optional(),
  }),
})
export const TabValidation = {
  createTabZodSchema,
  updateTabZodSchema,
}
