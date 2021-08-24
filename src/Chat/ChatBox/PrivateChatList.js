import React, {useEffect, useState, useContext, useRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faSmileWink, faVideo} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../store/auth-context";
import {Picker} from "emoji-mart";
import {useDispatch, useSelector} from "react-redux";
import {privateChatActions} from "../../store/private-user-message";
import {getPrivateMessage, sendPrivateMessage} from "../../Helper/socket";
import SideBarIcon from "../../Helper/SideBarIcon";
import LoaderSpinner from "../../Helper/LoaderSpinner";
import NoMessage from "../ChatTab/NoMessage";

const serverUrl = 'https://chatapp-serve.herokuapp.com';

let receiver = undefined;
let sender = undefined;

const PrivateChatList = () => {
    const [showEmoji, setShowEmoji] = useState(false)
    const authctx = useContext(AuthContext);
    const dispatch = useDispatch();
    const privateMessageEnd = useRef(null);
    const [noMessageFound,setNoMessageFound] = useState(false)
    const [loader,setLoader] = useState(false);



    const privateUserDetail = useSelector((state)=>state.privateUser.selectedPrivateUser)
    const privateMessages = useSelector((state)=>state.privateChat.privateMessage)
    const sendMessage = useSelector((state)=>state.privateChat.sendMessage)

    useEffect(() => {
        getPrivateMessage((err,{userName, message}) => {
            setNoMessageFound(false);
            const pvtMsg = JSON.parse(localStorage.getItem(`${privateUserDetail._id}`));
            localStorage.removeItem(`${privateUserDetail._id}`);
            pvtMsg.push({
                userName: userName,
                message: message
            });
            localStorage.setItem(`${privateUserDetail._id}`, JSON.stringify(pvtMsg))
            dispatch(privateChatActions.privateMessage({
                prevStateDependent:true,
                userName: userName,
                message: message
            }));
        })
    }, [privateUserDetail._id])

    useEffect(() => {
        sender = authctx.userName;
        receiver = privateUserDetail.privateUsername;
    }, [authctx.userName, privateUserDetail.privateUsername]);



    useEffect(() => {
        const fetchPrivateUserMessage = async () => {
            setLoader(true)

            const fetchMessage = await fetch(`${serverUrl}/private/fetchPrivateMessage?senderName=${authctx.userName}&receiverName=${privateUserDetail.privateUsername}`, {
                headers: {
                    Authorization: 'Bearer ' + authctx.token
                }
            })
            setLoader(false)
            return fetchMessage.json();
        }

        const localPrivateMessage = JSON.parse(localStorage.getItem(`${privateUserDetail._id}`))
        if (!localPrivateMessage) {
            fetchPrivateUserMessage().then(done => {
                let privateMessge = [];
                if(done.privateMessage.privateMessages.length===0){
                    setNoMessageFound(true)
                }else {
                    setNoMessageFound(false)
                }
                done.privateMessage.privateMessages.map(res => {
                    privateMessge.push({
                        userName: res.user.userName,
                        message: res.message
                    })
                    dispatch(privateChatActions.privateMessage({
                        prevStateDependent:true,
                        userName: res.user.userName,
                        message: res.message
                    }));
                });
                localStorage.setItem(`${privateUserDetail._id}`, JSON.stringify(privateMessge))

            });
        } else {
            if(localPrivateMessage.length === 0){
                setNoMessageFound(true)
            }else {
                setNoMessageFound(false)
            }
            localPrivateMessage.map(res => {
                dispatch(privateChatActions.privateMessage({
                    prevStateDependent:true,
                    userName: res.userName,
                    message: res.message
                }));
            });
        }
        return () => {
            console.log('CleaNupFunction Called')
            dispatch(privateChatActions.privateMessage({
                prevStateDependent:false,
                userName: '',
                message:[]
            }));
        }
    }, [authctx.userName, privateUserDetail.privateUsername,privateUserDetail._id])


    const sendMessageHandler = async () => {
        dispatch(privateChatActions.sendMessageHandler({message:''}))
        localStorage.removeItem(`${privateUserDetail._id}`)
        dispatch(privateChatActions.privateMessage({
            prevStateDependent:true,
            userName: authctx.userName,
            message: sendMessage
        }));
        const privateMsg = [...privateMessages];
        privateMsg.push({
            userName:authctx.userName,
            message:sendMessage
        })

        localStorage.setItem(`${privateUserDetail._id}`, JSON.stringify(privateMsg))

        sendPrivateMessage(sender,receiver,sendMessage);
        setNoMessageFound(false)


        fetch(`${serverUrl}/private/createPersonalMessage`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + authctx.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                senderName: sender,
                receiverName: receiver,
                message: sendMessage
            })
        })
    }

    const scrollToBottom = () =>{
        privateMessageEnd.current?.scrollIntoView({behavior:'smooth'})
    }

    useEffect(()=>{
        scrollToBottom()
    },[privateMessages])

    return (
        <div className="box">
            <div className="friend_profile">
                <div className='sidebar__icon'>
                    <SideBarIcon/>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%'
                }} className="friend_profile-img--container">
                    <img style={{borderRadius: '50%', width: '80%', height: '80%'}}
                         src={`${privateUserDetail.privateUserImageUrl}`} alt="private_photo" />
                </div>
                <div style={{padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3 style={{fontFamily: 'Nunito'}}>{privateUserDetail.privateUsername}</h3>
                </div>

            </div>
            {loader && <LoaderSpinner/>}
            {noMessageFound && !loader && <NoMessage/> }
            {!noMessageFound && !loader &&
            <ul className="lists">
                {privateMessages.map(msg => <li className={`${msg.userName !== authctx.userName ? '' : 'list_personal'}`}
                                         key={Math.random()}><p className="message">{msg.message}</p></li>)}
                <div ref={privateMessageEnd}/>
            </ul>}
            <input value={sendMessage} onChange={(event) =>dispatch(privateChatActions.sendMessageHandler({message:event.target.value}))} type="text"
                   placeholder={`Type something...`}/>
            <FontAwesomeIcon onClick={sendMessageHandler} className="paper-plane" icon={faPaperPlane} size="lg"
                             color="#ee4c74"/>
            <FontAwesomeIcon onClick={() => setShowEmoji(prevState => !prevState)} className="smile" icon={faSmileWink}
                             size="lg" color="#ee4c74"/>
            {showEmoji && <div onClick={() => setShowEmoji(false)} className='overlay'/>}
            {showEmoji && <Picker
                theme="light"
                style={{
                    position: 'absolute',
                    bottom: '3.8rem',
                    right: '0.5em',
                    opacity: 0.94,
                    width: '18rem',
                    zIndex: '15'
                }}
                color={'#ee4c74'}
                onClick={(emoji, event) => {
                    dispatch(privateChatActions.sendMessageHandler({message:sendMessage+emoji.native}))
                }}/>}
        </div>
    )

}

export default PrivateChatList;
