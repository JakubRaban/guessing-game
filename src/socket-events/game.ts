import { Server, Socket } from 'socket.io'
import {
  CLIENT_SENT_EVENTS,
  SERVER_SENT_EVENTS,
} from '../../client/src/events/event-types'
import sequelize from '../models'
import {
  JoinLeaveGameEventPayload,
  SetNameEventPayload,
} from '../../client/src/types/event-payloads'

const { Game, GameOptions, Player } = sequelize.models

export default (io: Server, socket: Socket) => {
  const joinGame = async ({ gameId }: JoinLeaveGameEventPayload) => {
    const game = (
      await Game.findOne({
        where: { urlId: gameId },
        include: Player,
      })
    ).get()
    const options = (
      await GameOptions.findOne({ where: { GameUrlId: game.urlId } })
    ).get()
    if (game.Players.length === options.maxPlayers) {
      socket.emit(SERVER_SENT_EVENTS.ERROR_JOINING_GAME, {
        error: 'Player limit reached',
      })
    } else if (game.status !== 'lobby') {
      socket.emit(SERVER_SENT_EVENTS.ERROR_JOINING_GAME, {
        error: 'This game is already in progress or finished',
      })
    } else {
      socket.data.gameId = game.urlId
      await Player.create({ socketId: socket.id, GameUrlId: game.urlId })
      Player.findAll({ where: { GameUrlId: game.urlId } }).then((players) => {
        socket.join(game.urlId)
        socket.emit(SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED, players)
        socket
          .to(game.urlId)
          .emit(SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED, players)
      })
    }
  }

  const setName = async ({ name }: SetNameEventPayload) => {
    await Player.update({ name }, { where: { socketId: socket.id } })
    Player.findAll({ where: { GameUrlId: socket.data.gameId } }).then(
      (players) => {
        socket.emit(SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED, players)
        socket
          .to(socket.data.gameId)
          .emit(SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED, players)
      }
    )
  }

  const disconnect = async () => {
    await Player.destroy({ where: { socketId: socket.id } })
    Player.findAll({ where: { GameUrlId: socket.data.gameId } }).then(
      (players) => {
        socket
          .to(socket.data.gameId)
          .emit(SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED, players)
      }
    )
  }

  socket.on(CLIENT_SENT_EVENTS.JOIN_GAME, joinGame)
  socket.on(CLIENT_SENT_EVENTS.SET_NAME, setName)
  socket.on('disconnect', disconnect)
}
