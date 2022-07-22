import * as Yup from 'yup'

import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'

export class ValidationsProduct {
  async validateProduct (req: Request, _res: Response, next: NextFunction) {
    try {
      const productSchema = Yup.object().shape({
        name: Yup.string()
          .min(3, 'Name product must be greater than 3 characters')
          .required('Name is required.'),
        code: Yup.string()
          .min(9, 'Code product must be greater than 9 characters')
          .required('Code is required.')
      })
      await productSchema.validate({ ...req.body })
      next()
    } catch (err) {
      const [response]: string = err.errors
      throw new Error(response)
    }
  }

  async validateProductUpdate (req: Request, _res: Response, next: NextFunction) {
    try {
      const productSchema = Yup.object().shape({
        name: Yup.string()
          .min(3, 'Name product must be greater than 3 characters')
          .required('Name is required.'),
        code: Yup.string()
          .min(9, 'Code product must be greater than 9 characters')
          .required('Code is required.'),
        // validate ObjectId
        _id: Yup.string().matches(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
          .required('Id is required.')
      })
      await productSchema.validate({ ...req.body })
      next()
    } catch (err) {
      const [response]: string = err.errors
      throw new Error(response)
    }
  }

  async validateObjectIdParams (req: Request, _res: Response, next: NextFunction) {
    try {
      const productSchema = Yup.object().shape({
        _id: Yup.string()
          .matches(/^[0-9a-fA-F]{24}$/, 'Invalid id product')
          .required('Invalid id product')
      })
      await productSchema.validate({ ...req.params })
      req.body._id = new ObjectId(req.params._id)
      next()
    } catch (err) {
      const [response]: string = err.errors
      throw new Error(response)
    }
  }

  async validateInitialAndFinalDate (req: Request, _res: Response, next: NextFunction) {
    try {
      const productSchema = Yup.object().shape({
        initialDate: Yup.string()
          .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, 'Invalid initial date')
          .required('Initial date is required.'),
        finalDate: Yup.string()
          .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, 'Invalid final date')
          .required('Final date is required.')
      })
      await productSchema.validate({ ...req.params })
      next()
    } catch (err) {
      const [response]: string = err.errors
      throw new Error(response)
    }
  }
}
