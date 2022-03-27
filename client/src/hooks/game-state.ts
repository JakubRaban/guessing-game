import {useContext} from "react";
import {GameStateContext} from "../contexts/GameStateContext";
import {useSocket} from "./useSocket";
import {PuzzledPlayer} from "../types/game";

const useGameState = () => useContext(GameStateContext)

export const usePlayers = () => {
  const { gameState: { players } } = useGameState()
  return players
}

export const useVotingPlayers = () => {
  const { activePlayer } = useTurn()
  const { gameState: { players } } = useGameState()
  return players.filter((player) => player !== activePlayer)
}

export const usePlayer = () => {
  const { socket } = useSocket()
  const players = usePlayers()
  return players.find(player => player.socketId === socket.id)!
}

export const useAssignments = () => {
  const players = usePlayers()
  const result = new Map<PuzzledPlayer, PuzzledPlayer>()
  players.forEach((player, index, players) =>
    result.set(player, players[(index + 1) % players.length]))
  return result
}

export const useTurn = () => {
  const { socket } = useSocket()
  const { gameState: { players, currentTurnPlayerIndex, currentTurnType, currentTurnText, votingResult } } = useGameState()
  return {
    activePlayer: players[currentTurnPlayerIndex],
    isLocalPlayerActive: players[currentTurnPlayerIndex].socketId === socket.id,
    isTurnTaken: !!currentTurnText,
    turn: {
      text: currentTurnText,
      type: currentTurnType,
      votes: players.map((player: PuzzledPlayer) => player.lastVote),
      votingResult: votingResult
    },
  }
}

export const useVotes = () => {
  const { gameState: { players, currentTurnPlayerIndex } } = useGameState()
  const votingPlayers = players.filter(player => player !== players[currentTurnPlayerIndex])
  return {
    votes: votingPlayers.map(({ name, lastVote }) => ({ name, lastVote })),
    allPlayersVoted: votingPlayers.every(player => !!player.lastVote)
  }
}
