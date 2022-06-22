// import jwtDecode from 'jwt-decode'
import * as io from 'socket.io'
// import { User } from '~models/user'
import ApiMesseger from '~models/api.messeger'

// rewrite class
class Sockets {
  private io: io.Server
  private whatsApp = ApiMesseger
  constructor (io: io.Server) {
    this.io = io
  }

  public init = () => {
    this.io.on('connection', (socket) => {
      // const { query } = socket.handshake
      // console.log('a user connected')

      // if (query.token) {
      //   const user = jwtDecode(String(query.token)) as User
      //   const newUser = new User(user)
      //   const messeger = new ApiMesseger(String(newUser._id))
      //   console.log('messeger: ', messeger)

      //   socket.on(
      //     `client_${String(newUser._id)}`,
      //     async (positionApplicator: any) => {
      //       this.io.emit(`client_${String(newUser._id)}`, {
      //         response: messeger
      //       })
      //     }
      //   )
      // }
    })
  }
}

export default Sockets
