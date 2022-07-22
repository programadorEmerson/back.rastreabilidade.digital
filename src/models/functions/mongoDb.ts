import { format } from 'date-fns'

import { connection } from '~config/mongoConnection'
import {
  AddIetmInSubArrayProps,
  FindOneProps,
  GenericType,
  GetAllInSubArrayProps,
  GetIetmInSubArrayProps,
  getItemsByDataProps,
  inactivateAnItemInArrayByIdProps,
  InsertManyProps,
  InsertOneProps,
  UpdateIetmInSubArrayProps
} from '~types/mongoRequest'
import { ObjectId } from 'mongodb'

import { ADD_ONE_ITEM, errosByEnums, PRODUCTS, UPDATE_ONE_ITEM } from './translation.codes'

export const findOne = async <T>({
  field,
  collection
}: FindOneProps): Promise<T> => {
  const db = await connection()
  const collectionDb = db.collection(collection)
  const result = await collectionDb.findOne(field)
  return result as T
}

export const createOne = async ({
  collection,
  data
}: InsertOneProps): Promise<ObjectId> => {
  const db = await connection()
  const collectionDb = db.collection(collection)
  const { insertedId } = await collectionDb.insertOne(data)
  return insertedId as ObjectId
}

export const createMany = async ({ collection, data }: InsertManyProps) => {
  const db = await connection()
  const collectionDb = db.collection(collection)
  const result = await collectionDb.insertMany(data)
  return result
}

export const getAllItemsInArrayOfCollectionActive = async <T>({
  collection,
  _idRef,
  finalDate = new Date().toISOString(),
  initialDate = new Date().toISOString()
}: GetAllInSubArrayProps): Promise<T[]> => {
  const db = await connection()
  const iDate = format(new Date(initialDate), 'yyyy-MM-dd')
  const fDate = format(new Date(finalDate), 'yyyy-MM-dd')

  const result: { list: GenericType[] } = await db
    .collection(collection)
    .findOne({ _id: _idRef })

  if (result) {
    return result.list
      .sort((a, b) => {
        if (a.createdAt < b.createdAt) return -1
        if (a.createdAt > b.createdAt) return 1
        return 0
      })
      .filter((item) => item.active)
      .filter((item) => {
        const dateRef = format(new Date(item.createdAt), 'yyyy-MM-dd')
        return dateRef >= iDate && dateRef <= fDate
      }) as unknown as T[]
  }
  return []
}

export const getAllItemsInArrayOfCollectionInactive = async <T>(
  { collection, _idRef, finalDate = new Date().toISOString(), initialDate = new Date().toISOString() }: GetAllInSubArrayProps
): Promise<T[]> => {
  const db = await connection()
  const iDate = format(new Date(initialDate), 'yyyy-MM-dd')
  const fDate = format(new Date(finalDate), 'yyyy-MM-dd')

  const result: { list: GenericType[] } = await db
    .collection(collection)
    .findOne({ _id: _idRef })

  if (result) {
    return result.list
      .sort((a, b) => {
        if (a.createdAt < b.createdAt) return -1
        if (a.createdAt > b.createdAt) return 1
        return 0
      })
      .filter((item) => !item.active).filter((item) => {
        const dateRef = format(new Date(item.createdAt), 'yyyy-MM-dd')
        return dateRef >= iDate && dateRef <= fDate
      }) as unknown as T[]
  }
  return []
}

export const getItemInArrayOfCollection = async <T>(
  props: GetIetmInSubArrayProps
): Promise<T> => {
  const { _idRef, collection, idItem } = props
  const db = await connection()
  const { list }: { list: GenericType[] } = await db
    .collection(collection)
    .findOne(
      { _id: new ObjectId(_idRef) },
      {
        projection: {
          list: {
            $elemMatch: {
              _id: new ObjectId(idItem)
            }
          }
        }
      }
    )
  if (list.length === 0) return {} as T
  return list[0] as unknown as T
}

export const updateItemInArrayOfCollection = async <T>(
  props: UpdateIetmInSubArrayProps
): Promise<T[]> => {
  const db = await connection()
  const { _idRef, collection, idItem, item: itemUpdated } = props
  const item = await getItemInArrayOfCollection<T>({ idItem, _idRef, collection })
  if (item) {
    await db.collection(props.collection).updateOne(
      { _id: _idRef, 'list._id': new ObjectId(idItem) },
      {
        $set: {
          'list.$': { ...item, ...itemUpdated }
        }
      },
      {
        returnOriginal: false
      }
    )

    return await getAllItemsInArrayOfCollectionActive<T>({ collection, _idRef })
  }
  throw new Error(errosByEnums(PRODUCTS, UPDATE_ONE_ITEM))
}

