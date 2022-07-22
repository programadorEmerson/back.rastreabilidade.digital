// Collections
export const USERS = 'users'
export const PRODUCTS = 'products'

export const CREATE_ONE = 'createOne'
export const ADD_ONE_ITEM = 'addOneItemInArrayOfCollection'
export const UPDATE_ONE_ITEM = 'updateItemInArrayOfCollection'
export const GET_ALL_INATIVE = 'getAllItemsInArrayOfCollectionInactive'
export const GET_BY_ID = 'getById'
export const FIND_ONE = 'findOne'

// Return error
export const errosByEnums = (collection: string, type: string) => {
  if (collection === USERS) {
    if (type === CREATE_ONE) {
      return 'User already exists'
    }
    if (type === GET_BY_ID) {
      return 'User not found'
    }
    if (type === FIND_ONE) {
      return 'Incorrect email or password'
    }
  }
  if (collection === PRODUCTS) {
    if (type === ADD_ONE_ITEM) {
      return 'Product already exists'
    }
    if (type === UPDATE_ONE_ITEM) {
      return 'Item not found for update'
    }
  }
}
