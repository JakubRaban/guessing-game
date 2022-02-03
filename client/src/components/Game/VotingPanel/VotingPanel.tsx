import React, {FunctionComponent} from "react";
import {useSocket} from "../../../hooks/useSocket";
import {CLIENT_SENT_EVENTS} from "../../../events/socket-event-types";

export const voteToText = {
  yes: 'Yes',
  no: 'No',
  '?': "Don't know",
  discuss: 'Needs discussion',
  '': '(waiting)'
}

export const VotingPanel: FunctionComponent = () => {
  const { socket } = useSocket()

  const handleVote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    socket.emit(CLIENT_SENT_EVENTS.CAST_VOTE, { vote: e.currentTarget.value })
  }

  return (
    <form>
      {Object.entries(voteToText).filter(([value]) => !!value).map(([value, text]) => (
        <button key={value} type="button" value={value} onClick={handleVote}>{text}</button>
      ))}
    </form>
    // <ul>
    // {players.map((player) => (
    // <li key={player.id}>{player.name} - {voteToText[player.lastVote || '']}</li>
    // ))}
    // </ul>
  )
}
