import { z } from 'zod'
const createInsightsZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    image: z.array(z.string()).min(1),
  }),
})

const updateInsightsZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.array(z.string()).optional(),
  }),
})

const createSectionZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    image: z.array(z.string()).min(1),
  }),
})

const updateSectionZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.array(z.string()).optional(),
  }),
})

const createBarZodSchema = z.object({
  body: z.object({
    contents: z.array(
      z.object({
        title: z.string({
          required_error: 'Title is required',
        }),
        body: z.array(z.string()).min(1),
      }),
    ),
  }),
})

const updateBarZodSchema = z.object({
  body: z.object({
    contents: z.array(
      z.object({
        title: z.string({
          required_error: 'Title is required',
        }),
        body: z.array(z.string()).min(1),
      }),
    ),
  }),
})

export const InsightsValidations = {
  createInsightsZodSchema,
  updateInsightsZodSchema,
  createSectionZodSchema,
  updateSectionZodSchema,
  createBarZodSchema,
  updateBarZodSchema,
}
