import {PuzzledPlayer} from "./types/game";

export const fetchJson = (input: RequestInfo, init?: RequestInit | undefined): Promise<any> =>
  fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
    .then((res) => res.json())

export const getAssignmentsMap = (players: PuzzledPlayer[]): Map<PuzzledPlayer, PuzzledPlayer> => {
  const result = new Map<PuzzledPlayer, PuzzledPlayer>()
  players.forEach((player, index, players) =>
    result.set(player, players[(index + 1) % players.length]))
  return result
}
