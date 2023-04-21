import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { API } from "../api-service";

//最初はhookでやろうと思ってたけどなんかむずかったからやめた
//NOTE 自信ニキ直しといて
function useChatGPT() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [token] = useCookies(["mr-token"]);
    const [id] = useCookies(["restaurant-id"]);


    useEffect( () => {
        async function fetchData() {
            setLoading(true);
            setError();
            console.log("id =")
            console.log(id)
            if (id[2]==="undefined") {
                const data = []
            } else {
                const data = await API.askChatGPT(id, token["mr-token"])
                    .catch(err => setError(err))
                setData(data);
                setLoading(false);
            }
        }

        fetchData();
    }, []);
    return [data, loading, error];
}

export {useChatGPT};
