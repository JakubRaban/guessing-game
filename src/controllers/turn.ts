import { Server, Socket } from 'socket.io'
import {
  CastVoteEventPayload,
  TakeTurnEventPayload,
} from '../../client/src/types/event-payloads'
import { castVote, takeTurn } from '../services/turn'
import {
  CLIENT_SENT_EVENTS,
  SERVER_SENT_EVENTS,
} from '../../client/src/events/socket-event-types'

export default (io: Server, socket: Socket) => {
  const takeTurnController = async (turnData: TakeTurnEventPayload) => {
    console.log('take turn')
    await takeTurn(socket.id, turnData)
    io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.TURN_TAKEN, turnData)
  }

  const castVoteController = async ({ vote }: CastVoteEventPayload) => {
    console.log('cast vote')
    await castVote(socket.data.gameId, socket.id, vote)
    io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.VOTE_CAST, {
      playerId: socket.id,
      vote,
    })
  }

  socket.on(CLIENT_SENT_EVENTS.TAKE_TURN, takeTurnController)
  socket.on(CLIENT_SENT_EVENTS.CAST_VOTE, castVoteController)
}
