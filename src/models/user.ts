import { connection } from '~config/mongoConnection'
import { collecionsEnum } from '~utils/colections'
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
    const result = await collectionDb.findOne({ _id })
    return result
  }

  findUserByEmail = async (email: string): Promise<User> => {
    const db = await connection()
    const collectionDb = db.collection(collecionsEnum.USERS)
    const result = await collectionDb.findOne({ email })
    return result
  }

  create = async (): Promise<ObjectId> => {
    const db = await connection()
    const collectionDb = db.collection(collecionsEnum.USERS)
    const { insertedId } = await collectionDb.insertOne(this.getUser())
    return insertedId as ObjectId
  }

  createUser = async (): Promise<User> => {
    const { password, email } = this
    const userExists = await this.findUserByEmail(email)

    if (userExists) throw new Error('This user already exists')
    const pass = await hash(password, await genSalt(12))
    this.updateUserPass(pass)
    const insertedId = await this.create()
    const { password: _, ...rest } = this.getUser()
    return { _id: insertedId, ...rest } as User
  }

  signIn = async (): Promise<User> => {
    const userExists = await this.findUserByEmail(this.email)
    if (!userExists) throw new Error('Invalid email or password')
    const isValid = await compare(this.password, userExists.password)
    if (!isValid) throw new Error('Invalid email or password')
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
