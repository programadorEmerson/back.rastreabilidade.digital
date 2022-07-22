
import { Request, Response } from 'express'
import 'express-async-errors'

export class ErrorHandler {
  public static errorHandler (err: Error, _req: Request, res: Response, _next: Function) {
    return res.status(400).json({ error: err.message })
  }
}
