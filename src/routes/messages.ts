import { Request, Response, Router } from 'express'
import Sender from '~models/model'
import { PhoneNumber } from '~middlewares/validate.phone'
import { ValidationsUser } from '~middlewares/validations.user'

export class RoutesWhats {
  private router: Router
  private message: Sender
  private phoneNumber = new PhoneNumber()

  constructor () {
    this.router = Router()
    this.message = new Sender()
    this.routes()
  }

  // "venom-bot": "4.0.10",

  get route (): Router {
    return this.router
  }

  routes () {
    const { router } = this
    router.post(
      '/send-text',
      this.phoneNumber.validate,
      async (req: Request, res: Response) => {
        const { number: to, body } = req.body
        await this.message.sendText({ to, body })
        res.status(200).json({
          message: 'Message sent successfully'
        })
      }
    )

    router.post(
      '/send-link-preview',
      this.phoneNumber.validate,
      async (req: Request, res: Response) => {
        const { number: to, body, url } = req.body
        await this.message.sendLinkPreview({ to, body, url })
        res.status(200).json({
          message: 'Link sent successfully'
        })
      }
    )

    router.post(
      '/send-file',
      this.phoneNumber.validate,
      async (req: Request, res: Response) => {
        const { number: to } = req.body
        await this.message.sendFile({ to })
        res.status(200).json({
          message: 'Image sent successfully'
        })
      }
    )

    router.post(
      '/create-instance',
      ValidationsUser.decriptToken,
      async (req: Request, res: Response) => {
        // const { user } = req.body
        res.status(200).json({
          message: 'teste'
        })
      }
    )

    return router
  }
}
