import jwtDecode from 'jwt-decode'

import * as Yup from 'yup'

import { User } from '~models/user'
import { SECRET } from '~utils/exports.utils'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import parsePhoneNumber, { isValidPhoneNumber } from 'libphonenumber-js'
import { ObjectId } from 'mongodb'

export class Validations {
  decriptToken (req: Request, _res: Response, next: NextFunction) {
    const { authorization } = req.headers
    const user = jwtDecode(authorization) as User
    if (!user) throw new Error('Invalid token')
    req.body.user = user
    next()
  }

  async userValidator (req: Request, res: Response, next: NextFunction) {
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

  tokenValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers
      jwt.verify(authorization, SECRET)
      const { _id } = jwtDecode(authorization) as User
      req.body.userRequest = new ObjectId(_id)
      next()
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  phoneValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { to } = req.body
      const rawPhoneNumber = to.replace(/\D/g, '')
      if (
        !isValidPhoneNumber(rawPhoneNumber, 'BR') ||
        !parsePhoneNumber(rawPhoneNumber, 'BR').isValid() ||
        rawPhoneNumber.length !== 11
      ) {
        throw new Error('Invalid phone number')
      }
      let phoneNumber = parsePhoneNumber(rawPhoneNumber, 'BR')
        .format('E.164')
        .replace('+', '')
      phoneNumber = phoneNumber.includes('@c.us')
        ? `55${rawPhoneNumber}`
        : `55${rawPhoneNumber}@c.us`
      req.body.number = phoneNumber
      next()
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  errorHandler (err: Error, _req: Request, res: Response, _next: Function) {
    return res.status(400).json({ error: err.message })
  }
}
