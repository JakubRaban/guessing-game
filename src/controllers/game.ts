import { Server, Socket } from 'socket.io'
import {
  CLIENT_SENT_EVENTS,
  SERVER_SENT_EVENTS,
} from '../../client/src/events/socket-event-types'
import { JoinLeaveGameEventPayload } from '../../client/src/types/event-payloads'
import { joinGame, startGame } from '../services/game'

export default (io: Server, socket: Socket) => {
  const joinGameController = async ({ gameId }: JoinLeaveGameEventPayload) => {
    console.log('joinGame')
    const joinGameResult = await joinGame(gameId, socket.id)
    const { game, error, allPlayers } = joinGameResult
    if (error) {
      socket.emit(SERVER_SENT_EVENTS.ERROR_JOINING_GAME, joinGameResult)
    } else {
      socket.data.gameId = game.urlId
      socket.join(game.urlId)
      io.to(game.urlId).emit(SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED, allPlayers)
    }
  }

  const startGameController = async () => {
    // TODO make sure game status is 'lobby'
    console.log('startGame')
    await startGame(socket.data.gameId)
    io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.GAME_STARTED)
  }

  socket.on(CLIENT_SENT_EVENTS.JOIN_GAME, joinGameController)
  socket.on(CLIENT_SENT_EVENTS.START_GAME, startGameController)
}
