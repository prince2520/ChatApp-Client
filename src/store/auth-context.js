import React,{useState,useEffect} from "react";
import {useHistory} from "react-router-dom";

const serverUrl = 'https://chatapp-serve.herokuapp.com';


const AuthContext = React.createContext({
    loginHandler:(email,password)=>{},
    signUpHandler:(userName,email,password)=>{},
    logoutHandler:()=>{},
    token: '',
    userId:'',
    isAuth:false,
    userName:'',
    userEmail:'',
    profileImageUrl:'',
    loggingErrorMsg:'',
    profileImageUrlHandler:(profileImageUrl)=>{},
    isLoggingError:false,
    isSignUpError:false,
    signUpErrorMsg:''
});

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState('');
    const [isAuth, setIsAuth] = useState(false);
    const [userName, setUserName] = useState('');
    const [loggingErrorMsg, setLoggingErrorMsg] = useState('');
    const [isLoggingError, setIsLoggingError] = useState(false);
    const [isSignUpError, setIsSignUpError] = useState(false);
    const [signUpErrorMsg, setSignUpErrorMsg] = useState(false);
    const [userEmail,setUserEmail] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');

    const history = useHistory();

    console.log(history)

    useEffect(()=>{
        const localToken  = localStorage.getItem('token');
        setToken(localToken);
        const localUserId = localStorage.getItem('userId');
        setUserId(localUserId);
        const localUserName = localStorage.getItem('userName');
        setUserName(localUserName);
        const localUserEmail = localStorage.getItem('userEmail');
        setUserEmail(localUserEmail)
        const localExpiryDate =  localStorage.getItem('expiryDate');
        const localProfileImageUrl = localStorage.getItem('profileImageUrl');
        setProfileImageUrl(localProfileImageUrl)

        if(new Date(localExpiryDate) <= new Date()){
            setIsAuth(false)
            logoutHandler();
            return
        }
        const remainingMilliseconds = new Date(localExpiryDate).getTime() - new Date().getTime();
        autoLogout(remainingMilliseconds);
        setIsAuth(true)

    },[])

    //Function for Autologout
    const autoLogout = (milliseconds) => {
        setTimeout(()=>{
            logoutHandler();
        },milliseconds)
    }

    //Added the signup function
    const signUpHandler = (userName,email,password) => {
        fetch(`${serverUrl}/auth/signup`,{
            method:'PUT',
            headers: {
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({
                userName: userName,
                email: email,
                password: password
            })
        }).then(respose=>{
            return respose.json();
        }).then(result=>{
            setIsSignUpError(result.signUpError);
            setSignUpErrorMsg(result.message)
            if (!result.signUpError){
                history.push('/');
                setIsSignUpError(result.signUpError);
            }
        });
    }

    // Added the login function
    const loginHandler = (email,password) => {
        fetch(`${serverUrl}/auth/login`,{
            method:'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({
                email: email,
                password: password
            })
        }).then(response=>{
            return response.json();
        }).then(result=>{
            console.log('Logging data ',result)
            if(!result.loggingError){
                setIsLoggingError(false)
                setToken(result.token);
                setUserId(result.userId);
                setUserName(result.userName)
                setIsAuth(true);
                setUserEmail(result.userEmail)
                setProfileImageUrl(result.profileImageUrl)
                localStorage.setItem('profileImageUrl',result.profileImageUrl)
                localStorage.setItem('token',result.token)
                localStorage.setItem('userId',result.userId);
                localStorage.setItem('userName',result.userName);
                localStorage.setItem('userEmail',result.userEmail)

                const remainingMilliseconds = 60 * 60 * 1000;
                const expiryDate = new Date (
                    new Date().getTime() + remainingMilliseconds
                )
                localStorage.setItem('expiryDate',expiryDate.toISOString())
                autoLogout(remainingMilliseconds);
            }else{
                setIsLoggingError(result.loggingError)
                setLoggingErrorMsg(result.message)
            }
        });
    }

    const profileImageUrlHandler = (profileImageUrl) => {
        setProfileImageUrl(profileImageUrl);
    }

    //logout Function added
    const logoutHandler = () => {
        setToken(null)
        setIsAuth(false);
        localStorage.clear();
    };

    return(
        <AuthContext.Provider value={{
            loginHandler:loginHandler,
            signUpHandler:signUpHandler,
            logoutHandler:logoutHandler,
            profileImageUrlHandler:profileImageUrlHandler,
            token: token,
            userId:userId,
            isAuth:isAuth,
            userName:userName,
            userEmail:userEmail,
            profileImageUrl:profileImageUrl,
            loggingErrorMsg:loggingErrorMsg,
            isLoggingError:isLoggingError,
            isSignUpError:isSignUpError,
            signUpErrorMsg:signUpErrorMsg
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}


export default AuthContext;
