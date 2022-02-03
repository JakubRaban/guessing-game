import {useContext} from "react";
import {SocketIOContext} from "../contexts/SocketIOContext";

export const useSocket = () => useContext(SocketIOContext)
