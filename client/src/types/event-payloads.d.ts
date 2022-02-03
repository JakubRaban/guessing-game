import {TurnType} from "./game-state";
import {Vote} from "./game";

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

export interface TakeTurnEventPayload {
  turnType: TurnType
  text: string
}

export interface CastVoteEventPayload {
  vote: Vote
}
