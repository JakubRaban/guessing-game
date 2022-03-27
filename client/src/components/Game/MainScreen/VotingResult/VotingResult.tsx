import {FunctionComponent} from "react";
import {useTurn, useVotingPlayers} from "../../../../hooks/game-state";
import {Vote, YesNoVote} from "../../../../types/game";
import {voteToText} from "../VotingPanel/VotingPanel";
import {joinStringsWithCommasAndAnd} from "../../../../helpers";
import {useSocket} from "../../../../hooks/useSocket";
import {CLIENT_SENT_EVENTS} from "../../../../events/socket-event-types";

export const VotingResult: FunctionComponent<{ result: Vote }> = ({ result }) => {
  const { socket } = useSocket()
  const { activePlayer, isLocalPlayerActive } = useTurn()
  const votingPlayers = useVotingPlayers()

  const playersVotingDiscussNames = votingPlayers
    .filter((player) => player.lastVote === 'discuss')
    .map((player) => player.name!)

  const handleAnswerSelected = (votingResult: YesNoVote) => () => {
    socket.emit(CLIENT_SENT_EVENTS.DETERMINE_TENTATIVE_VOTE_RESULT, {
      votingResult
    })
  }

  return result === 'discuss' ? (
    <>
      <p>
        {playersVotingDiscussNames.length
          ? `${joinStringsWithCommasAndAnd(playersVotingDiscussNames)} think${playersVotingDiscussNames.length > 1 ? 's' : ''} that discussion is needed`
          : 'The vote is not unanimous'
        }
      </p>
      {isLocalPlayerActive ? (
        <>
          <p>What do you want to do?</p>
          <button>Open chat to discuss</button><br />
          <button onClick={handleAnswerSelected('yes')}>Mark 'Yes' as an answer</button>
          <button onClick={handleAnswerSelected('no')}>Mark 'No' as an answer</button>
        </>
      ) : (
        <>
          <p>Awaiting final decision from {activePlayer.name}</p>
        </>
      )}
    </>
  ) : (
    <p>Voting result: {voteToText[result]}</p>
  )
}
