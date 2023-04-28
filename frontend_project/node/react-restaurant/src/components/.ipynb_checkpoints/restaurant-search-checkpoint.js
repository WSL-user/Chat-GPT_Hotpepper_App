import React, { useState, useEffect } from 'react';
import { API } from '../api-service';
import { useChatGPT } from "../hooks/useChatGPT";
import { useCookies } from "react-cookie";

function RestaurantSearch(props) {
    const [ query, setQuery] = useState("");
    const [ searchResult, setSearchResult] = useState(null);
    const [ selectedResult, setSelectedResult] = useState(null);
    const [ chatGPTtext, setChatGPTText] = useState("");
    const [ startLoading, setStartLoading] = useState(false);
    const [token] = useCookies(["mr-token"]);
    const [id, setId] = useCookies(["restaurant-id"]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    //検索ボタンが押された時の動作
    const searchClicked = () => {
        console.log('start searching');
        setChatGPTText("Loading");
        //まず、ホットペッパーAPIを叩いてデータベースを拡充
        API.hotpepperSearchRestaurant(query, token["mr-token"])
            .then( resp => console.log(resp) )
            .catch(error => console.log(error))
        //データベース内からクエリとマッチする要素を検索
        API.searchRestaurant(query, token["mr-token"])
            .then( resp => setSearchResult(resp))
            .catch(error => console.log(error))
    }
    
    //検索結果が得られたらその一つを選ぶ機構
    //TODO
    //今のままだと検索クエリとマッチした飲食店のうち、一番昔にデータベースに加えられたものを表示する形になってしまっている
    //これだと同じのしか表示されないので良い感じの方法で結果の多様性が出るよう改良
    useEffect(() => {
        if (searchResult && searchResult.length > 0) {
            setSelectedResult(searchResult[0]);
        }
    }, [searchResult])
    
    //検索結果の飲食店が得られたら、その飲食店の特徴をプロンプトにして、chatGPTに紹介文を生成してもらう
    useEffect(() => {
        console.log(`ChatGPT text : ${chatGPTtext}`);
        console.log(selectedResult)
        if (selectedResult) {
            console.log(selectedResult)
            async function fetchData() {
                setLoading(true);
                setError();
                console.log("id =")
                console.log(selectedResult.id)
                
                const data = await API.askChatGPT(selectedResult.id, token["mr-token"])
                    .catch(err => setError(err))
                setChatGPTText(data.recommendation_text);
                console.log(data.recommendation_text)
                setSelectedResult(null);
                setSearchResult(null);
                setLoading(false);
            }
            fetchData();
        }
    }, [selectedResult])

    const isDisabled = query.length ===0;
    
    return (
        <React.Fragment>
            <div className="search-container">
                <label htmlFor="query">Search Restaurant</label><br/>
                <input id="query" type="text" placeholder="query" value={query}
                    onChange={evt => setQuery(evt.target.value)}/>
                <button onClick={searchClicked} disabled={isDisabled}>Search</button><br/>
            </div>
            <div className="search-result">
                <p>{ chatGPTtext }</p>
            </div>
        </React.Fragment>
    )
}

export default RestaurantSearch;
