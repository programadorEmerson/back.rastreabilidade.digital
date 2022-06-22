
import { Request, Response } from 'express'
import 'express-async-errors'

export class ErrorHandler {
  public static errorHandler (err: Error, req: Request, res: Response, next: Function) {
    return res.status(400).json({ error: err.message })
  }
}
