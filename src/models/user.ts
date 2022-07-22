import { SECRET } from '~utils/exports.utils'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

import { createUser, signIn, getUserById } from './functions/user'
import { Rule } from './rules'

export class User {
  _id: ObjectId = new ObjectId()
  name: string = ''
  email: string = ''
  createdAt: string = new Date().toISOString()
  active: boolean = true
  password: string | undefined
  urlImage: string = ''
  rules: Rule[] = undefined

  constructor (user?: User) {
    if (user) {
      const keysProduct = Object.keys(user)
      keysProduct.forEach((key) => (this[key] = user[key]))
    }
  }

  updateUser (user: User): void {
    const keysProduct = Object.keys(user)
    keysProduct.forEach((key) => {
      if (key === '_id') {
        const value = user[key] ? user[key] : new ObjectId()
        this[key] = value
      } else if (key === 'createdAt') {
        const value = user[key] ? user[key] : new Date().toISOString()
        this[key] = value
      } else if (key === 'active') {
        const value = user[key] ? user[key] : true
        this[key] = value
      } else if (key === 'rules') {
        const value = user[key] ? user[key] : undefined
        this[key] = value
      }
      this[key] = user[key]
    })
  }

  createToken = (getRules: boolean = false) => {
    const rules = getRules ? this.rules : undefined
    const { password, ...rest } = this
    return jwt.sign({ ...rest, rules }, SECRET, {
      expiresIn: '24h'
    })
  }

  newUser = async (): Promise<string> => {
    this.updateUser(await createUser(this))
    return this.createToken()
  }

  login = async (): Promise<string> => {
    this.updateUser(await signIn(this))
    const token = this.createToken()
    return token
  }

  getUserById = async (): Promise<string> => {
    this.updateUser(await getUserById(this._id))
    const token = this.createToken(true)
    return token
  }
}
