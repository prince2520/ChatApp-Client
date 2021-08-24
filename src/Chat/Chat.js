import React, {useContext, useEffect} from "react";

import ChatBox from "./ChatBox/ChatBox";
import ChatTab from "./ChatTab/ChatTab";

import AuthContext from "../store/auth-context";

import {disconnectSocket, initiateSocket} from "../Helper/socket";

import './Chat.css';

const Chat = () => {
    const authCtx = useContext(AuthContext);

    useEffect(()=>{
        initiateSocket(authCtx.userName)
        return ()=>{
            disconnectSocket()
        }
    },[])

    return(
        <div className="container">
            <ChatTab/>
            <ChatBox/>
        </div>
    )
}

export default Chat;
