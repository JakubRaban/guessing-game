import React, {FunctionComponent, useState} from "react";
import {getAssignedPuzzleWithLinkToInfoPage} from "../../../helpers/helpers";
import {CLIENT_SENT_EVENTS} from "../../../events/socket-event-types";
import {useSocket} from "../../../hooks/useSocket";
import {useAssignments, usePlayer} from "../../../hooks/game-state";

export const CharacterAssignment: FunctionComponent = () => {
  const { socket } = useSocket()
  const assignments = useAssignments()
  const currentPlayer = usePlayer()
  const playerBeingAssigned = assignments.get(currentPlayer)!
  const [assignedPuzzle, setAssignedPuzzle] = useState('')
  const [puzzleInfoPage, setPuzzleInfoPage] = useState('')

  const handleCharacterAssigned = (e: React.FormEvent) => {
    e.preventDefault()
    socket.emit(CLIENT_SENT_EVENTS.ASSIGN_PUZZLE, {
      assignedPuzzle,
      puzzleInfoPage: puzzleInfoPage || null
    })
  }

  return (
    <>
      {!playerBeingAssigned.assignedPuzzle && (
        <form onSubmit={handleCharacterAssigned}>
          <label>
            Pick a character for {playerBeingAssigned.name}. Make sure they know who it is!<br/>
            <input type="text" value={assignedPuzzle} onChange={(e) => setAssignedPuzzle(e.target.value)}/>
          </label>
          <br/>
          <label>
            Optionally, you can provide an info website (e.g. Wikipedia article) so others also know more<br/>
            <input type="url" value={puzzleInfoPage} onChange={(e) => setPuzzleInfoPage(e.target.value)} />
          </label>
          <br/>
          <button type="submit">Confirm</button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Character</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(assignments).map(([assigningPlayer, playerBeingAssigned]) => (
            <tr key={assigningPlayer.socketId}>
              <td>{playerBeingAssigned.name}{playerBeingAssigned === currentPlayer ? ' (you)' : ''} (picked by {assigningPlayer.name})</td>
              <td>
                {!playerBeingAssigned.assignedPuzzle
                  ? '(waiting)'
                  : (playerBeingAssigned === currentPlayer
                      ? "??? (you're gonna guess this)"
                      : getAssignedPuzzleWithLinkToInfoPage(playerBeingAssigned)
                  )
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
