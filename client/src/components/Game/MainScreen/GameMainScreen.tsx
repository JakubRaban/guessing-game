import React, {FunctionComponent} from "react";
import {InGamePlayersList} from "../Gameplay/IngamePlayersList/InGamePlayersList";
import {CurrentTurnForm} from "./CurrentTurnForm/CurrentTurnForm";
import {useTurn} from "../../../hooks/game-state";
import {VotingPanel} from "./VotingPanel/VotingPanel";
import {VotesList} from "./VotesList/VotesList";
import {VotingResult} from "./VotingResult/VotingResult";

import './MainScreen.scss'

export const GameMainScreen: FunctionComponent = () => {
  const {
    activePlayer,
    isLocalPlayerActive,
    isTurnTaken,
    turn: { type: turnType, text: turnText, votingResult }
  } = useTurn()

  const activePlayerYetToAct = isLocalPlayerActive && !isTurnTaken
  const activePlayerAwaitingVotes = isLocalPlayerActive && isTurnTaken
  const nonActivePlayerAwaitingAction = !isLocalPlayerActive && !isTurnTaken
  const nonActivePlayerVoting = !isLocalPlayerActive && isTurnTaken

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
        <p>Waiting for {activePlayer.name}'s move</p>
      )}
      {nonActivePlayerVoting && (
        <>
          <p>{activePlayer.name} {turnType === 'question' ? 'asks' : 'tries to guess'}:</p>
          <p>{turnType === 'answer' && 'Am I '}{turnText}</p>
          {!votingResult && <VotingPanel/>}
        </>
      )}
      {isTurnTaken && (
        <>
          <VotesList />
          {votingResult && <VotingResult result={votingResult} />}
        </>
      )}
    </>
  )
}
