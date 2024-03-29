import React, {FunctionComponent} from "react";
import {InGamePlayersList} from "../Gameplay/IngamePlayersList/InGamePlayersList";
import {CurrentTurnForm} from "./CurrentTurnForm/CurrentTurnForm";
import {useTurn} from "../../../hooks/game-state";
import {VotingPanel} from "./VotingPanel/VotingPanel";
import {VotesList} from "./VotesList/VotesList";
import {VotingResult} from "./VotingResult/VotingResult";

import './GameMainScreen.scss'

export const GameMainScreen: FunctionComponent = () => {
  const {
    activePlayer: {
      name: activePlayerName,
      isLocal: isLocalPlayerActive,
      hasGuessed: hasActivePlayerGuessed,
      hasGuessedImmediately: hasActivePlayerGuessedImmediately,
    },
    isTurnTaken,
    turn: { type: turnType, text: turnText, votingResult }
  } = useTurn()

  const activePlayerYetToAct = isLocalPlayerActive && !isTurnTaken
  const activePlayerAwaitingVotes = isLocalPlayerActive && isTurnTaken && !hasActivePlayerGuessed
  const nonActivePlayerAwaitingAction = !isLocalPlayerActive && !isTurnTaken
  const nonActivePlayerVoting = !isLocalPlayerActive && isTurnTaken && !hasActivePlayerGuessed

  return (
    <>
      <InGamePlayersList />
      {activePlayerYetToAct && (
        <CurrentTurnForm />
      )}
      {activePlayerAwaitingVotes && (
        <>
          {turnType === 'answer' ? 'You tried to guess' : 'You asked'}: {turnText}
        </>
      )}
      {nonActivePlayerAwaitingAction && (
        <p>Waiting for {activePlayerName}'s move</p>
      )}
      {nonActivePlayerVoting && (
        <>
          <p>{activePlayerName} {turnType === 'question' ? 'asks' : 'tries to guess'}:</p>
          <p>{turnType === 'answer' && 'Am I '}{turnText}</p>
          {!votingResult && <VotingPanel turnType={turnType!} />}
        </>
      )}
      {isTurnTaken && (
        <>
          {!hasActivePlayerGuessedImmediately && <VotesList/>}
          <VotingResult />
        </>
      )}
    </>
  )
}
