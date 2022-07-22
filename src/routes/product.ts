import 'express-async-errors'
import { ValidationsProduct } from '~middlewares/product'
import { Validations } from '~middlewares/validations'
import { Product } from '~models/product'
import { Request, Response, Router } from 'express'

export class RoutesProduct {
  private router: Router
  private meddlewares: Validations
  private validate: ValidationsProduct

  constructor () {
    this.router = Router()
    this.meddlewares = new Validations()
    this.validate = new ValidationsProduct()
    this.routes()
  }

  private routes () {
    const {
      meddlewares: { tokenValidator },
      validate: {
        validateProduct,
        validateProductUpdate,
        validateObjectIdParams,
        validateInitialAndFinalDate
      },
      createProduct,
      updateProduct,
      searchProductById,
      getAllProductsInative,
      getAllProductsAtive
    } = this

    this.router.post(
      '/create',
      tokenValidator,
      validateProduct, createProduct
    )

    this.router.post(
      '/update',
      tokenValidator,
      validateProductUpdate,
      updateProduct
    )

    this.router.get(
      '/by-id/:_id',
      tokenValidator,
      validateObjectIdParams,
      searchProductById
    )

    this.router.get(
      '/get-all-inative/:initialDate/:finalDate',
      tokenValidator,
      validateInitialAndFinalDate,
      getAllProductsInative
    )

    this.router.get(
      '/get-all-ative/:initialDate/:finalDate',
      tokenValidator,
      validateInitialAndFinalDate,
      getAllProductsAtive
    )
  }

  private createProduct = async (req: Request, res: Response) => {
    const product = new Product(req.body)
    const products = await product.newProduct()
    res.status(200).json({ response: products })
  }

  private updateProduct = async (req: Request, res: Response) => {
    const product = new Product(req.body)
    const products = await product.updateProduct()
    res.status(200).json({ response: products })
  }

  private searchProductById = async (req: Request, res: Response) => {
    const productData = new Product(req.body)
    const product = await productData.getProductById()
    res.status(200).json({ response: product })
  }

  private getAllProductsInative = async (req: Request, res: Response) => {
    const product = new Product(req.body)
    const { initialDate, finalDate } = req.params
    const products = await product.getAllProducsInative({
      initialDate,
      finalDate
    })
    res.status(200).json({ response: products })
  }

  private getAllProductsAtive = async (req: Request, res: Response) => {
    const product = new Product(req.body)
    const { initialDate, finalDate } = req.params
    const products = await product.getAllProducsAtive({
      initialDate,
      finalDate
    })
    res.status(200).json({ response: products })
  }

  public getRouter (): Router {
    return this.router
  }
}
