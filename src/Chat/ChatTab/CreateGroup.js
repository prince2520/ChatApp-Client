import './CreateGroup.css'
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackspace} from "@fortawesome/free-solid-svg-icons";
import Resizer from "react-image-file-resizer";

const CreateGroup = (props) => {
    const [groupName, setGroupName] = useState('');
    const [groupImage, setGroupImage] = useState('')
    const [preview, setPreview] = useState(null);

    const imageRef = React.useRef();

    useEffect(() => {
        if (groupImage) {
            const readImg = new FileReader();
            readImg.onloadend = () => {
                setPreview(readImg.result);
            }
            readImg.readAsDataURL(groupImage)
        } else {
            setPreview(null)
        }
    }, [groupImage])

    const submitHandler = (event) => {
        console.log(groupImage.type)
        event.preventDefault();
        props.joingroupHandler(groupName, groupImage)
    }

    return (
        <div className="create_tab">
            <div className="create_title">
                <FontAwesomeIcon onClick={() => props.setJoinSelected(false)} icon={faBackspace} size="2x"
                                 color="#ee4c74"/>
                <h2>Create a Group</h2>
            </div>
            <input accept='image/*' ref={imageRef} type="file" style={{display: "none"}} onChange={() => {
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
                                setGroupImage(uri)
                            },
                            "blob",
                            200,
                            200
                        );
                    } catch (err) {
                        console.log(err);
                    }
                } else {
                    setGroupImage(null)
                }
            }}/>

            <div style={{
                justifySelf: "center", alignSelf: "center", width: '10rem', height: '10rem', borderRadius: '50%'
            }}>
                <div className="groupImage-overlay" onClick={() => {
                    imageRef.current.click()
                }}/>
                <img style={{objectFit: 'cover', width: "100%", height: "100%"}} alt="groupImg"
                     src={preview || "https://i.imgur.com/nHlY97n.png"}/>
            </div>
            <form className="create_form" onSubmit={submitHandler}>
                <label htmlFor="name">Group Name</label>
                <input type="text" onChange={(event) => setGroupName(event.target.value)}/>
                {props.joinThisGroup && <p style={{color: "#ff6633"}}>Join {groupName} group!</p>}
                {props.alreadyJoinUser && <p style={{color: "#ff6633"}}>User Already Join this Group.</p>}
                <button type="submit">Join</button>
            </form>
        </div>
    )
}

export default CreateGroup;
