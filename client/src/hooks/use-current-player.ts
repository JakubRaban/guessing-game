import {Player} from "../types/game";
import {useContext} from "react";
import {SocketIOContext} from "../contexts/SocketIOContext";

export const useCurrentPlayer = (players: Player[]): Player => {
  const { socket } = useContext(SocketIOContext)
  return players.find((player) => player.socketId === socket.id)!
}
