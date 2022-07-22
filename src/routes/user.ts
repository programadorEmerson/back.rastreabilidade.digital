import 'express-async-errors'
import { Validations } from '~middlewares/validations'
import { User } from '~models/user'
import { Request, Response, Router } from 'express'
import { ObjectId } from 'mongodb'

export class RoutesUser {
  private router: Router
  private meddlewares: Validations

  constructor () {
    this.router = Router()
    this.meddlewares = new Validations()
    this.routes()
  }

  private routes () {
    const {
      meddlewares: {
        userValidator,
        signInValidator,
        tokenValidator
      }
    } = this
    this.router.post('/create', userValidator, this.createUser)
    this.router.post('/sigin', signInValidator, this.signIn)
    this.router.get('/me', tokenValidator, this.me)
  }

  private createUser = async (req: Request, res: Response) => {
    const user = new User(req.body)
    const token = await user.newUser()
    res.status(200).json({ response: token })
  }

  private signIn = async (req: Request, res: Response) => {
    const user = new User(req.body)
    const token = await user.login()
    res.status(200).json({ response: token })
  }

  private me = async (req: Request, res: Response) => {
    const userData = { _id: new ObjectId(req.body._idRef) } as User
    const user = new User(userData)
    const token = await user.getUserById()
    res.status(200).json({ response: token })
  }

  public getRouter (): Router {
    return this.router
  }
}
