import { Server, Socket } from 'socket.io'
import { findAllPlayersInGameByOrderOfPlaying } from '../repositories/player'
import { CLIENT_SENT_EVENTS, SERVER_SENT_EVENTS } from '../../client/src/events/socket-event-types'
import {
  AssignPuzzleEventPayload,
  SetNameEventPayload,
} from '../../client/src/types/event-payloads'
import { assignPuzzle, setName } from '../services/player'

export default (io: Server, socket: Socket) => {
  const setNameController = async ({ name }: SetNameEventPayload) => {
    const setNameResult = await setName(socket.id, name, socket.data.gameId)
    io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED, setNameResult.allPlayers)
  }

  const getOrderedPlayers = async (callback: any) => {
    const orderedPlayers = await findAllPlayersInGameByOrderOfPlaying(socket.data.gameId)
    callback(orderedPlayers)
  }

  const assignPuzzleController = async (puzzleData: AssignPuzzleEventPayload) => {
    const { playerBeingAssignedId } = await assignPuzzle(socket.data.gameId, socket.id, puzzleData)
    io.to(socket.data.gameId)
      .except(playerBeingAssignedId)
      .emit(SERVER_SENT_EVENTS.PUZZLE_ASSIGNED, {
        socketId: playerBeingAssignedId,
        ...puzzleData,
      })
    io.to(playerBeingAssignedId).emit(SERVER_SENT_EVENTS.PUZZLE_SELF_ASSIGNED)
  }

  socket.on(CLIENT_SENT_EVENTS.GAME_START_GET_ORDERED_PLAYERS, getOrderedPlayers)
  socket.on(CLIENT_SENT_EVENTS.SET_NAME, setNameController)
  socket.on(CLIENT_SENT_EVENTS.ASSIGN_PUZZLE, assignPuzzleController)
}
