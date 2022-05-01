import { Server, Socket } from 'socket.io'
import {
  CastVoteEventPayload,
  DetermineTentativeVotingResultEvent,
  TakeTurnEventPayload,
} from '../../client/src/types/event-payloads'
import { castVote, determineTentativeVotingResult, takeTurn } from '../services/turn'
import { CLIENT_SENT_EVENTS, SERVER_SENT_EVENTS } from '../../client/src/events/socket-event-types'

interface CompleteTurnAndBeginNextArgs {
  io: Server
  gameId: string
  isGameFinished: boolean
}

const completeTurnAndBeginNext = ({ io, gameId, isGameFinished }: CompleteTurnAndBeginNextArgs) => {
  // TODO add to TURN_COMPLETED information whether game is finished
  io.to(gameId).emit(SERVER_SENT_EVENTS.TURN_COMPLETED, {})
  setTimeout(() => {
    if (isGameFinished) {
      io.to(gameId).emit(SERVER_SENT_EVENTS.GAME_COMPLETED, {})
    } else {
      io.to(gameId).emit(SERVER_SENT_EVENTS.NEW_TURN_STARTED, {})
    }
  }, 3000)
}

export default (io: Server, socket: Socket) => {
  const takeTurnController = async (turnData: TakeTurnEventPayload) => {
    const { guessed, standings, player, isGameFinished } = await takeTurn(socket.id, turnData)
    io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.TURN_TAKEN, {
      ...turnData,
      playerId: socket.id,
    })
    if (guessed) {
      io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.VOTING_COMPLETED, {
        votingResult: 'yes',
        immediate: true,
      })
      io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.PUZZLE_SOLVED, {
        standings,
        playerId: socket.id,
        puzzleData: {
          assignedPuzzle: player.assignedPuzzle,
          puzzleInfoPage: player.puzzleInfoPage,
        },
      })
      completeTurnAndBeginNext({ io, gameId: socket.data.gameId, isGameFinished })
    }
  }

  const castVoteController = async ({ vote }: CastVoteEventPayload) => {
    const { votingResult, hasPlayerWon, standings, player, isGameFinished } = await castVote(
      socket.data.gameId,
      socket.id,
      vote
    )
    io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.VOTE_CAST, {
      playerId: socket.id,
      vote,
    })
    if (votingResult) {
      io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.VOTING_COMPLETED, {
        votingResult,
      })
      if (hasPlayerWon) {
        io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.PUZZLE_SOLVED, {
          standings,
          playerId: player.socketId,
          puzzleData: {
            assignedPuzzle: player.assignedPuzzle,
            puzzleInfoPage: player.puzzleInfoPage,
          },
        })
      }
      if (votingResult !== 'discuss') {
        completeTurnAndBeginNext({ io, gameId: socket.data.gameId, isGameFinished })
      }
    }
  }

  const determineTentativeVotingResultController = async ({
    votingResult,
  }: DetermineTentativeVotingResultEvent) => {
    const { error } = await determineTentativeVotingResult(socket.data.gameId, votingResult)
    if (!error) {
      io.to(socket.data.gameId).emit(SERVER_SENT_EVENTS.TENTATIVE_VOTE_RESULT_DETERMINED, {
        votingResult,
      })
      completeTurnAndBeginNext({ io, gameId: socket.data.gameId, isGameFinished: false })
    }
  }

  socket.on(CLIENT_SENT_EVENTS.TAKE_TURN, takeTurnController)
  socket.on(CLIENT_SENT_EVENTS.CAST_VOTE, castVoteController)
  socket.on(
    CLIENT_SENT_EVENTS.DETERMINE_TENTATIVE_VOTE_RESULT,
    determineTentativeVotingResultController
  )
}
