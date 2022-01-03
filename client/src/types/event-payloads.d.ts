export interface JoinLeaveGameEventPayload {
  gameId: string
}

export interface SetNameEventPayload {
  name: string
}

export interface AssignPuzzleEventPayload {
  assignedPuzzle: string
  puzzleInfoPage: string
}
