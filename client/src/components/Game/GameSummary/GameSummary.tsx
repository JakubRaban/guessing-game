import React, {FunctionComponent, useEffect, useState} from "react";
import {useSocket} from "../../../hooks/useSocket";
import {CLIENT_SENT_EVENTS, SERVER_SENT_EVENTS} from "../../../events/socket-event-types";
import {renderGameSummary} from "./helpers";
import {useNavigate} from "react-router-dom";

import './GameSummary.scss';

export const GameSummary: FunctionComponent = () => {
  const [gameSummary, setGameSummary] = useState<any>(null)
  const { socket } = useSocket()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('get game summary')
    socket.on(SERVER_SENT_EVENTS.GAME_SUMMARY, ({ gameSummary }) => {
      setGameSummary(gameSummary);
    })

    socket.emit(CLIENT_SENT_EVENTS.GET_GAME_SUMMARY)
  }, [])

  useEffect(() => {
    if (gameSummary) {
      console.log('summary', gameSummary)
    }
  }, [gameSummary])

  return (
    <>
      <p>Game finished</p>
      {gameSummary ? (
        renderGameSummary(gameSummary)
      ) : (
        <p>Loading game summary...</p>
      )}
      <button onClick={() => navigate('/')}>Back to menu</button>
    </>
  )
}
