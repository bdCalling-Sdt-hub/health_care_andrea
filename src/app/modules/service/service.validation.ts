import { z } from 'zod'

const createServiceZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string({ required_error: 'Description is required' }),
    image: z.array(z.string()).min(1),
  }),
})
const updateServiceZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.array(z.string()).optional(),
  }),
})
export const ServiceValidations = {
  createServiceZodSchema,
  updateServiceZodSchema,
}
