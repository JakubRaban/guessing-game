import {Player, PuzzleData} from "../../../types/game";

export const renderGameSummary = (gameSummary: any) => {
  const players = gameSummary.Players
  const playersListsOfTurns = players.map((player: any) => player.Turns)
  const maxNumberOfTurns = Math.max(...playersListsOfTurns.map((turns: any) => turns.length))

  return (
    <table className="summary-table">
      <thead>
        <tr>
          <th>Turn</th>
          {players.map((player: Player & PuzzleData) => (
            <th key={player.id}>{player.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(maxNumberOfTurns).keys()].map((index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            {playersListsOfTurns.map((listOfTurns: any) => {
              if (!listOfTurns[index]) return <td />;
              const { turnType, text, votingResult } = listOfTurns[index]
              return (
                <td>{turnType === 'answer' ? 'Answer: ' : ''}{text} - {votingResult}</td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
