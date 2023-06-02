// CHANGED
//　ポート番号はここで変えられるようにしました
const PORT = 8000

export class API {
    //飲食店データの情報を更新するAPIサービス
    static updateRestaurant(rest_id, body, token) {
        return fetch(`http://localhost:${PORT}/restaurants/restaurants_api/${rest_id}/`, {
            method : "PUT",
            headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${token}`
            },
            body: JSON.stringify(body)
        }).then(resp => resp.json())
    }
    
    //飲食店データを全て得るAPIサービス
    static getRestaurants(token) {
        console.log(`http://localhost:${PORT}/restaurants/restaurants_api/`)
        return fetch(`http://localhost:${PORT}/restaurants/restaurants_api/`, {
            method : "GET",
            headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${token}`
            }
        }).then( resp => resp.json())
    }
    
    //chatGPTに飲食店の特徴を教えてもらうAPIサービス
    static askChatGPT(pk, token) {
        return fetch(`http://localhost:${PORT}/restaurants/restaurants_api/${pk}/ask_chatGPT_to_recommend_restaurant/`, {
            method : "GET",
            headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${token}`
            }
        }).then( resp => resp.json())
    }
    
    //データベース内から検索クエリ(query)と合致するデータを入手するAPIサービス
    static searchRestaurant(query, token) {
        const params = {
          search:query
        };
        return fetch(`http://localhost:${PORT}/restaurants/search_restaurant/?` + new URLSearchParams(params), {
            method : "GET",
            headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${token}`
            }
        }).then( resp => resp.json())
    }
    
    //検索クエリ(query)と合致する飲食店をホットペッパーAPIから取得し、データベースに登録するAPIサービス
    static hotpepperSearchRestaurant(query, token) {
        const body = {
            hotpepper_query:query
        };
        return fetch(`http://localhost:${PORT}/restaurants/restaurants_api/register_hotpepper_results/`, {
            method : "POST",
            headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${token}`
            },
            body: JSON.stringify(body)
        }).then( resp => resp.json())
    }

    //ユーザーがログインするAPIサービス
    static loginUser(body) {
        return fetch(`http://localhost:${PORT}/auth/`, {
            method : "POST",
            headers : {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(resp => resp.json())
    }

    //ユーザー登録を行うAPIサービス
    static registerUser(body) {
        return fetch(`http://localhost:${PORT}/restaurants/users/`, {
            method : "POST",
            headers : {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(resp => resp.json())
    }

    //新たな飲食店を登録するAPIサービス
    static createRestaurant(body, token) {
        return fetch(`http://localhost:${PORT}/restaurants/restaurants_api/`, {
            method : "POST",
            headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${token}`
            },
            body: JSON.stringify(body)
        }).then(resp => resp.json())
    }

    //飲食店を削除するAPIサービス
    //NOTE　将来的には安全のため不要になるかも
    static deleteRestaurant(rest_id, token) {
        return fetch(`http://localhost:${PORT}/restaurants/restaurants_api/${rest_id}/`, {
            method : "DELETE",
            headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${token}`
            },
        })
    }
}
