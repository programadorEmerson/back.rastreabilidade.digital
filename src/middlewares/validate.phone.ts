import { NextFunction, Request, Response } from 'express'
import parsePhoneNumber, { isValidPhoneNumber } from 'libphonenumber-js'

export class PhoneNumber {
  validate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { to } = req.body
      const rawPhoneNumber = to.replace(/\D/g, '')
      if (
        !isValidPhoneNumber(rawPhoneNumber, 'BR') ||
      (!parsePhoneNumber(rawPhoneNumber, 'BR').isValid() ||
        rawPhoneNumber.length !== 11)
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
}
