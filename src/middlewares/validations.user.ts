import { NextFunction, Request, Response } from 'express'
import jwtDecode from 'jwt-decode'
import * as Yup from 'yup'
import { User } from '~models/user'

export class ValidationsUser {
  static async createUser (req: Request, res: Response, next: NextFunction) {
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
            'The password is invalid.'
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

  static async signIn (req: Request, res: Response, next: NextFunction) {
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

  static decriptToken (req: Request, _res: Response, next: NextFunction) {
    const { authorization } = req.headers
    const user = jwtDecode(authorization) as User
    if (!user) throw new Error('Invalid token')
    req.body.user = user
    next()
  }
}
