import './App.css';

import React,{useContext} from "react";
import {Route , Switch ,Redirect} from 'react-router-dom'
import Login from "./Login/Login";
import SignUp from "./SignUp/SignUp";
import Chat from "./Chat/Chat";
import AuthContext from "./store/auth-context";


function App() {
    const authctx = useContext(AuthContext)
    let authRoutes;
    if(!authctx.isAuth){
        authRoutes = (
            <Switch>
                <Route path='/login'>
                    <Login />
                </Route>
                <Route path='/signup'>
                    <SignUp/>
                </Route>
                <Route path='/'>
                    <Redirect to='/login' />
                </Route>
            </Switch>
        )
    }else {
        authRoutes = (
            <Switch>
                <Route path='/chat' >
                    <Chat/>
                </Route>
                <Route path='/' >
                    <Redirect to='/chat'/>
                </Route>
            </Switch>
        )
    }
    return (
        <div className='App'>
            {authRoutes}
        </div>
    );
}

export default App;
