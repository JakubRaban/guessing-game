import sequelize from '../models'
import { PuzzleData } from '../../client/src/types/game'

const { Player, Game } = sequelize.models

export const createPlayer = (gameId: string, socketId: string) => {
  return Player.create({ socketId, GameUrlId: gameId })
}

export const findPlayerById = (socketId: string) => {
  return Player.findOne({ where: { socketId } })
}

export const findAllPlayersInGame = (gameId: string) => {
  return Player.findAll({ where: { GameUrlId: gameId } })
}

export const findAllPlayersInGameByOrderOfPlaying = (gameId: string) => {
  return Player.findAll({
    where: { GameUrlId: gameId },
    order: ['orderOfPlaying'],
  })
}

export const setStandingsForPlayer = async (socketId: string) => {
  const player = (await findPlayerById(socketId)) as any
  const game = (await Game.findOne({ where: { urlId: player.GameUrlId }, include: Player })) as any
  const currentMaxStandings: number = await Player.max('standings', {
    where: { GameUrlId: player.GameUrlId },
  })
  const standings = currentMaxStandings + 1
  player.standings = standings

  if (standings === game.Players.length) {
    game.status = 'finished'
  }
  await Promise.all([player.save(), game.save()])
  return standings
}

export const updatePlayerName = (socketId: string, name: string) => {
  return Player.update({ name }, { where: { socketId } })
}

export const updateOrderOfPlaying = (players: any[], newOrder: number[]) => {
  return Player.bulkCreate(
    players.map((player, index) => ({
      ...player.get(),
      orderOfPlaying: newOrder[index],
    })),
    { updateOnDuplicate: ['orderOfPlaying'] }
  )
}

export const updatePuzzle = (socketId: string, puzzleData: PuzzleData) => {
  return Player.update(puzzleData, { where: { id: socketId } })
}

export const deletePlayer = (socketId: string) => {
  return Player.destroy({ where: { socketId } })
}
