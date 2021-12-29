import { Server, Socket } from 'socket.io'

export default (io: Server, socket: Socket) => {
  const joinGame = (payload: any) => {
    console.log('join game', payload)
  }

  socket.on('join game', joinGame)
}
