/* eslint-disable n/no-deprecated-api */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MONGO_DB_URL } from '~utils/exports.utils'
import { MongoClient } from 'mongodb'
import url from 'url'

const DB_NAME = url.parse(MONGO_DB_URL).pathname.substr(1)

let cachedDb = null

export const connection = () => {
  if (cachedDb) {
    return cachedDb
  }

  return MongoClient.connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then((conn) => {
      const connect = conn.db(DB_NAME)
      cachedDb = connect
      return connect
    })
    .catch((err) => {
      console.error('error: ', err)
      process.exit(1)
    })
}

export default connection
