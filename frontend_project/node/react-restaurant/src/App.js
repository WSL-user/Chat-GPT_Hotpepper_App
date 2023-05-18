import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import RestaurantList from "./components/restaurant-list";
import RestaurantDetails from "./components/restaurant-details";
import RestaurantForm from "./components/restaurant-form";
import RestaurantSearch from "./components/restaurant-search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import { useFetch } from "./hooks/useFetch";
import "./App.css";
import {
  Text,
  Box,
} from "@chakra-ui/react";

//アプリ全体を表示するやつ
//参考: https://github.com/Nogostradamus/course-django-react-web
function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [editedRestaurant, setEditedRestaurant] = useState(null);
  const [token, setToken, deleteToken] = useCookies(["mr-token"]);
  const [data, loading, error] = useFetch();

  useEffect(() => {
    setRestaurants(data);
  }, [data]);

  useEffect(() => {
    console.log(token);
    if (!token["mr-token"]) window.location.href = "/";
  }, [token]);

  const loadRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setEditedRestaurant(null);
  };

  const editClicked = (restaurant) => {
    setEditedRestaurant(restaurant);
    setSelectedRestaurant(null);
  };

  const deleteClicked = (restaurant) => {
    const newRestaurants = restaurants.filter(
      (rest) => rest.id !== restaurant.id
    );
    setRestaurants(newRestaurants);
  };

  const updatedRestaurant = (restaurant) => {
    const newRestaurants = restaurants.map((rest) => {
      if (rest.id === restaurant.id) {
        return restaurant;
      }
      return rest;
    });
    setRestaurants(newRestaurants);
    console.log(newRestaurants);
  };

  const newRestaurant = () => {
    setEditedRestaurant({
      name: "",
      address: "",
      budget: "",
      wifi: "",
      child: "",
      genre: "",
      sub_genre: "",
    });
    setSelectedRestaurant(null);
  };

  const restaurantCreated = (restaurant) => {
    const newRestaurants = [...restaurants, restaurant];
    console.log(newRestaurants);
    setRestaurants(newRestaurants);
  };

  const logoutUser = () => {
    deleteToken(["mr-token"]);
  };

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error Loading Restaurants</h1>;

  return (
    <Box className="App">
      <header className="App-header">
        <h1>
          <FontAwesomeIcon icon={faUtensils} /> Restaurant Rater ChatGPT
        </h1>
      </header>
      <FontAwesomeIcon icon={faSignOutAlt} onClick={logoutUser} />

      <RestaurantSearch updateRestaurant={loadRestaurant} />
      <div className="layout">
        <div>
          <RestaurantList
            restaurants={restaurants}
            restaurantClicked={loadRestaurant}
            editClicked={editClicked}
            deleteClicked={deleteClicked}
          />
          <button onClick={newRestaurant}>New Restaurant</button>
        </div>
        <RestaurantDetails
          restaurant={selectedRestaurant}
          updateRestaurant={loadRestaurant}
        />
        {editedRestaurant ? (
          <RestaurantForm
            restaurant={editedRestaurant}
            updatedRestaurant={updatedRestaurant}
            newRestaurant={newRestaurant}
            restaurantCreated={restaurantCreated}
          />
        ) : null}
      </div>
    </Box>
  );
}

export default App;
