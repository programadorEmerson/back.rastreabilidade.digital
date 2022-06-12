import connection from '~config/mongoConnection'
import { User } from '~models/user'

const checkUserExists = async (email: string): Promise<boolean> => {
  const db = await connection()
  const users = await db.collection('users')
  const user = await users.findOne({ email })
  return !!user
}

export const createUser = async (user: User): Promise<void> => {
  try {
    const userExists = await checkUserExists(user.email)
    if (userExists) throw new Error('User already exists')
    const db = await connection()
    await db.collection('users').insertOne(user)
  } catch (error) {
    throw new Error(error.message)
  }
}

export const signIn = async (user: User): Promise<User> => {
  try {
    const db = await connection()
    const userExists = (await db.collection('users').findOne({ email: user.email })) as User
    if (!userExists) throw new Error('Incorrect email or password')
    if (userExists.password !== user.password) { throw new Error('Incorrect email or password') }
    return userExists
  } catch (error) {
    throw new Error(error.message)
  }
}
