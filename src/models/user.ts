import { SECRET } from '~utils/exports.utils'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

import { createUser, signIn, getUserById } from './functions/user'
import { Rule } from './rules'

export class User {
  _id: ObjectId
  name: string
  email: string
  createdAt: string
  active: boolean
  password: string
  urlImage: string
  rules: Rule[]

  constructor (user: User) {
    this._id = user._id ? new ObjectId(user._id) : new ObjectId()
    this.name = user.name || ''
    this.email = user.email || ''
    this.createdAt = user.createdAt || new Date().toISOString()
    this.active = user.active || true
    this.password = user.password || undefined
    this.urlImage = user.urlImage || ''
    this.rules = user.rules || []
  }

  updateUser (user: User): void {
    const id = user._id ? new ObjectId(user._id) : new ObjectId()
    const createdAt = user.createdAt || new Date().toISOString()
    const active = user.active ? user.active : true
    const rules = user.rules || undefined

    this._id = id
    this.name = user.name
    this.email = user.email
    this.createdAt = createdAt
    this.password = user.password
    this.urlImage = user.urlImage
    this.active = active
    this.rules = rules
  }

  convertToJSON (): any {
    const { rules, password, ...rest } = this
    return { ...rest }
  }

  createToken = (getRules: boolean = false) => {
    const rules = getRules ? this.rules : undefined
    return jwt.sign({ ...this.convertToJSON(), rules }, SECRET, {
      expiresIn: '24h'
    })
  }

  newUser = async (): Promise<string> => {
    this.updateUser(await createUser(this))
    return this.createToken()
  }

  login = async (): Promise<string> => {
    const { email, password } = this
    this.updateUser(await signIn({ email, password }))
    const token = this.createToken()
    return token
  }

  getUserById = async (): Promise<string> => {
    this.updateUser(await getUserById(this._id))
    const token = this.createToken(true)
    return token
  }
}
