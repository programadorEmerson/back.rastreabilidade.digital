
import { User } from '~models/user'
import { genSalt, hash, compare } from 'bcrypt'
import { ObjectId } from 'mongodb'

import { findOne, createOne } from './mongoDb'
import { CREATE_ONE, errosByEnums, FIND_ONE, GET_BY_ID, USERS } from './translation.codes'

export const createUser = async (user: User): Promise<User> => {
  const { email, password } = user
  const userExists = await findOne<User>({ collection: USERS, field: { email } })

  if (userExists) throw new Error(errosByEnums(USERS, CREATE_ONE))
  const pass = await hash(password, await genSalt(12))
  const insertedId = await createOne({
    collection: 'users',
    data: { ...user, password: pass }
  })
  const { password: _, ...rest } = user
  return { _id: insertedId, ...rest } as User
}

export const getUserById = async (_id: ObjectId): Promise<User> => {
  const user = await findOne<User>({ collection: USERS, field: { _id } })
  if (!user) throw new Error(errosByEnums(USERS, GET_BY_ID))
  const { password: _, ...rest } = user
  return rest as User
}

export const signIn = async ({ email, password }: User): Promise<User> => {
  const userExists = await findOne<User>({ collection: USERS, field: { email } })
  if (!userExists) throw new Error(errosByEnums(USERS, FIND_ONE))
  const isValid = await compare(password, userExists.password)
  if (!isValid) throw new Error(errosByEnums(USERS, FIND_ONE))
  return userExists as User
}
