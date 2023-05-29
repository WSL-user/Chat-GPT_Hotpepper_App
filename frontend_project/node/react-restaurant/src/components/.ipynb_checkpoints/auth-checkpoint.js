import React, {useState, useEffect} from "react";
import { API } from "../api-service"
import { useCookies } from "react-cookie";

//ログイン画面
//NOTE 絶対登録画面とログイン画面は分けといたほうが良い
function Auth() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginView, setIsLoginView] = useState(true);
    //ログイン失敗時に立てるフラグ. 
    const [isError, setIsError] = useState(false);

    const [token, setToken] = useCookies(["mr-token"]);

    useEffect( () => {
        console.log(token);
        // CHANGED
        // ログイン失敗したときの処理が未実装だったので追加しました
        if (token["mr-token"] && token["mr-token"] != "undefined") {
            window.location.href = '/restaurants';
        } else if (token["mr-token"] === "undefined") {
            setIsError(true);
        }
    }, [token])

    const loginClicked = () => {
        API.loginUser({username, password})
            .then( resp => setToken('mr-token', resp.token))
            .catch(error => setIsError(true))
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

            //CHANGED
            // ユーザー名またはパスワードが違いますというメッセージを表示できるように
            {isError?
                <p class="fa-trash">Invalid username or password, Please Try Again</p>: null
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
