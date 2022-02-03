import React, {FunctionComponent} from "react";
import {InGamePlayersList} from "../Gameplay/IngamePlayersList/InGamePlayersList";
import {CurrentTurnForm} from "./CurrentTurnForm/CurrentTurnForm";
import {useTurn} from "../../../hooks/game-state";
import {VotingPanel} from "../VotingPanel/VotingPanel";
import {VotesList} from "../VotesList/VotesList";

import './MainScreen.scss'

export const GameMainScreen: FunctionComponent = () => {
  const { activePlayer, isLocalPlayerActive, isTurnTaken, turn } = useTurn()

  const activePlayerYetToAct = isLocalPlayerActive && !isTurnTaken
  const activePlayerAwaitingVotes = isLocalPlayerActive && isTurnTaken
  const nonActivePlayerAwaitingAction = !isLocalPlayerActive && !isTurnTaken
  const nonActivePlayerVoting = !isLocalPlayerActive && isTurnTaken

  return (
    <>
      <InGamePlayersList  />
      {activePlayerYetToAct && (
        <CurrentTurnForm />
      )}
      {activePlayerAwaitingVotes && (
        <>
          {turn.type === 'answer' ? 'You tried to guess' : 'You asked'}: {turn.text}
          <VotesList />
        </>
      )}
      {nonActivePlayerAwaitingAction && (
        <p>Waiting for {activePlayer.name}'s move</p>
      )}
      {nonActivePlayerVoting && (
        <>
          <p>{activePlayer.name} {turn.type === 'question' ? 'asks' : 'tries to guess'}:</p>
          <p>{turn.type === 'answer' && 'Am I '}{turn.text}</p>
          <VotingPanel />
          <VotesList />
        </>
      )}
    </>
  )
}
