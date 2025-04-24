import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodEffects } from 'zod'

import { removeUploadedFiles } from '../../utils/deleteUploadedFile'
const validateRequest =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      })
      return next()
    } catch (error) {
      if (
        req.body?.image?.length > 0 ||
        req.body?.media?.length > 0 ||
        req.body?.doc?.length > 0
      ) {
        removeUploadedFiles(req.body?.image)
        removeUploadedFiles(req.body?.media)
        removeUploadedFiles(req.body?.doc)
      }

      next(error)
    }
  }

export default validateRequest
