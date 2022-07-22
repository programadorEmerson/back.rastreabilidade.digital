import { Validations } from '~middlewares/validations'
// import ApiMesseger from '~models/api.messeger'
import { Request, Response, Router } from 'express'

export class RoutesWhats {
  private router: Router
  // private message: ApiMesseger
  private phoneNumber = new Validations()
  private userValidator: Validations

  constructor () {
    this.router = Router()
    // this.message = new ApiMesseger()
    this.userValidator = new Validations()
    this.routes()
  }

  get route (): Router {
    return this.router
  }

  routes () {
    const { router } = this
    router.post(
      '/send-text',
      this.phoneNumber.phoneValidator,
      async (req: Request, res: Response) => {
        // const { number: to, body } = req.body
        // await this.message.sendText({ to, body })
        res.status(200).json({
          message: 'Message sent successfully'
        })
      }
    )

    router.post(
      '/send-link-preview',
      this.phoneNumber.phoneValidator,
      async (req: Request, res: Response) => {
        // const { number: to, body, url } = req.body
        // await this.message.sendLinkPreview({ to, body, url })
        res.status(200).json({
          message: 'Link sent successfully'
        })
      }
    )

    router.post(
      '/send-file',
      this.phoneNumber.phoneValidator,
      async (req: Request, res: Response) => {
        // const { number: to } = req.body
        // await this.message.sendFile({ to })
        res.status(200).json({
          message: 'Image sent successfully'
        })
      }
    )

    router.post(
      '/create-instance',
      this.userValidator.decriptToken,
      async (req: Request, res: Response) => {
        res.status(200).json({
          message: 'teste'
        })
      }
    )

    return router
  }
}
