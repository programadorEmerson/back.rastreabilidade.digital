import { SECRET } from '@utils/exports.utils'
import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

export class TokenFuncions {
  validate = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response => {
    try {
      const { authorization } = req.headers
      jwt.verify(authorization, SECRET)
    next() as unknown as Response
    } catch (error) {
      return res.status(401).json({ error: 'Token invalid' })
    }
  }
}
