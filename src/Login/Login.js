import React,  {useState,useContext} from "react";
import  './Login.css'
import {NavLink} from "react-router-dom";
import AuthContext from "../store/auth-context";

const Login = () => {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const authCtx = useContext(AuthContext);

    const submitHandler = (event) => {
        event.preventDefault();
        authCtx.loginHandler(email,password);
    }

    return (
        <form className="login-form" onSubmit={submitHandler}>
            <h1>Welcome Back</h1>
            <p>Login to continue</p>
            <label htmlFor="email">Email</label>
            <input type="email" onChange={(event)=>setEmail(event.target.value)}/>
            <label htmlFor="password">Password</label>
            <input type="password" onChange={(event)=>setPassword(event.target.value)}/>
            {authCtx.isLoggingError && <p className='logging-error'>{authCtx.loggingErrorMsg}</p>}
            <button type="submit">Login</button>
            <div>
                <p>Don't have an account ?</p> <NavLink style={{textDecoration:'none'}} to="/signup">Create an account.</NavLink>
            </div>
        </form>
    )
}

export default Login;
