import React, {FunctionComponent, useState} from "react";

export const PlayerNameForm: FunctionComponent<{ onConfirm: (name: string) => void }> = ({ onConfirm }) => {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(name)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Your name:<br/>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <br/>
        <button type="submit">Join game</button>
      </label>
    </form>
  )
}
