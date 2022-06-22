import jwtDecode from 'jwt-decode'

import * as Yup from 'yup'

import { User } from '~models/user'
import { SECRET } from '~utils/exports.utils'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export class Validations {
  decriptToken (req: Request, _res: Response, next: NextFunction) {
    const { authorization } = req.headers
    const user = jwtDecode(authorization) as User
    if (!user) throw new Error('Invalid token')
    req.body.user = user
    next()
  }

  async userValidator (req: Request, _res: Response, next: NextFunction) {
    try {
      const userSchema = Yup.object().shape({
        name: Yup.string()
          .min(3, 'Name must be greater than 3 characters')
          .required('Name is required.'),
        email: Yup.string()
          .email('A valid email address is required.')
          .max(60, 'The email cannot be longer than 60 characters.')
          .required('The email field cannot be empty.'),
        password: Yup.string()
          .min(8, 'The password must contain at least 8 digits.')
          .matches(
            /^(?=.*\d)(?=.*[A-Z])(?=.*[@$!%*?&])[0-9a-zA-Z@$!%*?&]{8,}$/,
            'The password must contain at least one number, one uppercase letter, one special character and at least 8 characters.'
          )
          .required('The password field cannot be empty.')
      })
      await userSchema.validate({ ...req.body })
      next()
    } catch (err) {
      const [response]: string = err.errors
      throw new Error(response)
    }
  }

  async signInValidator (req: Request, _res: Response, next: NextFunction) {
    try {
      const userSchema = Yup.object().shape({
        email: Yup.string()
          .email('A valid email address is required.')
          .required('The email field cannot be empty.'),
        password: Yup.string().required('The password field cannot be empty.')
      })
      await userSchema.validate({ ...req.body })
      next()
    } catch (err) {
      const [response]: string = err.errors
      throw new Error(response)
    }
  }

  tokenValidator = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers
      jwt.verify(authorization, SECRET)
      const { _id } = jwtDecode(req.headers.authorization) as User
      req.body._id = _id
      next()
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  errorHandler (err: Error, _req: Request, res: Response, _next: Function) {
    return res.status(400).json({ error: err.message })
  }
}
