import React, {FunctionComponent, useState} from "react";
import {CLIENT_SENT_EVENTS} from "../../../../events/socket-event-types";
import {useSocket} from "../../../../hooks/useSocket";

export const CurrentTurnForm: FunctionComponent = () => {
  const { socket } = useSocket()
  const [turnType, setTurnType] = useState('question')
  const [text, setText] = useState('')

  const handleTurnTaken = (e: React.FormEvent) => {
    e.preventDefault()
    socket.emit(CLIENT_SENT_EVENTS.TAKE_TURN, { turnType, text })
  }

  const handleTurnTypeChanged = (type: string) => () => setTurnType(type)

  return (
    <form onSubmit={handleTurnTaken}>
      <p>Your turn!</p>
      What are you gonna do?<br/>
      <input type="radio" checked={turnType === 'question'} onChange={handleTurnTypeChanged('question')} />Ask a specifying question<br/>
      <input type="radio" checked={turnType === 'answer'} onChange={handleTurnTypeChanged('answer')} />Make a guess<br/>
      <label>
        Your {turnType === 'question' ? 'question' : 'guess'}:<br/>
        {turnType === 'answer' && 'Am I '}
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        {turnType === 'answer' && '?'}
      </label>
      <button type="submit">Confirm</button>
    </form>
  )
}
