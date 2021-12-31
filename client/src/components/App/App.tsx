import React, {FunctionComponent} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {LandingPage} from "../LandingPage/LandingPage";
import {NewGame} from "../NewGame/NewGame";
import {GameEntrypoint} from "../GameEntrypoint/GameEntrypoint";
import {SocketIOContext} from "../../contexts/SocketIOContext";
import {io} from "socket.io-client";

export const App: FunctionComponent = () => (
  <SocketIOContext.Provider value={{ socket: io('http://localhost:9000',
      { autoConnect: false, closeOnBeforeunload: true })
  }}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/new-game" element={<NewGame/>}/>
        <Route path="/game/:gameId" element={<GameEntrypoint/>}/>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </BrowserRouter>
  </SocketIOContext.Provider>
)
