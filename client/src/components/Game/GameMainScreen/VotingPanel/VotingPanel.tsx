import React, {FunctionComponent} from "react";
import { useSocket } from "../../../../hooks/useSocket";
import { CLIENT_SENT_EVENTS } from "../../../../events/socket-event-types";
import {TurnType} from "../../../../types/game-state";

export const voteToText = {
  yes: 'Yes',
  no: 'No',
  '?': "Don't know",
  discuss: 'Needs discussion',
  '': '(waiting)'
}

type Vote = keyof typeof voteToText

export const VotingPanel: FunctionComponent<{ turnType: TurnType }> = ({ turnType}) => {
  const { socket } = useSocket()

  const handleVote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    socket.emit(CLIENT_SENT_EVENTS.CAST_VOTE, { vote: e.currentTarget.value })
  }

  const getAvailableVotes = (): Vote[] =>
    turnType === 'question' ? (Object.keys(voteToText) as Vote[]).filter(value => !!value) : ['yes', 'no'] as Vote[]

  return (
    <form>
      {getAvailableVotes().map((vote) => (
        <button key={vote} type="button" value={vote} onClick={handleVote}>{voteToText[vote]}</button>
      ))}
    </form>
  )
}
