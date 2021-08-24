import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {useDispatch} from "react-redux";
import {helperActions} from "../store/helper-redux";
const SideBarIcon = () => {
    const dispatch = useDispatch();

    return (
        <React.Fragment>
            <FontAwesomeIcon onClick={()=> {
                dispatch(helperActions.showSideBarHandler(true))
            }}  icon={faBars} size="2x" color="#ee4c74" />
        </React.Fragment>

    )

}

export default SideBarIcon;
