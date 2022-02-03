import {PuzzledPlayer} from "./types/game";
import React from "react";

export const fetchJson = (input: RequestInfo, init?: RequestInit | undefined): Promise<any> =>
  fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
    .then((res) => res.json())

export const getAssignedPuzzleWithLinkToInfoPage = (player: PuzzledPlayer) =>
  player.puzzleInfoPage
    ? <a href={player.puzzleInfoPage} target="_blank" rel="noopener noreferrer">{player.assignedPuzzle}</a>
    : <>{player.assignedPuzzle}</>
