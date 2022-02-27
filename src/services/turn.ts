import { findPlayerById } from '../repositories/player'
import {
  createTurn,
  createVote,
  findCurrentTurnInGame,
  updateVote,
} from '../repositories/turn'
import { TurnData, Vote } from '../../client/src/types/game'

export const takeTurn = async (playerId: string, turnData: TurnData) => {
  const player = (await findPlayerById(playerId)) as any
  await createTurn(player.id, turnData)
}

export const castVote = async (
  gameId: string,
  playerId: string,
  vote: Vote
) => {
  const currentTurnPromise = findCurrentTurnInGame(gameId)
  const votingPlayerPromise = findPlayerById(playerId)
  const [currentTurn, votingPlayer] = (await Promise.all([
    currentTurnPromise,
    votingPlayerPromise,
  ])) as [any, any]
  const votingPlayersExistingVote = (currentTurn as any).Votes.find(
    (vote: any) => vote.PlayerId === votingPlayer.id
  )
  if (votingPlayersExistingVote) {
    await updateVote(votingPlayersExistingVote.id, vote)
  } else {
    await createVote(vote, currentTurn.id, votingPlayer.id)
  }
}
