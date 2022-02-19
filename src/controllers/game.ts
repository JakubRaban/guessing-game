import { Server, Socket } from 'socket.io'
import {
  CLIENT_SENT_EVENTS,
  SERVER_SENT_EVENTS,
} from '../../client/src/events/socket-event-types'
import sequelize from '../models'
import {
  AssignPuzzleEventPayload,
  CastVoteEventPayload,
  JoinLeaveGameEventPayload,
  SetNameEventPayload,
  TakeTurnEventPayload,
} from '../../client/src/types/event-payloads'
import { shuffleArray } from '../helpers'
import { joinGame } from '../services/game'

const { Game, Player, Vote, Turn } = sequelize.models

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

  const takeTurn = async ({ turnType, text }: TakeTurnEventPayload) => {
    console.log('take turn')
    const player = (
      await Player.findOne({ where: { socketId: socket.id } })
    )?.get()
    await Turn.create({ turnType, text, PlayerId: player.id })
    io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.TURN_TAKEN, {
      turnType,
      text,
    })
  }

  const castVote = async ({ vote }: CastVoteEventPayload) => {
    // Find the only turn in this game with no vote result
    const currentTurn = await Turn.findOne({
      include: [
        {
          model: Vote,
        },
        {
          model: Player,
          where: { GameUrlId: socket.data.gameId },
        },
      ],
      where: {
        voteResult: null,
      },
    })
    const votingPlayer = await Player.findOne({
      where: { socketId: socket.id },
    })
    // @ts-ignore
    const votingPlayersExistingVote = currentTurn.Votes.find(
      // @ts-ignore
      (vote) => vote.PlayerId === votingPlayer.id
    )
    if (votingPlayersExistingVote) {
      votingPlayersExistingVote.vote = vote
      votingPlayersExistingVote.save()
    } else {
      await Vote.create({
        vote,
        // @ts-ignore
        TurnId: currentTurn.id,
        // @ts-ignore
        PlayerId: votingPlayer.id,
      })
    }
    io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.VOTE_CAST, {
      // @ts-ignore
      playerId: votingPlayer.socketId,
      vote,
    })
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

  socket.on(CLIENT_SENT_EVENTS.JOIN_GAME, joinGameController)
  socket.on(CLIENT_SENT_EVENTS.SET_NAME, setName)
  socket.on(CLIENT_SENT_EVENTS.START_GAME, startGame)
  socket.on(
    CLIENT_SENT_EVENTS.GAME_START_GET_ORDERED_PLAYERS,
    getOrderedPlayers
  )
  socket.on(CLIENT_SENT_EVENTS.ASSIGN_PUZZLE, assignPuzzle)
  socket.on(CLIENT_SENT_EVENTS.TAKE_TURN, takeTurn)
  socket.on(CLIENT_SENT_EVENTS.CAST_VOTE, castVote)
  socket.on('disconnect', disconnect)
}
