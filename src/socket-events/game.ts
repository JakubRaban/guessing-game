import { Server, Socket } from 'socket.io'
import {
  CLIENT_SENT_EVENTS,
  SERVER_SENT_EVENTS,
} from '../../client/src/events/socket-event-types'
import sequelize from '../models'
import {
  AssignPuzzleEventPayload,
  JoinLeaveGameEventPayload,
  SetNameEventPayload,
} from '../../client/src/types/event-payloads'
import { shuffleArray } from '../helpers'

const { Game, GameOptions, Player } = sequelize.models

export default (io: Server, socket: Socket) => {
  const joinGame = async ({ gameId }: JoinLeaveGameEventPayload) => {
    console.log('joinGame')
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
        io.to(game.urlId).emit(SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED, players)
      })
    }
  }

  const setName = async ({ name }: SetNameEventPayload) => {
    // TODO make sure game status is 'lobby'
    console.log('setName')
    await Player.update({ name }, { where: { socketId: socket.id } })
    Player.findAll({ where: { GameUrlId: socket.data.gameId } }).then(
      (players) => {
        io.to(socket.data.gameId).emit(
          SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED,
          players
        )
      }
    )
  }

  const startGame = async () => {
    // TODO make sure game status is 'lobby'
    console.log('startGame')
    const { gameId } = socket.data
    await Game.update(
      { status: 'playing' },
      { where: { urlId: socket.data.gameId } }
    )
    const players = await Player.findAll({ where: { GameUrlId: gameId } })
    await Player.bulkCreate(
      shuffleArray(players).map((player, index) => ({
        ...player.get(),
        orderOfPlaying: index,
      })),
      { updateOnDuplicate: ['orderOfPlaying'] }
    )
    io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.GAME_STARTED)
  }

  const getOrderedPlayers = async () => {
    const orderedPlayers = await Player.findAll({
      where: { GameUrlId: socket.data.gameId },
      order: ['orderOfPlaying'],
    })
    io.to(socket.data.gameId).emit(
      SERVER_SENT_EVENTS.GAME_START_PLAYERS_ORDERED,
      orderedPlayers
    )
  }

  const assignPuzzle = async ({
    assignedPuzzle,
    puzzleInfoPage,
  }: AssignPuzzleEventPayload) => {
    console.log('assignPuzzle')
    const players = await Player.findAll({
      where: { GameUrlId: socket.data.gameId },
      order: ['orderOfPlaying'],
    })
    const assigningPlayerIndex = players.findIndex(
      (player) => player.get().socketId === socket.id
    )
    const playerBeingAssigned =
      players[(assigningPlayerIndex + 1) % players.length].get()
    await Player.update(
      { assignedPuzzle, puzzleInfoPage },
      { where: { id: playerBeingAssigned.id } }
    )
    io.to(socket.data.gameId)
      .except(playerBeingAssigned.socketId)
      .emit(SERVER_SENT_EVENTS.PUZZLE_ASSIGNED, {
        socketId: playerBeingAssigned.socketId,
        assignedPuzzle,
        puzzleInfoPage,
      })
    io.to(playerBeingAssigned.socketId).emit(
      SERVER_SENT_EVENTS.PUZZLE_SELF_ASSIGNED
    )
  }

  const disconnect = async () => {
    /* TODO this behavior should be correct for 'lobby' game status. For other ones:
     *   - nothing should happen on 'finished' status
     *   - player should be marked as disconnected (which means their turns are skipped) on 'playing' status
     *   Then, a reconnection logic could be implemented */
    console.log('disconnect')
    await Player.destroy({ where: { socketId: socket.id } })
    Player.findAll({ where: { GameUrlId: socket.data.gameId || '' } }).then(
      (players) => {
        socket
          .to(socket.data.gameId)
          .emit(SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED, players)
      }
    )
  }

  socket.on(CLIENT_SENT_EVENTS.JOIN_GAME, joinGame)
  socket.on(CLIENT_SENT_EVENTS.SET_NAME, setName)
  socket.on(CLIENT_SENT_EVENTS.START_GAME, startGame)
  socket.on(
    CLIENT_SENT_EVENTS.GAME_START_GET_ORDERED_PLAYERS,
    getOrderedPlayers
  )
  socket.on(CLIENT_SENT_EVENTS.ASSIGN_PUZZLE, assignPuzzle)
  socket.on('disconnect', disconnect)
}
