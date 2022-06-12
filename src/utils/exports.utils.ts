import dotenv from 'dotenv'
dotenv.config()

export const { PORT, SECRET, MONGO_DB_URL, DB_NAME, DB_PASS } = process.env
