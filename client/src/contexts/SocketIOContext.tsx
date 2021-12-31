import React from "react";
import {Socket} from "socket.io-client";

export const SocketIOContext = React.createContext<{ socket: Socket }>(
  { socket: {} as Socket }
)
