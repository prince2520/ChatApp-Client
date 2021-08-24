import './Profile.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackspace} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../../store/auth-context";
import Resizer from "react-image-file-resizer";
import {storage} from "../../Helper/firebase";
const serverUrl = process.env.SERVER;

const Profile = (props) => {
    const authCtx = useContext(AuthContext)
    const [authImage,setAuthImage]= useState(null);
    const [authStatus, setAuthStatus] = useState('');

    const [profileImage, setProfileImage] = useState(null)
    const imageRef = React.useRef();
    const [preview, setPreview] = useState(null);

    useEffect(()=>{
        if(profileImage){
            const readImg = new FileReader();
            readImg.onloadend = () => {
                setPreview(readImg.result);
            }
            readImg.readAsDataURL(profileImage)
        }else{
            setPreview(null)
        }
    },[profileImage])

    useEffect(()=>{
        const getProfile = async ()=>{
            const response =  await fetch(`${serverUrl}/user/fetchAuthUser?authUser=${authCtx.userId}`)
            return response.json()
        }
        getProfile().then(result=>{
            setAuthStatus(result.user.Status);
            setAuthImage(result.user.profileImageUrl)
        }).catch(error=>{
            console.log(error)
        })
    },[]);



    const saveProfileDetail = async () =>{
        let profileDetail;

        if(profileImage){
            let groupImageWithDate = new Date()+'-'+profileImage.name||null;

            let uploadImage = storage.ref(`images/${groupImageWithDate}`).put(profileImage);
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
                            fetch(`${serverUrl}/user/saveProfile`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + authCtx.token
                                },
                                body: JSON.stringify( {
                                    userId:authCtx.userId,
                                    status:authStatus,
                                    profileImageUrl:url
                                })
                            }).then(res=>res.json()).then(result=> {
                                authCtx.profileImageUrlHandler(result.profileImageUrl)
                                props.setProfileSelected(false);
                            })
                        })
                })
        } else {
            fetch(`${serverUrl}/group/saveProfile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authCtx.token
                },
                body: JSON.stringify( {
                    userId:authCtx.userId,
                    status:authStatus
                })
            }).then(res=>res.json()).then(result=> {
                authCtx.profileImageUrlHandler(result.profileImageUrl)
                props.setProfileSelected(false);
            })
        }


    }


    const submitHandler = async (event) =>{
        console.log(authStatus)
        event.preventDefault()
        await saveProfileDetail()
    }

    return (
        <div className="profile_tab">
            <div className="profile_title">
                <FontAwesomeIcon onClick={()=>props.setProfileSelected(false)} icon={faBackspace} size="2x" color="#ee4c74"  />
                <h1>Profile</h1>
            </div>
            <input accept='image/*' ref={imageRef} type="file" style={{display:"none"}} onChange={(event)=> {
                const file = event.target.files[0]
                if (file && file.type.substr(0, 5) === "image") {
                    try {
                        Resizer.imageFileResizer(
                            event.target.files[0],
                            300,
                            300,
                            "JPEG",
                            100,
                            0,
                            (uri) => {
                                setProfileImage(uri)
                            },
                            "blob",
                            200,
                            200
                        );
                    } catch (err) {
                        console.log(err);
                    }
                }else {
                    setProfileImage(null)
                }
            }}/>

            <div className='profile_imageContainer' >
                <div className="groupImage-overlay" onClick={()=>{imageRef.current.click()}}/>

                <img alt="profile" src={preview || authImage}  />
            </div>
            <form className="profile_form" onSubmit={submitHandler}>
                <label htmlFor="name">Your Name</label>
                <input disabled type="text" defaultValue={`${authCtx.userName||''}`} />
                <label htmlFor="status">About</label>
                <input type="text"  defaultValue={`${authStatus}`}  onChange={(event)=>setAuthStatus(event.target.value)} />
                <button>Save</button>
            </form>
        </div>
    )
}
export default Profile;
