import React, {FunctionComponent, useContext, useState} from "react";
import {PuzzledPlayer} from "../../../types/game";
import {getAssignmentsMap} from "../../../helpers";
import {useCurrentPlayer} from "../../../hooks/use-current-player";
import {SocketIOContext} from "../../../contexts/SocketIOContext";
import {CLIENT_SENT_EVENTS} from "../../../events/socket-event-types";

export const CharacterAssignment: FunctionComponent<{
  players: PuzzledPlayer[]
}> = ({ players }) => {
  const { socket } = useContext(SocketIOContext)
  const assignments = getAssignmentsMap(players)
  const currentPlayer = useCurrentPlayer(players)
  const playerBeingAssigned = assignments.get(currentPlayer)!
  const [assignedPuzzle, setAssignedPuzzle] = useState('')

  const handleCharacterAssigned = (e: React.FormEvent) => {
    e.preventDefault()
    socket.emit(CLIENT_SENT_EVENTS.ASSIGN_PUZZLE, { assignedPuzzle })
  }

  return (
    <>
      {!playerBeingAssigned.assignedPuzzle && (
        <form onSubmit={handleCharacterAssigned}>
          <label>
            Pick a character for {playerBeingAssigned.name}<br/>
            <input type="text" value={assignedPuzzle} onChange={(e) => setAssignedPuzzle(e.target.value)}/>
            <br/>
          </label>
          <button type="submit">Confirm</button>
        </form>
      )}
      <table>
        <tr>
          <th>Player</th>
          <th>Character</th>
        </tr>
        {Array.from(assignments).map(([assigningPlayer, playerBeingAssigned]) => (
          <tr>
            <td>{playerBeingAssigned.name}{playerBeingAssigned === currentPlayer ? ' (you)' : ''} (picked by {assigningPlayer.name})</td>
            <td>
              {!playerBeingAssigned.assignedPuzzle
                ? '(waiting)'
                : (playerBeingAssigned === currentPlayer
                  ? "??? (you're gonna guess this)"
                  : <a
                      href={playerBeingAssigned.puzzleInfoPage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {playerBeingAssigned.assignedPuzzle}
                    </a>
                )
              }
            </td>
          </tr>
        ))}
      </table>

    </>
  )
}
