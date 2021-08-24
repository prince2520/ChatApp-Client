import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {helperActions} from "../store/helper-redux";
import {useDispatch} from "react-redux";

import './DropDown.css'
const DropDown = () => {
    const dispatch = useDispatch();
    return(
        <div className='dropdown'>
            <FontAwesomeIcon  icon={faCaretDown} size="2x" color="#ee4c74" onClick={()=>{dispatch(helperActions.showMenuHandler())}}/>
        </div>
    )
}

export default DropDown;
