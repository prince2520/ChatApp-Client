import React, {Fragment, useContext, useEffect} from "react";
import {groupActions} from "../../store/group";
import {useDispatch, useSelector} from "react-redux";
import AuthContext from "../../store/auth-context";
import {privateUserActions} from "../../store/private-user";
import {joinGroupHandler} from "../../Helper/socket";

const serverUrl = process.env.SERVER;

const GroupList = () => {
    const dispatch = useDispatch();
    const authctx = useContext(AuthContext);


    const fetchGroup = useSelector((state)=> state.group.group);
    const highlightedGroupId = useSelector((state)=>state.group.highlightedGroupId);

    useEffect(() => {
        const fetchRoomNames = async () => {
            const result = await fetch(`${serverUrl}/group/fetchRoomNames?userId=${authctx.userId}`);
            return result.json();
        }
        fetchRoomNames().then(res => {
            res.roomInfo.map(data=>{
                joinGroupHandler(data._id);
                dispatch(groupActions.groups({
                    _id:data._id,
                    groupName:data.groupName,
                    lastMessage:data.lastMessage,
                    groupImageUrl:data.groupImageUrl
                }))
            })
        })

        return ()=>{
            dispatch(groupActions.groups({
                removeGroup:true
            }))
        }
    }, [authctx.userId])


    const selectedGroup = (groupData) => {
        dispatch(privateUserActions.highlightedPrivateUser({_id:''}))
        dispatch(privateUserActions.selectPrivateUser({}))
        dispatch(privateUserActions.isPrivateUserSelect(false));

        dispatch(groupActions.highlightedGroup({_id:groupData._id}))
        dispatch(groupActions.selectedGroupData(groupData));
        dispatch(groupActions.isGroupSelect(true));

    }

    return (
        <Fragment>
            {fetchGroup.map(groupDetail => <li key={groupDetail._id}
                                               className={highlightedGroupId === groupDetail._id?'highlighted':''}
                                               onClick={selectedGroup.bind(null, groupDetail)}>
                <div className='image_container' style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <img src={groupDetail.groupImageUrl} style={{
                        width:"80%",
                        height:'80%',
                        padding:'0.5px',
                        borderRadius:'50%',
                    }} alt='groupImage'/>
                </div>

                <h3>{groupDetail.groupName}</h3>
            </li>)}
        </Fragment>
    )
}

export default GroupList;
