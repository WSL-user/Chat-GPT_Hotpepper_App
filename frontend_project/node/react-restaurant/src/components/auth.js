import React, {useState, useEffect} from "react";
import { API } from "../api-service"
import { useCookies } from "react-cookie";

//ログイン画面
//NOTE 絶対登録画面とログイン画面は分けといたほうが良い
function Auth() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginView, setIsLoginView] = useState(true);

    const [token, setToken] = useCookies(["mr-token"]);

    useEffect( () => {
        console.log(token);
        if (token["mr-token"]) window.location.href = '/restaurants';
    }, [token])

    const loginClicked = () => {
        API.loginUser({username, password})
            .then( resp => setToken('mr-token', resp.token))
            .catch(error => console.log(error))
    }

    const registerClicked = () => {
        API.registerUser({username, password})
            .then( resp => console.log(resp))
            .catch(error => console.log(error))
    }

    const isDisabled = username.length ===0 || password.length === 0
    
    return (
            <div className="App">
            <div className="App-header">
            {isLoginView ? <h1>Login</h1> : <h1>Register</h1>}
            </div>
                    <div className="login-container">
            <label htmlFor="username">Username</label><br/>
            <input id="username" type="text" placeholder="username" value={username}
        onChange={evt => setUserName(evt.target.value)}/><br/>
            <label htmlFor="password">Name</label><br/>
            <input id="password" type="password" placeholder="password" value={password}
        onChange={evt => setPassword(evt.target.value)}/><br/>

            {isLoginView?
             <button disabled={isDisabled} onClick={loginClicked}>Login</button>:
             <button disabled={isDisabled} onClick={registerClicked}>Register</button>
            }


            {isLoginView?
             <p onClick={() => setIsLoginView(false)}>You don't have an account? Register here!</p>:
                 <p onClick={() => setIsLoginView(true)}>You already have an account</p>
            }
        </div>
            </div>
    )
}

export default Auth;
