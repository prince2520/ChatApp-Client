import React, {useContext, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSearch,faPlus} from '@fortawesome/free-solid-svg-icons'

import Profile from "./Profile";
import CreateGroup from "./CreateGroup";
import GroupList from "./GroupList";
import PrivateUserList from "./PrivateUserList";
import JoinGroup from "./JoinGroup";
import CloseTab from "../../Helper/CloseTab";
import DropDown from "../../Helper/DropDown";

import AuthContext from "../../store/auth-context";

import {joinGroupHandler} from "../../Helper/socket";
import  {storage} from "../../Helper/firebase";
import {groupActions} from "../../store/group";
import {helperActions} from "../../store/helper-redux";
import {privateUserActions} from "../../store/private-user";

import  './ChatTab.css';

const serverUrl = 'http://localhost:5000';

const ChatTab = () =>{
    const [search, setSearch] = useState();
    const [searchUser, setSearchUser] = useState(null);
    const [profileSelected ,setProfileSelected] = useState(false);
    const [createGroupSelected, setCreateGroupSelected] = useState(false);
    const [groupImageUrl, setGroupImageUrl] =useState(null);
    const [searchUserFound, setSearchUserFound] =useState(false);
    const [alreadyJoinUser,setAlreadyJoinUser] = useState(false);
    const [joinThisGroup, setJoinThisGroup] = useState(false);
    const [joinGroupSelected, setJoinGroupSelected]  = useState(false)

    const authCtx = useContext(AuthContext);
    const dispatch = useDispatch();


    const showSideBar = useSelector(state=>state.helper.showSideBar);
    const showMenu = useSelector(state=>state.helper.showMenu)

    const searchUserHandler = (event) => {
        event.preventDefault();
        fetch(`${serverUrl}/user/fetchUser?email=${search}`,{
            headers:{
                Authorization: 'Bearer ' + authCtx.token
            }
        }).then(res => {
            return res.json();
        }).then(result => {
            if(result.userFound){
                setSearchUser(result);
                setSearchUserFound(result.userFound)
            }
        })
    }


    const addUserInPrivateChat = async () => {
        const response  = await fetch(`${serverUrl}/group/addPrivateChat`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authCtx.token
            },
            body: JSON.stringify({
                senderName: authCtx.userName,
                receiverName: searchUser.user.userName,
                token: authCtx.token,
                userName: authCtx.userName
            })
        })/*.then(res=>res.json()).then(done=>{
            console.log(done)

        })*/
        const done = await response.json();
        dispatch(privateUserActions.privateUser({
            _id:done.receiverUser._id,
            privateUserId:done.receiverUser._id,
            privateUsername:done.receiverUser.userName,
            lastMessage:done.receiverUser.lastMessage,
            privateUserImageUrl:done.receiverUser.profileImageUrl
        }));

    }


    const createGroupHandler = async (groupName,groupImage) => {
        if(groupImage){
            console.log(groupImage)
            let groupImageWithDate = new Date()+'-'+groupImage.name||null;
            let uploadImage = storage.ref(`images/${groupImageWithDate}`).put(groupImage);
            uploadImage.on(
                "state_changed",
                snapshot => {},
                error => {
                    console.log(error)
                },
                ()=>{
                    storage
                        .ref("images")
                        .child(groupImageWithDate)
                        .getDownloadURL()
                        .then(url=>{
                            setGroupImageUrl(url)
                            fetch(`${serverUrl}/group/createRoom`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + authCtx.token
                                },
                                body: JSON.stringify({
                                    groupName: groupName,
                                    token: authCtx.token,
                                    userName: authCtx.userName,
                                    userId: authCtx.userId,
                                    groupImageUrl:url
                                })
                            }).then(res=>{
                                return res.json();
                            }).then(result=>{
                                if(result.createGroup){
                                    console.log(result.createGroup)
                                    dispatch(groupActions.groups({
                                        _id:result.createGroup._id,
                                        groupName:result.createGroup.groupName,
                                        lastMessage:result.createGroup.lastMessage,
                                        groupImageUrl:result.createGroup.groupImageUrl
                                    }));
                                    joinGroupHandler(result.createGroup._id)
                                    setCreateGroupSelected(false)
                                }
                                if(result.joinGroup){
                                    setAlreadyJoinUser(false);
                                    setJoinThisGroup(true)
                                }
                                if(result.userAlreadyJoinGroup){
                                    setJoinThisGroup(false)
                                    setAlreadyJoinUser(true);
                                }

                                if(!result.joinGroup && !result.userAlreadyJoinGroup){
                                    setJoinThisGroup(false)
                                    setAlreadyJoinUser(false)
                                    setCreateGroupSelected(false)
                                }
                            }).catch(err=>{
                                console.log(err)
                            });
                        })
                }
            )
        }else {
            console.log(groupImage)
            fetch(`${serverUrl}/group/createRoom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authCtx.token
                },
                body: JSON.stringify({
                    groupName: groupName,
                    token: authCtx.token,
                    userName: authCtx.userName,
                    userId: authCtx.userId,
                })
            }).then(res=>{
                return res.json();
            }).then(result=>{
                if(result.createGroup){
                    console.log(result.createGroup)
                    dispatch(groupActions.groups({
                        _id:result.createGroup._id,
                        groupName:result.createGroup.groupName,
                        lastMessage:result.createGroup.lastMessage,
                        groupImageUrl:result.createGroup.groupImageUrl
                    }));
                    joinGroupHandler(result.createGroup._id)
                    setCreateGroupSelected(false)
                }
                if(result.joinGroup){
                    setAlreadyJoinUser(false);
                    setJoinThisGroup(true)
                }
                if(result.userAlreadyJoinGroup){
                    setJoinThisGroup(false)
                    setAlreadyJoinUser(true);
                }

                if(!result.joinGroup && !result.userAlreadyJoinGroup){
                    setJoinThisGroup(false)
                    setAlreadyJoinUser(false)
                    setCreateGroupSelected(false)
                }
            }).catch(err=>{
                console.log(err)
            });
        }
    }


    return(
        <React.Fragment>
            {showSideBar &&<div className='Tab__overlay' onClick={()=>dispatch(helperActions.showSideBarHandler(false))}/>}
            <div className={"Tab " + (showSideBar?'Tab__show':'')} >
                {showMenu&&<div onClick={()=>dispatch(helperActions.showMenuHandler(false))} className="overlay"/>}
                <div className="user_menu">
                    <div className='image_container'>
                        <img src={authCtx.profileImageUrl} alt="profileImage"/>
                    </div>
                    <DropDown/>
                    <CloseTab/>
                    {showMenu && <div className="menu">
                        <p onClick={()=> {
                            setCreateGroupSelected(true);
                            dispatch(helperActions.showMenuHandler(false))
                        }}>Create a Group</p>
                        <p onClick={()=>{
                        setJoinGroupSelected(true)
                            dispatch(helperActions.showMenuHandler(false))}
                        }>Join a Group</p>
                        <p onClick={()=> {
                            setProfileSelected(true);
                            dispatch(helperActions.showMenuHandler(false));
                        }}>Profile</p>
                        <p className="logout_highlight" onClick={()=>authCtx.logoutHandler()}>Logout</p>
                    </div>}
                </div>
                <input onChange={(event)=>setSearch(event.target.value)}  type="text" placeholder="Search"/>
                {searchUserFound && <div className='overlay' onClick={()=>setSearchUserFound(false)}/>}
                {searchUserFound && <div className="search_user-box" style={{zIndex:'10'}} >
                    <div className="img-container" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <img alt="group_img" style={{width:'80%',height:'80%',borderRadius:'50%'}} src={`${searchUser.user.profileImageUrl}`} />
                    </div>
                    <h2>{searchUser.user.userName}</h2>
                    <p style={{justifySelf:'center',fontSize:'0.8rem',width:'80%'}}>{searchUser.user.Status}</p>
                    <FontAwesomeIcon onClick={addUserInPrivateChat}  className="plus" icon={faPlus} size="2x" color="#ee4c74" />
                </div>}
                <FontAwesomeIcon onClick={searchUserHandler} className="search" icon={faSearch} size="1x" color="#ee4c74" />
                {
                    <ul className="lists_items">
                        <PrivateUserList/>
                        <GroupList/>
                    </ul>}
                {profileSelected && <Profile setProfileSelected={setProfileSelected}/>}
                {createGroupSelected && <CreateGroup joinThisGroup={joinThisGroup} alreadyJoinUser={alreadyJoinUser} groupImageUrl={groupImageUrl} joingroupHandler={createGroupHandler} setJoinSelected={setCreateGroupSelected}/>}
                {joinGroupSelected && <JoinGroup joinGroupSelected={setJoinGroupSelected}/>}
            </div>
        </React.Fragment>
    )
};

export default ChatTab;
