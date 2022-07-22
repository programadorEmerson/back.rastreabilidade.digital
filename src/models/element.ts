import { connection } from '~config/mongoConnection'
import { collecionsEnum, errorEnum } from '~utils/enum.colections'
import { ObjectId } from 'mongodb'

import { Authorized } from './authorized'
import { Document } from './documents'

export class Element {
  _idElement: ObjectId
  _idUser: ObjectId
  cretedAt: string = new Date().toISOString()
  updatedAt: string = new Date().toISOString()
  deletedAt: string | null
  active: boolean = true
  authorized: Authorized[] = []
  document: Document[] = []
  code: string

  constructor (element: Element) {
    const keysProduct = Object.keys(element)
    keysProduct.forEach((key) => (this[key] = element[key]))
  }

  updateIdUser (idUser: ObjectId) {
    this._idUser = idUser
  }

  getAllItems = async (): Promise<Element[]> => {
    const db = await connection()
    const { list }: { list: Element[] } = await db
      .collection(collecionsEnum.ELEMENTS)
      .findOne({ _id: this._idUser })
    return list || []
  }

  addNewElement = async (): Promise<Element[]> => {
    const db = await connection()
    const elements = await this.getAllItems()
    const exist = elements.some((element) => element.code === this.code)
    if (exist) throw new Error(errorEnum.CODE_EXISTS)

    const insertItem = async () => {
      this.updateIdUser(new ObjectId())
      await db.collection(collecionsEnum.ELEMENTS).updateOne(
        { _id: this._idUser },
        {
          $push: { list: this }
        },
        { upsert: true }
      )
    }
    await insertItem()
    return [...elements, this]
  }
}
