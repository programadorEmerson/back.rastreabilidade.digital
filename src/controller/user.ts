import { ServiceUser } from '~services/user'
import { Request, Response } from 'express'

export class ControllerUser {
  private serviceUser = new ServiceUser()

  createUser = async (req: Request, res: Response) => {
    const { status, response } = await this.serviceUser.createNewUser(req, res)
    res.status(status).json({ response })
  }

  signIn = async (req: Request, res: Response) => {
    const { status, response } = await this.serviceUser.signin(req, res)
    res.status(status).json({ response })
  }

  me = async (req: Request, res: Response) => {
    const { userRequest } = req.body
    const { status, response } = await this.serviceUser.getUserById(userRequest)
    res.status(status).json({ response })
  }
}
