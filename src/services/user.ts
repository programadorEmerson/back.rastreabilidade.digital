import { Validations } from '~middlewares/validations'
import { User } from '~models/user'
import { UserResponseCreate, UserResponseGetById, UserResponseSignin } from '~types/user'
import { Request, Response } from 'express'

export class ServiceUser {
  private meddlewares = new Validations()

  async createNewUser (req: Request, _res: Response): Promise<UserResponseCreate> {
    const user = new User(req.body)
    const token = await user.newUser()
    return { status: 200, response: token }
  }

  async signin (req: Request, _res: Response): Promise<UserResponseSignin> {
    const user = new User(req.body)
    const token = await user.login()
    return { status: 200, response: token }
  }

  async getUserById (_id: Object): Promise<UserResponseGetById> {
    const user = new User({ _id } as User)
    const token = await user.getUserById()
    return { status: 200, response: token }
  }
}
