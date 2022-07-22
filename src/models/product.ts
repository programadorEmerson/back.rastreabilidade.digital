
import { ObjectId } from 'mongodb'

import { addOneItemInArrayOfCollection, getAllItemsInArrayOfCollectionActive, getAllItemsInArrayOfCollectionInactive, getItemInArrayOfCollection, updateItemInArrayOfCollection } from './functions/mongoDb'
import { PRODUCTS } from './functions/translation.codes'

type DateRefProps = {
  initialDate: string;
  finalDate: string;
}

export class Product {
  _id: ObjectId
  _idRef: ObjectId
  name: string
  cretedAt: string
  deletedAt: string | null
  updatedAt: string = new Date().toISOString()
  active: boolean = true
  code: string
  urlImages: string[] = []

  constructor (product) {
    const keysProduct = Object.keys(product)
    keysProduct.forEach((key) => (this[key] = product[key]))
  }

  newProduct = async (): Promise<Product[]> => {
    return await addOneItemInArrayOfCollection<Product>({
      collection: PRODUCTS,
      _idRef: this._idRef,
      item: this,
      code: this.code
    })
  }

  updateProduct = async (): Promise<Product[]> => {
    return await updateItemInArrayOfCollection<Product>({
      collection: PRODUCTS,
      _idRef: this._idRef,
      idItem: this._id,
      item: this
    })
  }

  getProductById = async (): Promise<Product> => {
    return await getItemInArrayOfCollection<Product>({
      collection: PRODUCTS,
      _idRef: this._idRef,
      idItem: this._id
    })
  }

  getAllProducsInative = async ({
    initialDate,
    finalDate
  }: DateRefProps): Promise<Product[]> => {
    return await getAllItemsInArrayOfCollectionInactive<Product>({
      collection: PRODUCTS,
      _idRef: this._idRef,
      initialDate,
      finalDate
    })
  }

  getAllProducsAtive = async ({
    initialDate,
    finalDate
  }: DateRefProps): Promise<Product[]> => {
    return await getAllItemsInArrayOfCollectionActive<Product>({
      collection: PRODUCTS,
      _idRef: this._idRef,
      initialDate,
      finalDate
    })
  }
}
