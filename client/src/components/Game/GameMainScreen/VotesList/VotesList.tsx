import React, {FunctionComponent} from "react";
import { useVotes } from "../../../../hooks/game-state";
import { voteToText } from "../VotingPanel/VotingPanel";

export const VotesList: FunctionComponent = () => {
  const { votes } = useVotes()

  return (
    <>
      <p>Votes list</p>
      <ul>
        {votes.map(({ name, lastVote }) => (
          <li key={name}>{name}: {voteToText[lastVote ?? '']}</li>
        ))}
      </ul>
    </>
  )
}
