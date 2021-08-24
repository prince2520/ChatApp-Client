import React, {useEffect, useState, useContext, useRef} from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faSmileWink} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../store/auth-context";
import { Picker } from 'emoji-mart'
const serverUrl = 'http://localhost:5000';
import {groupChatActions} from "../../store/group-message";
import 'emoji-mart/css/emoji-mart.css'
import './emote.css'
import {useDispatch, useSelector} from "react-redux";
import {getGroupMessage, sendGroupMessage} from "../../Helper/socket";
import NoMessage from "../ChatTab/NoMessage";
import LoaderSpinner from "../../Helper/LoaderSpinner";
import SideBarIcon from "../../Helper/SideBarIcon";

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];

const GroupChatList = () => {
    const selectedGroupData = useSelector((state)=>state.group.selectedGroup)
    let selectedGroupId =  selectedGroupData._id

    const roomName = selectedGroupData.groupName
    const authctx = useContext(AuthContext)
    const dispatch = useDispatch();
    const groupMessage = useSelector((state)=> state.groupChat.groupMessage)
    const showEmoji = useSelector((state)=> state.groupChat.showEmoji)
    const message = useSelector((state)=> state.groupChat.sendMessage)
    const messageEnd = useRef(null);
    const [noMessageFound,setNoMessageFound] = useState(false)
    const [loader,setLoader] = useState(false);


    const userName = authctx.userName;

    useEffect(() => {
        getGroupMessage((err,{userName, message,groupId})=>{
            setNoMessageFound(false)
            const group = JSON.parse(localStorage.getItem(groupId));
            localStorage.removeItem(groupId)
            group.push({message:message,user:{userName:userName}})
            localStorage.setItem(groupId,JSON.stringify(group));

            if(selectedGroupData._id === groupId){
                dispatch(groupChatActions.groupMessage({
                    prevStateDependent:true,
                    userName: userName,
                    message: message
                }));
            }
        })
    },[selectedGroupData._id, userName]);

    // scroll to bottom
    const scrollToBottom = () =>{
        messageEnd.current?.scrollIntoView({behavior:'smooth'})
    }

    useEffect(()=>{
        scrollToBottom()
    },[groupMessage,message]);


    useEffect(()=>{
        const fetchRoomMessages = async () => {
            setLoader(true)
            const res = await fetch(`${serverUrl}/group/fetchRoomMessages?roomName=${selectedGroupData.groupName}`,{
                headers: {
                    Authorization: 'Bearer ' + authctx.token
                }
            });
            setLoader(false)
            return res.json();
        }

        let roomInfo = JSON.parse(localStorage.getItem(`${selectedGroupData._id}`));

        const dispatchMessageHandler = (room) =>{
            let createdAt = new Date(room.createdAt);
            let month = months[createdAt.getMonth()];
            let year = createdAt.getFullYear();
            let date = createdAt.getDate()+ "-" + month + "-" + year;

            let time = createdAt.toTimeString().split(' ')[0];
            console.log(room.user.email)
            dispatch(groupChatActions.groupMessage({
                prevStateDependent:true,
                userName: room.user.userName,
                userEmail: room.user.email,
                message: room.message,
                date:date,
                time:time
            }))
        }

        //if messages is not stored in local storage then fetch message from database and display message, else display message from localstorage
        if(!roomInfo){
            fetchRoomMessages().then(res=>{
                console.log(res)
                if(res.roomInfo.messages.length===0){
                    setNoMessageFound(true)
                }else {
                    setNoMessageFound(false)
                }
                localStorage.setItem(`${selectedGroupData._id}`,JSON.stringify(res.roomInfo.messages))
                if(res.roomInfo.messages){
                    const roomInfo = res.roomInfo.messages;
                    for(const room of roomInfo){
                        dispatchMessageHandler(room)
                    }
                }
            });
        }else {
            if(roomInfo.length === 0){
                setNoMessageFound(true)
            }else {
                setNoMessageFound(false)
            }
            for(const room of roomInfo){
                dispatchMessageHandler(room)
            }
        }

        // CleanUp function to remove message from group messagebox
        return ()=>{
            dispatch(groupChatActions.groupMessage({
                prevStateDependent:false,
                userName: '',
                message:[]
            }));
        };

    },[selectedGroupId,selectedGroupData.groupName]);


    //Get group message from receiver and store it local storage.


    const sendMessage = async () => {
        // save send message in local storage
        const group = JSON.parse(localStorage.getItem(`${selectedGroupData._id}`));
        localStorage.removeItem(`${selectedGroupData._id}`)
        group.push({message:message,user:{userName:userName}})
        localStorage.setItem(`${selectedGroupData._id}`,JSON.stringify(group))
        sendGroupMessage(selectedGroupId,message,userName)

        //display send message
        dispatch(groupChatActions.groupMessage({
            prevStateDependent:true,
            userName: userName,
            message: message
        }))
        setNoMessageFound(false)

        // save group message in database
        const createMessage = async ()  => {
            return await fetch(`${serverUrl}/message/createMessage`,{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: 'Bearer ' + authctx.token
                },
                body:JSON.stringify({
                    message:  message,
                    roomName: roomName,
                    userName: authctx.userName
                })
            })
        }
        await createMessage();
    }


    const sendMessageHandler = async () => {
        dispatch(groupChatActions.sendMessageHandler({message: ''}))
        dispatch(groupChatActions.showEmojiHandler)
        await sendMessage();
    }

    return(
        <div className="box">
            <div className="friend_profile">
                <div className='sidebar__icon'>
                    <SideBarIcon/>
                </div>
                <div style={{display: 'flex',alignItems:'center',justifyContent:'center',width:'100%',height:'100%'}} className="friend_profile-img--container">
                    <img style={{borderRadius:'50%',width:'80%',height:'80%'}} src={`${selectedGroupData.groupImageUrl}`} alt=""/>
                </div>
                <div style={{padding:'1rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <h3 style={{fontFamily:'Nunito'}} >{selectedGroupData.groupName}</h3>
                </div>
            </div>
            {loader && <LoaderSpinner/>}
            {noMessageFound && !loader && <NoMessage/> }
            {!noMessageFound && !loader &&
            <ul className="lists">
                {groupMessage.map(msg=><li className={`${msg.userName!==authctx.userName? '': 'list_personal'}`}
                                           key={Math.random()}>
                        <p className='message'>{msg.message}</p>
                    {msg.userName!==authctx.userName &&<p style={{fontSize:'0.7rem',alignSelf:'center'}} > {msg.userName}</p> }

                </li>)}
                <div ref={messageEnd}/>
            </ul>}
            <input value={`${message}`} onChange={(event)=>dispatch(groupChatActions.sendMessageHandler({message: event.target.value}))} type="text" placeholder={`Type something...`} />
            <FontAwesomeIcon  onClick={sendMessageHandler} className="paper-plane" icon={faPaperPlane} size="lg" color="#ee4c74" />
            <FontAwesomeIcon onClick={()=> {
                dispatch(groupChatActions.showEmojiHandler())
            }} className="smile" icon={faSmileWink } size="lg" color="#ee4c74" />
            {showEmoji&&<div onClick={()=>dispatch(groupChatActions.showEmojiHandler())} className='overlay'/>}
            {showEmoji&& <Picker
                theme="light"
                style={{zIndex:'100',position:'absolute',bottom:'3.8rem',right:'0.5em',opacity:0.94,width:'18rem',}}
                color={'#ee4c74'}
                onClick={(emoji, event) => {
                    dispatch(groupChatActions.sendMessageHandler({message:message + emoji.native}))
                   }}/>}
        </div>
    )
};

export default GroupChatList;

