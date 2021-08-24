import React, {useContext, useState} from "react";
import './SignUp.css'
import {NavLink} from "react-router-dom";
import AuthContext from "../store/auth-context";

const SignUp = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const authctx  = useContext(AuthContext);


    const submitHandler = (event) => {
        event.preventDefault();
        authctx.signUpHandler(userName,email,password);
    }


    return (
        <form className="signUp-form" onSubmit={submitHandler}>
            <h1>Create an account</h1>
            <p>Sign Up to continue</p>
            <label htmlFor="userName">Username</label>
            <input type="text" onChange={(event) => setUserName(event.target.value)}/>
            <label htmlFor="email">Email</label>
            <input type="email" onChange={(event) => setEmail(event.target.value)} />
            <label htmlFor="password">Password</label>
            <input type="password" onChange={(event) => setPassword(event.target.value)}/>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" onChange={(event) => setConfirmPassword(event.target.value)}/>
            {authctx.isSignUpError && <p className="signUp-error">{authctx.signUpErrorMsg}</p>}
            <button type="submit">Sign Up</button>
            <div>
                <p>Already have an account?</p> <NavLink style={{textDecoration:'none'}} to='/login'>Login with an account</NavLink>
            </div>
        </form>
    )

}

export default SignUp;
