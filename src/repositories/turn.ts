import { TurnData, Vote } from '../../client/src/types/game'
import sequelize from '../models'

const { Turn, Vote, Player } = sequelize.models

export const createTurn = (playerId: string, turnData: TurnData) => {
  return Turn.create({ PlayerId: playerId, ...turnData })
}

export const findCurrentTurnInGame = (gameId: string) => {
  return Turn.findOne({
    include: [
      {
        model: Vote,
      },
      {
        model: Player,
        where: { GameUrlId: gameId },
      },
    ],
    where: {
      voteResult: null,
    },
  })
}

export const createVote = (vote: Vote, turnId: string, playerId: string) => {
  return Vote.create({ vote, TurnId: turnId, PlayerId: playerId })
}

export const updateVote = (voteId: number, vote: Vote) => {
  return Vote.update({ vote }, { where: { id: voteId } })
}
