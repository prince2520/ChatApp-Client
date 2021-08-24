import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {useDispatch} from "react-redux";
import './CloseTab.css'
import {helperActions} from "../store/helper-redux";

const CloseTab = () =>{
    const dispatch = useDispatch();

    return(
        <div className='close__tab'>
            <FontAwesomeIcon  icon={faTimes} size="2x" color="#ee4c74" onClick={()=>dispatch(helperActions.showSideBarHandler(false))
            }/>
        </div>
    )
}

export default CloseTab;
