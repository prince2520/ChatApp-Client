import './JoinGroup.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackspace} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useState} from "react";
import AuthContext from "../../store/auth-context";
import {useDispatch} from "react-redux";
import {groupActions} from "../../store/group";
import {joinGroupHandler} from "../../Helper/socket";

const serverUrl = process.env.SERVER;


const JoinGroup = (props) => {
    const [groupName, setGroupName] = useState('')
    const authctx = useContext(AuthContext);
    const dispatch = useDispatch();


    const JoinGroupHandler = (event) => {
        event.preventDefault();
        fetch(`${serverUrl}/group/joinGroup`,{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                Authorization: 'Bearer ' + authctx.token
            },
            body:JSON.stringify({
                groupName:groupName,
                userId:authctx.userId
            })
        }).then(res=>{
            return res.json()
        }).then(result=> {
            console.log(result.joinGroup)
            dispatch(groupActions.groups({
                _id:result.joinGroup._id,
                groupName:result.joinGroup.groupName,
                lastMessage:result.joinGroup.lastMessage,
                groupImageUrl:result.joinGroup.groupImageUrl
            }));
            joinGroupHandler(result.joinGroup._id)
            props.joinGroupSelected(false)

        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className='join_tab'>
            <div className="join_title" >
                <FontAwesomeIcon onClick={()=>props.joinGroupSelected(false)} icon={faBackspace} size="2x" color="#ee4c74"  />
                <h2>Join a Group</h2>
            </div>
            <div className="join_imageContainer">
                <img src="https://i.imgur.com/W5U9qZB.png" alt="join Group"/>
            </div>
            <form className='join_form' onSubmit={JoinGroupHandler}>
                <label htmlFor="joinGroup">Group Name</label>
                <input type="text" name='joinGroup' onChange={(event)=>setGroupName(event.target.value)}/>
                <button >Join</button>
            </form>
        </div>
    )
}

export default JoinGroup;
