import { Server, Socket } from 'socket.io'

import registerGameEvents from './game'
import registerPlayerEvents from './player'
import registerTurnEvents from './turn'
import registerSocketEvents from './socket'

const onConnection = (io: Server) => (socket: Socket) => {
  socket.onAny((eventName) => console.log(eventName))
  registerGameEvents(io, socket)
  registerPlayerEvents(io, socket)
  registerTurnEvents(io, socket)
  registerSocketEvents(io, socket)
}

export default onConnection
