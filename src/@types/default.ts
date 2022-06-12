export type DefaultResponseProps = {
  status: number;
  sucess?: string;
  error?: string;
};

export type InsertOneProps = {
  collectionName: {
    name: string;
  };
  data: object;
};

export type InsertManyProps = {
  collectionName: {
    name: string;
  };
  user: object[];
};
