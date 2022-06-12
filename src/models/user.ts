import { ObjectId } from 'mongodb'
import { createUser, signIn } from './functions/user'
import jwt from 'jsonwebtoken'
import { SECRET } from '~utils/exports.utils'

export class User {
  _id: ObjectId
  name: string
  email: string
  createdAt: string
  active: boolean
  password: string

  constructor ({ _id, name = null, email = null, createdAt = null, active = null, password = null }: User) {
    this._id = _id ? new ObjectId(_id) : new ObjectId()
    this.name = name || ''
    this.email = email || ''
    this.createdAt = createdAt || new Date().toISOString()
    this.active = active || true
    this.password = password || undefined
  }

  updateUser (user: User): void {
    const id = user._id ? new ObjectId(user._id) : new ObjectId()
    const createdAt = user.createdAt ? user.createdAt : new Date().toISOString()
    const active = user.active ? user.active : true

    this._id = id
    this.name = user.name
    this.email = user.email
    this.createdAt = createdAt
    this.password = user.password
    this.active = active
  }

  static updateUser (user: User): void {
    this.updateUser(user)
  }

  convertToJSON (): any {
    return {
      _id: String(this._id),
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      active: this.active
    }
  }

  createToken = () => {
    const userToken = jwt.sign(this.convertToJSON(), SECRET, {
      expiresIn: '24h'
    })
    return userToken
  }

  newUser = async (): Promise<string> => {
    await createUser(this)
    this.password = undefined
    return this.createToken()
  }

  sigIn = async (): Promise<string> => {
    this.updateUser(await signIn(this))
    this.password = undefined
    return this.createToken()
  }
}
