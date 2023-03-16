import { FunctionComponent, useEffect } from 'react'
import { useTimer } from 'use-timer'
import {useTurn, useVotingPlayers} from "../../../../hooks/game-state";
import {YesNoVote} from "../../../../types/game";
import {voteToText} from "../VotingPanel/VotingPanel";
import {joinStringsWithCommasAndAnd} from "../../../../helpers/helpers";
import {useSocket} from "../../../../hooks/useSocket";
import { CLIENT_SENT_EVENTS, SERVER_SENT_EVENTS } from '../../../../events/socket-event-types'

export const VotingResult: FunctionComponent = () => {
  const { socket } = useSocket()
  const {
    activePlayer,
    turn: { type: turnType, votingResult }
  } = useTurn()
  const votingPlayers = useVotingPlayers()
  const { time: nextTurnTimer, start: startNextTurnTimer } = useTimer({ initialTime: 3, timerType: 'DECREMENTAL' })

  const playersVotingDiscussNames = votingPlayers
    .filter((player) => player.lastVote === 'discuss')
    .map((player) => player.name!)

  const handleAnswerSelected = (result: YesNoVote) => () => {
    socket.emit(CLIENT_SENT_EVENTS.DETERMINE_TENTATIVE_VOTE_RESULT, {
      votingResult: result
    })
  }

  useEffect(() => {
    const turnCompletedListener =  () => {
      startNextTurnTimer();
    }
    socket.on(SERVER_SENT_EVENTS.TURN_COMPLETED, turnCompletedListener)
    return () => {
      socket.off(SERVER_SENT_EVENTS.TURN_COMPLETED, turnCompletedListener)
    }
  }, [])

  if (!votingResult) return null;

  return votingResult === 'discuss' ? (
    <>
      <p>
        {playersVotingDiscussNames.length
          ? `${joinStringsWithCommasAndAnd(playersVotingDiscussNames)} think${playersVotingDiscussNames.length > 1 ? 's' : ''} that discussion is needed`
          : 'The vote is not unanimous'
        }
      </p>
      {activePlayer.isLocal ? (
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
    <>
      {activePlayer.hasGuessed && <p>{activePlayer.isLocal ? 'You' : activePlayer.name} guessed correctly!</p>}
      {activePlayer.hasFailedToGuess && <p>{activePlayer.isLocal ? 'Your' : `${activePlayer.name}'s`} guess was incorrect</p>}
      {turnType === 'question' && <p>Voting result: {voteToText[votingResult]}</p>}
      <p>Next turn in {nextTurnTimer}</p>
    </>
  )
}
