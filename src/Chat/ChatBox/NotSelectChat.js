import './NotSelectChat.css'
import SideBarIcon from "../../Helper/SideBarIcon";

const NotSelectChat = () => {
    return (
        <div className="please_select_chat">
            <div className='sidebar__icon'>
                <SideBarIcon/>
            </div>
            <img src="https://i.imgur.com/MOS6l7X.png" alt="welcome_page"/>
                <h1>Welcome To ChatApp</h1>
                <p>Time to be Social, Go Social</p>
        </div>
    )
}

export default NotSelectChat;