export const addOneItemInArrayOfCollection = async <T>(
  props: AddIetmInSubArrayProps
): Promise<T[]> => {
  const db = await connection()

  const verifyDuplicate = Boolean(props.code)

  if (verifyDuplicate) {
    const allItems = (await getAllItemsInArrayOfCollectionActive<T>({
      collection: props.collection,
      _idRef: props._idRef
    })) as unknown as AddIetmInSubArrayProps[]
    const itemExist = allItems.some((item) => item.code === props.code)
    if (itemExist) {
      throw new Error(errosByEnums(PRODUCTS, ADD_ONE_ITEM))
    }
  }

  const newItem = {
    ...props.item,
    _id: new ObjectId(),
    createdAt: new Date().toISOString(),
    deletedAt: null,
    active: true
  } as unknown as { _idRef: ObjectId }
  delete newItem._idRef

  const insertItem = async () => {
    await db.collection(props.collection).updateOne(
      { _id: props._idRef },
      {
        $push: {
          list: newItem
        }
      },
      { upsert: true }
    )
  }

  await insertItem()
  return await getAllItemsInArrayOfCollectionActive<T>({
    collection: props.collection,
    _idRef: props._idRef
  })
}

export const inactivateItemInArrayById = async <T>(
  props: inactivateAnItemInArrayByIdProps
): Promise<T[]> => {
  const db = await connection()
  await db.collection(props.collection).updateOne(
    { _id: props._idRef, 'list._id': props.idItem },
    {
      $set: {
        'list.$.active': false,
        'list.$.deletedAt': new Date().toISOString()
      }
    },
    {
      returnOriginal: false
    }
  )

  return await getAllItemsInArrayOfCollectionActive<T>({
    collection: props.collection,
    _idRef: props._idRef
  })
}

export const getItemsActiveByDataCreatedAt = async <T>(
  props: getItemsByDataProps
): Promise<T[]> => {
  const allItems = (await getAllItemsInArrayOfCollectionActive<T>({
    collection: props.collection,
    _idRef: props._idRef
  })) as unknown as GenericType[]

  return allItems.filter((item: GenericType) => {
    const dataRef = format(new Date(item.createdAt), 'yyyy-MM-dd')
    return (
      dataRef >= format(new Date(props.initialDate), 'yyyy-MM-dd') &&
      dataRef <= format(new Date(props.finalDate), 'yyyy-MM-dd')
    )
  }) as unknown as T[]
}

export const getItemsActiveByDataDueDate = async <T>(
  props: getItemsByDataProps
): Promise<T[]> => {
  const allItems = (await getAllItemsInArrayOfCollectionActive<T>({
    collection: props.collection,
    _idRef: props._idRef
  })) as unknown as GenericType[]

  return allItems.filter((item: GenericType) => {
    const dataRef = format(new Date(item.dueDate), 'yyyy-MM-dd')
    return (
      dataRef >= format(new Date(props.initialDate), 'yyyy-MM-dd') &&
      dataRef <= format(new Date(props.finalDate), 'yyyy-MM-dd')
    )
  }) as unknown as T[]
}

export const getItemsInactiveByDataCreatedAt = async <T>(
  props: getItemsByDataProps
): Promise<T[]> => {
  const allItems = (await getAllItemsInArrayOfCollectionInactive<T>({
    collection: props.collection,
    _idRef: props._idRef
  })) as unknown as GenericType[]

  return allItems.filter((item: GenericType) => {
    const dataRef = format(new Date(item.createdAt), 'yyyy-MM-dd')
    return (
      dataRef >= format(new Date(props.initialDate), 'yyyy-MM-dd') &&
      dataRef <= format(new Date(props.finalDate), 'yyyy-MM-dd')
    )
  }) as unknown as T[]
}

export const getItemsInactiveByDataDueDate = async <T>(
  props: getItemsByDataProps
): Promise<T[]> => {
  const allItems = (await getAllItemsInArrayOfCollectionInactive<T>({
    collection: props.collection,
    _idRef: props._idRef
  })) as unknown as GenericType[]

  return allItems.filter((item: GenericType) => {
    const dataRef = format(new Date(item.dueDate), 'yyyy-MM-dd')
    return (
      dataRef >= format(new Date(props.initialDate), 'yyyy-MM-dd') &&
      dataRef <= format(new Date(props.finalDate), 'yyyy-MM-dd')
    )
  }) as unknown as T[]
}
