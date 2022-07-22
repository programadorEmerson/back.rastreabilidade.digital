import { ObjectId } from 'mongodb'

export interface GenericType {
  createdAt: string;
  dueDate: string;
  active: boolean;
  _id: ObjectId;
  _idRef: ObjectId;
}

export interface FindOneProps {
  collection: string;
  field: { [key: string]: string | ObjectId };
}

export interface InsertOneProps {
  collection: string;
  data: object;
}

export interface InsertManyProps {
  collection: string;
  data: object[];
}

export interface GetAllInSubArrayProps {
  collection: string;
  initialDate?: string;
  finalDate?: string;
  _idRef: ObjectId;
}

export interface GetIetmInSubArrayProps {
  collection: string;
  _idRef: ObjectId;
  idItem: ObjectId;
}

export interface UpdateIetmInSubArrayProps {
  collection: string;
  _idRef: ObjectId;
  idItem: ObjectId;
  item: object;
}

export interface AddIetmInSubArrayProps {
  collection: string;
  _idRef: ObjectId;
  item: object;
  code?: string;
}

export interface inactivateAnItemInArrayByIdProps {
  collection: string;
  _idRef: ObjectId;
  idItem: ObjectId;
}

export interface getItemsByDataProps {
  collection: string;
  _idRef: ObjectId;
  initialDate: string;
  finalDate: string;
}
