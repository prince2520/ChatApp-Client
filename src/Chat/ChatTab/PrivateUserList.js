import React, {Fragment, useContext, useEffect} from 'react'
import {groupActions} from "../../store/group";
import {privateUserActions} from "../../store/private-user";
import {useDispatch, useSelector} from "react-redux";
import AuthContext from "../../store/auth-context";

const serverUrl = process.env.SERVER;

const PrivateUserList = () => {
    const authctx = useContext(AuthContext);
    const dispatch = useDispatch();
    const privateUsers = useSelector(state=>state.privateUser.privateUsers);
    const highlightedPrivateUser = useSelector(state=>state.privateUser.highlightedPrivateUserId)

    useEffect(()=>{
        const fetchPrivateUser = async () => {
            const result =  await fetch(`${serverUrl}/private/fetchPrivateUser?userName=${authctx.userName}`,{
                headers:{
                    Authorization: 'Bearer ' + authctx.token
                }
            });
            return result.json().then(done=>{
                done.privateUser.map(users=>{
                    users.user.filter(filterUser=>filterUser.userName!==authctx.userName).map(privateDetail=> {
                        dispatch(privateUserActions.privateUser({
                            _id:users._id,
                            privateUserId:privateDetail._id,
                            privateUsername:privateDetail.userName,
                            lastMessage:users.lastMessage,
                            privateUserImageUrl:privateDetail.profileImageUrl
                        }))
                    });
                })
            })
        }
        fetchPrivateUser().then(res=>{
            console.log('Fetch Private User SuccessFully!!')
        })

        return ()=>{
            dispatch(privateUserActions.privateUser({
                removePrivateUser:true
            }))
        }

    },[authctx.userName])

    const selectedPrivateUser = (privateUser) => {
        dispatch(groupActions.highlightedGroup(''));
        dispatch(groupActions.selectedGroupData({}));
        dispatch(groupActions.isGroupSelect(false));

        dispatch(privateUserActions.highlightedPrivateUser({_id:privateUser._id}))
        dispatch(privateUserActions.selectPrivateUser(privateUser))
        dispatch(privateUserActions.isPrivateUserSelect(true));

    }


    return(
        <Fragment>
            {privateUsers.map(data => <li key={data._id}
                                          className={highlightedPrivateUser === data._id?'highlighted':''}
                                          onClick={selectedPrivateUser.bind(null,data)}
            ><div className='image_container' style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <img src={data.privateUserImageUrl} style={{
                    width:"80%",
                    height:'80%',
                    padding:'0.5px',
                    borderRadius:'50%',
                }} alt='groupImage'/>
            </div>
                <h3>{data.privateUsername}</h3>
            </li>)}
        </Fragment>
    )

}
export default PrivateUserList;
