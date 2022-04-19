import { Server, Socket } from 'socket.io'
import { disconnect } from '../services/socket'
import { SERVER_SENT_EVENTS } from '../../client/src/events/socket-event-types'

export default (io: Server, socket: Socket) => {
  const disconnectController = async () => {
    console.log('disconnect')
    const currentPlayersAfterDisconnect = await disconnect(socket.id, socket.data.gameId)
    socket
      .to(socket.data.gameId)
      .emit(SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED, currentPlayersAfterDisconnect)
  }

  socket.on('disconnect', disconnectController)
}
