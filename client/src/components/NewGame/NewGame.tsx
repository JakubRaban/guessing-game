import React, {FunctionComponent} from "react";
import {useNavigate} from "react-router-dom";
import {fetchJson} from "../../helpers/helpers";
import {Header} from "../lib/Header/Header";
import {useForm} from "react-hook-form";

import './NewGame.scss';

type FormData = {
  maxPlayers: number;
  isPublic: boolean;
}

const defaultValues: FormData = {
  maxPlayers: 4,
  isPublic: false,
}

export const NewGame: FunctionComponent = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ defaultValues });
  const navigate = useNavigate();

  const createGame = (data: FormData) => {
    return fetchJson('/api/games', {
      body: JSON.stringify(data),
      method: 'POST'
    })
      .then((res) => navigate(`/game/${res.urlId}`, { state: { game: res } }))
  }

  return (
    <div className="new-game-page">
      <Header>Create new game</Header>
      <form onSubmit={handleSubmit(createGame)}>
        <div>
          <label htmlFor="maxPlayers">Players limit</label>
          <input type="number" {...register('maxPlayers', { min: 2, max: 12 })} />
        </div>
        <div>
          <label htmlFor="isPublic">Make public</label>
          <input type="checkbox" {...register('isPublic')} />
        </div>
      </form>
      <br />
      <button onClick={handleSubmit(createGame)}>Create game</button>
      {isSubmitting && <p>Creating new game...</p>}
    </div>
  )
}
