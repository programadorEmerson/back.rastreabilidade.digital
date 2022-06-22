import connection from '~config/mongoConnection'
import { User } from '~models/user'
import { SigninType } from '~types/signin'
import { genSalt, hash, compare } from 'bcrypt'
import { ObjectId } from 'mongodb'

export const createUser = async (user: User): Promise<User> => {
  const db = await connection()
  const collection = await db.collection('users')
  const userExists = await collection.findOne({ email: user.email })

  if (userExists) throw new Error('User already exists')
  const password = await hash(user.password, await genSalt(12))
  const { insertedId } = await collection.insertOne({ ...user, password })
  const { password: _, ...rest } = user
  return { _id: insertedId, ...rest } as User
}

export const getUserById = async (id: ObjectId): Promise<User> => {
  const db = await connection()
  const users = await db.collection('users')
  const user = await users.findOne({ _id: id })
  if (!user) throw new Error('User not found')
  const { password: _, ...rest } = user
  return rest as User
}

export const signIn = async ({ email, password }: SigninType): Promise<User> => {
  const db = await connection()
  const userExists = (await db.collection('users').findOne({ email }))
  if (!userExists) throw new Error('Incorrect email or password')
  const isValid = await compare(password, userExists.password)
  if (!isValid) throw new Error('Incorrect email or password')
  return userExists as User
}
