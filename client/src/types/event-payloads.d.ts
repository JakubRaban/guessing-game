import {PuzzleData, TurnData, Vote, YesNoVote} from "./game";

export interface JoinLeaveGameEventPayload {
  gameId: string
}

export interface SetNameEventPayload {
  name: string
}

export type AssignPuzzleEventPayload = PuzzleData

export type TakeTurnEventPayload = TurnData

export interface CastVoteEventPayload {
  vote: Vote
}

export interface DetermineTentativeVotingResultEvent {
  votingResult: YesNoVote
}
