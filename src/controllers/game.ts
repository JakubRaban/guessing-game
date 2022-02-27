import { Server, Socket } from 'socket.io'
import {
  CLIENT_SENT_EVENTS,
  SERVER_SENT_EVENTS,
} from '../../client/src/events/socket-event-types'
import {
  AssignPuzzleEventPayload,
  CastVoteEventPayload,
  JoinLeaveGameEventPayload,
  SetNameEventPayload,
  TakeTurnEventPayload,
} from '../../client/src/types/event-payloads'
import { joinGame, startGame, assignPuzzle } from '../services/game'
import { castVote, takeTurn } from '../services/turn'
import { setName } from '../services/player'
import { findAllPlayersInGameByOrderOfPlaying } from '../repositories/player'
import { disconnect } from '../services/socket'

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

  const setNameController = async ({ name }: SetNameEventPayload) => {
    console.log('setName')
    const setNameResult = await setName(socket.id, name, socket.data.gameId)
    io.to(socket.data.gameId).emit(
      SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED,
      setNameResult.allPlayers
    )
  }

  const startGameController = async () => {
    // TODO make sure game status is 'lobby'
    console.log('startGame')
    await startGame(socket.data.gameId)
    io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.GAME_STARTED)
  }

  const getOrderedPlayers = async (callback: any) => {
    const orderedPlayers = await findAllPlayersInGameByOrderOfPlaying(
      socket.data.gameId
    )
    callback(orderedPlayers)
  }

  const assignPuzzleController = async (
    puzzleData: AssignPuzzleEventPayload
  ) => {
    console.log('assignPuzzle')
    const { playerBeingAssignedId } = await assignPuzzle(
      socket.data.gameId,
      socket.id,
      puzzleData
    )
    io.to(socket.data.gameId)
      .except(playerBeingAssignedId)
      .emit(SERVER_SENT_EVENTS.PUZZLE_ASSIGNED, {
        socketId: playerBeingAssignedId,
        ...puzzleData,
      })
    io.to(playerBeingAssignedId).emit(SERVER_SENT_EVENTS.PUZZLE_SELF_ASSIGNED)
  }

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

  const disconnectController = async () => {
    console.log('disconnect')
    const currentPlayersAfterDisconnect = await disconnect(
      socket.id,
      socket.data.gameId
    )
    socket
      .to(socket.data.gameId)
      .emit(
        SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED,
        currentPlayersAfterDisconnect
      )
  }

  socket.on(CLIENT_SENT_EVENTS.JOIN_GAME, joinGameController)
  socket.on(CLIENT_SENT_EVENTS.SET_NAME, setNameController)
  socket.on(CLIENT_SENT_EVENTS.START_GAME, startGameController)
  socket.on(
    CLIENT_SENT_EVENTS.GAME_START_GET_ORDERED_PLAYERS,
    getOrderedPlayers
  )
  socket.on(CLIENT_SENT_EVENTS.ASSIGN_PUZZLE, assignPuzzleController)
  socket.on(CLIENT_SENT_EVENTS.TAKE_TURN, takeTurnController)
  socket.on(CLIENT_SENT_EVENTS.CAST_VOTE, castVoteController)
  socket.on('disconnect', disconnectController)
}
