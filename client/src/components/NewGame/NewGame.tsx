import React, {FunctionComponent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetchJson} from "../../helpers/helpers";

export const NewGame: FunctionComponent = () => {
  const [maxPlayers, setMaxPlayers] = useState(2)
  const [isCreatingNewGame, setIsCreatingNewGame] = useState(false)
  const navigate = useNavigate();

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingNewGame(true)
    fetchJson('/api/games', {
      body: JSON.stringify({ maxPlayers }),
      method: 'POST'
    })
      .then((res) => navigate(`/game/${res.urlId}`, { state: { game: res } }))
  }

  return (
    <>
      <h1>New game</h1>
      <form onSubmit={handleCreateGame}>
        <label>
          Players limit
          <br/>
          <input
            name="maxPlayers"
            type="number"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
            min="2"
            max="10"
          />
        </label>
        <br/>
        <button type="submit">Create new game</button>
      </form>
      {isCreatingNewGame && <p>Creating new game...</p>}
    </>
  )
}
