
import { Validations } from '~middlewares/validations'
import { RoutesUser } from '~routes/user'
import { PORT } from '~utils/exports.utils'
import cors from 'cors'
import express from 'express'
import http from 'http'
import * as io from 'socket.io'

import WebSocket from './websockets'

const app = express()
const meddlewares = new Validations()
const user = new RoutesUser()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())
app.use('/user', user.getRouter())
app.use(meddlewares.errorHandler)

new WebSocket(
  new io.Server(server, {
    cors: {
      origin: '*',
      methods: 'GET,PUT,PATCH,POST,DELETE'
    }
  })
).init()

server.listen(PORT, () => {
  console.log(`Server online on port ${PORT}`)
})
