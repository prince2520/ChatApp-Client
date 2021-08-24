import React from "react";
import { useSelector} from "react-redux";

import './ChatBox.css';
import GroupChatList from "./GroupChatList";
import PrivateChatList from "./PrivateChatList";
import NotSelectChat from "./NotSelectChat";

const ChatBox = () =>{
    const isGroupSelected = useSelector((state)=> state.group.isGroupSelected)
    const isPrivateUserSelected = useSelector((state)=>state.privateUser.isPrivateUserSelected);

    return(
        <React.Fragment>
            {!isPrivateUserSelected  && !isGroupSelected && <NotSelectChat/>}
            {isGroupSelected && <GroupChatList />}
            {isPrivateUserSelected  && <PrivateChatList/>}
        </React.Fragment>
    )
}

export default ChatBox;
