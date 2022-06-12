import jwtDecode from 'jwt-decode'
import * as io from 'socket.io'
import { User } from '~models/user'
// import Sender from '~models/model'

const sockets = (io: io.Server): void => {
  try {
    io.on('connection', (socket) => {
      console.log('a user connected')
      const { query } = socket.handshake

      if (query.token) {
        const user = jwtDecode(String(query.token)) as User
        const newUser = new User(user)

        socket.on('autentication', async (positionApplicator: any) => {
          io.emit(`autentication_${String(newUser._id)}`, {})
        })
      }
    })
  } catch (error) {
    console.log('Erro')
  }
}

export default sockets

// class sockets {
//   private io: io.Server
//   private sender: Sender

//   constructor (io: io.Server) {
//     this.io = io
//     this.sender = new Sender()
//     this.initialize()
//   }

//   private initialize (): void {
//     this.io.on('connection', (socket) => {
//       const { query } = socket.handshake
//       console.log('aqui')
//       if (query.token) {
//         const user = jwtDecode(String(query.token)) as User
//         const newUser = new User(user)

//         socket.on('autentication', async (positionApplicator: any) => {
//           this.io.emit(`autentication${String(newUser._id)}`, {})
//         })
//       }
//     }
//     )
//   }
// }

// export default sockets
