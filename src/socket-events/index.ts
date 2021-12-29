import { Server, Socket } from 'socket.io'

import registerGameEvents from './game'

const onConnection = (io: Server) => (socket: Socket) => {
  registerGameEvents(io, socket)
}

export default onConnection
