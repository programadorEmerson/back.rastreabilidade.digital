import { Request, Response, Router } from 'express'
import { ValidationsUser } from '~middlewares/validations.user'
import { User } from '~models/user'

export class RoutesUser {
  private router: Router

  constructor () {
    this.router = Router()
    this.routes()
  }

  get route (): Router {
    return this.router
  }

  routes () {
    this.router.post(
      '/',
      async (req: Request, res: Response) => {
        res.status(200).json({ status: 'ok' })
      })

    this.router.post(
      '/user',
      ValidationsUser.createUser,
      async (req: Request, res: Response) => {
        const newUser = req.body as User
        const user = new User(newUser)
        user.updateUser(newUser)
        const token = await user.newUser()
        res.status(200).json({ response: token })
      }
    )

    this.router.post(
      '/sigin',
      ValidationsUser.signIn,
      async (req: Request, res: Response) => {
        const userData = req.body as User
        const user = new User(userData)
        user.updateUser(userData)
        const token = await user.sigIn()
        res.status(200).json({ response: token })
      }
    )

    return this.router
  }
}
