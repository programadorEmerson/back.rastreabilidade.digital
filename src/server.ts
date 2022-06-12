import 'express-async-errors'
import cors from 'cors'
import express, { Request, Response } from 'express'
import http from 'http'
import * as io from 'socket.io'
import { RoutesWhats } from '~routes/messages'
import { PORT } from '~utils/exports.utils'
import sockets from './websockets'
import { RoutesUser } from '~routes/user'

const app = express()
const httpServer = http.createServer(app)
const user = new RoutesUser()
const whats = new RoutesWhats()

app.use(cors())
app.use(express.json())

app.get('/', (_req: Request, res: Response) => {
  return res.status(200).json({ status: 'online' })
})

app.use(user.route)
app.use(whats.route)

app.use((error: Error, _req: Request, res: Response, _next: Function) => {
  return res.status(400).json({ error: error.message })
})

const socketio = new io.Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'UPDATE', 'DELETE', 'PATCH']
  }
})

sockets(socketio)

httpServer.listen(PORT, () => {
  console.log(`Server online on port ${PORT}`)
})
