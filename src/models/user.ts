import { connection } from '~config/mongoConnection'
import { collecionsEnum, errorEnum } from '~utils/enum.colections'
import { SECRET } from '~utils/exports.utils'
import { compare, genSalt, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

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

  getUser = (): User => {
    const keysProduct = Object.keys(this)
    let user = {}
    keysProduct.forEach((key) => {
      if (typeof this[key] !== 'function') {
        user = { ...user, [key]: this[key] }
      }
    })
    return user as User
  }

  updateUserPass = (password: string): void => {
    this.password = password
  }

  findUserById = async (_id: ObjectId): Promise<User> => {
    const db = await connection()
    const collectionDb = db.collection(collecionsEnum.USERS)
    return await collectionDb.findOne({ _id })
  }

  findUserByEmail = async (email: string): Promise<User> => {
    const db = await connection()
    const collectionDb = db.collection(collecionsEnum.USERS)
    return await collectionDb.findOne({ email })
  }

  create = async (): Promise<ObjectId> => {
    const db = await connection()
    const collectionDb = db.collection(collecionsEnum.USERS)
    const { insertedId: _id } = await collectionDb.insertOne(this.getUser())
    return _id as ObjectId
  }

  createUser = async (): Promise<User> => {
    const { password, email } = this
    const userExists = await this.findUserByEmail(email)

    if (userExists) throw new Error(errorEnum.USER_EXISTS)
    const { updateUserPass } = this
    updateUserPass(await hash(password, await genSalt(12)))
    const { password: _, ...rest } = this.getUser()
    const _id = await this.create()
    return { _id, ...rest } as User
  }

  signIn = async (): Promise<User> => {
    const userExists = await this.findUserByEmail(this.email)
    if (!userExists) throw new Error(errorEnum.INVALID_EMAIL_OR_PASS)
    const isValid = await compare(this.password, userExists.password)
    if (!isValid) throw new Error(errorEnum.INVALID_EMAIL_OR_PASS)
    return userExists as User
  }

  updateUser (user: User): void {
    const keysProduct = Object.keys(user)
    keysProduct.forEach((key) => (this[key] = user[key]))
  }

  createToken = (getRules: boolean = false) => {
    const rules = getRules ? this.rules : undefined
    const { password, ...rest } = this
    return jwt.sign({ ...rest, rules }, SECRET, {
      expiresIn: '24h'
    })
  }

  newUser = async (): Promise<string> => {
    this.updateUser(await this.createUser())
    return this.createToken()
  }

  login = async (): Promise<string> => {
    this.updateUser(await this.signIn())
    const token = this.createToken()
    return token
  }

  getUserById = async (): Promise<string> => {
    this.updateUser(await this.findUserById(this._id))
    const token = this.createToken(true)
    return token
  }
}
