import { findGameById } from '../repositories/game'
import { createPlayer, getAllPlayersInGame } from '../repositories/player'

export const joinGame = async (gameId: string, socketId: string) => {
  const game = (await findGameById(gameId)) as any
  const { Players: players, GameOption: options } = game

  if (players.length === options.maxPlayers) {
    return { error: 'Player limit reached' }
  } else if (game.status !== 'lobby') {
    return { error: 'This game is already in progress or finished' }
  } else {
    const player = (await createPlayer(gameId, socketId)) as any
    const allPlayers = await getAllPlayersInGame(gameId)
    return { game, player, allPlayers }
  }
}
