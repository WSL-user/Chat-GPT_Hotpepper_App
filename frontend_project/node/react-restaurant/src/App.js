import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';

function App() {

    const [restaurants, setRestaurants] = useState(["Restaurant 1", "Restaurant 2"]);
    
    useEffect(() => {
        fetch("http://192.168.61.51:18843/restaurants/restaurants_api/", {
            method : "GET",
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'Token 351775475067c607886d93aedf18a21d672c7d2a'
            }
        })
        .then( resp => resp.json())
        .then( resp => setRestaurants(resp))
        .catch( error => console.log(error))
    }, [])
    
    return (
        <div className="App">
          <header className="App-header">
              <h1>Restaurant Rater</h1>
          </header>
          <div className="layout">
              <div>
                  { restaurants.map ( restaurant => {
                      return <h2>{restaurant}</h2>
                  })}
              </div>
              <div>Restaurant Details</div>
          </div>

        </div>
        );
    }

export default App;
