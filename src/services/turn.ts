import { findAllPlayersInGame, findPlayerById, setStandingsForPlayer } from '../repositories/player'
import {
  createTurn,
  createVote,
  findCurrentTurnInGame,
  getAllVotesInTurn,
  updateVote,
  updateVotingResult,
} from '../repositories/turn'
import { TurnData, Vote, VotesCount, YesNoVote } from '../../client/src/types/game'

export const takeTurn = async (playerId: string, turnData: TurnData) => {
  let standings
  const player = (await findPlayerById(playerId)) as any
  const allPlayers = (await findAllPlayersInGame(player.GameUrlId)) as any
  const turn = (await createTurn(player.id, turnData)) as any
  const puzzleGuessed =
    turnData.turnType === 'answer' &&
    turnData.text.toLocaleLowerCase() === player.assignedPuzzle.toLocaleLowerCase()
  if (puzzleGuessed) {
    standings = await setStandingsForPlayer(player.socketId)
    turn.votingResult = 'yes'
    turn.save()
  }
  return {
    guessed: puzzleGuessed,
    player,
    standings,
    isGameFinished: standings === allPlayers.length,
  }
}

export const castVote = async (gameId: string, playerId: string, vote: Vote) => {
  const currentTurnPromise = findCurrentTurnInGame(gameId)
  const votingPlayerPromise = findPlayerById(playerId)
  const allPlayersInGamePromise = findAllPlayersInGame(gameId)
  const [currentTurn, votingPlayer, allPlayersInGame] = (await Promise.all([
    currentTurnPromise,
    votingPlayerPromise,
    allPlayersInGamePromise,
  ])) as [any, any, any[]]

  let standings
  const { voteCreated } = await createOrUpdateVote(currentTurn, votingPlayer, vote)
  const votingCompleted = currentTurn.Votes.length + voteCreated === allPlayersInGame.length - 1
  if (votingCompleted) {
    const votingResult = await (currentTurn.turnType === 'question'
      ? getVotingResultOnQuestion(currentTurn)
      : getVotingResultOnAnswer(currentTurn))
    await updateVotingResult(currentTurn.id, votingResult)
    const hasPlayerWon = currentTurn.turnType === 'answer' && votingResult === 'yes'
    if (hasPlayerWon) {
      standings = await setStandingsForPlayer(currentTurn.Player.socketId)
    }
    // TODO check if player standings equals number of players. Mark game as finished if so
    return {
      votingResult,
      hasPlayerWon,
      standings,
      isGameFinished: standings === allPlayersInGame.length,
      player: currentTurn.Player,
    }
  }
  return {}
}

const createOrUpdateVote = async (currentTurn: any, votingPlayer: any, vote: Vote) => {
  const votingPlayersExistingVote = currentTurn.Votes.find(
    (vote: any) => vote.PlayerId === votingPlayer.id
  )
  if (votingPlayersExistingVote) {
    await updateVote(votingPlayersExistingVote.id, vote)
    return { voteCreated: false }
  } else {
    await createVote(vote, currentTurn.id, votingPlayer.id)
    return { voteCreated: true }
  }
}

const getVotingResultOnQuestion = async (currentTurn: any): Promise<Vote> => {
  const allVotes = await getAllVotesInTurn(currentTurn.id)
  const { yes, no, discuss } = getVotesCount(allVotes)
  if (discuss > 0 || (yes > 0 && no > 0)) return 'discuss' // somebody voted 'discuss' or vote wasn't unanimous
  if (yes === 0 && no === 0) return '?' // everybody voted '?'
  return yes > no ? 'yes' : 'no' // unanimous vote
}

const getVotingResultOnAnswer = async (currentTurn: any): Promise<Vote> => {
  const allVotes = await getAllVotesInTurn(currentTurn.id)
  const { yes, no } = getVotesCount(allVotes)
  return yes > no ? 'yes' : 'no'
}

const getVotesCount = (votes: any[]): VotesCount =>
  Object.fromEntries(
    ['yes', 'no', '?', 'discuss'].map((voteName) => [
      voteName,
      votes.filter((vote) => vote.vote === voteName).length,
    ])
  ) as VotesCount

export const determineTentativeVotingResult = async (gameId: string, vote: YesNoVote) => {
  const currentTurn = (await findCurrentTurnInGame(gameId)) as any
  // if (!['?', 'discuss'].includes(currentTurn.votingResult)) {
  //   return { error: true }
  // }
  await updateVotingResult(currentTurn.id, vote)
  return { error: false }
}
