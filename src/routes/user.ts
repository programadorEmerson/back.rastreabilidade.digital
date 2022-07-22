import 'express-async-errors'
import { Validations } from '~middlewares/validations'
import { Router } from 'express'
import { ControllerUser } from 'src/controller/user'

export class RoutesUser {
  private router: Router
  private userController = new ControllerUser()
  private meddlewares = new Validations()

  constructor () {
    this.router = Router()
    this.routes()
  }

  private routes () {
    const { createUser, signIn, me } = this.userController
    const { signInValidator, userValidator, tokenValidator } = this.meddlewares

    this.router.post('/create', userValidator, createUser)
    this.router.post('/sigin', signInValidator, signIn)
    this.router.get('/me', tokenValidator, me)
  }

  public getRouterUser (): Router {
    return this.router
  }
}
