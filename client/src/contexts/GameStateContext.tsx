import React from "react";
import {initialGameState} from "../game-state";

export const GameStateContext = React.createContext({ gameState: initialGameState })
