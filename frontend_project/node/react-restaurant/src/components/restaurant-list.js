import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { API } from '../api-service';
import { useCookies } from "react-cookie";

//飲食店をリストアップするやつ
function RestaurantList(props) {
    const [token] = useCookies(["mr-token"]);

    const restaurantClicked = restaurant => evt => {
        props.restaurantClicked(restaurant)
        props.clickeClose()
    }

    const editClicked = restaurant => {
        props.editClicked(restaurant);
        props.clickeClose()
    }

    const deleteClicked = restaurant => {
        API.deleteRestaurant(restaurant.id, token["mr-token"])
            .then(() => props.deleteClicked(restaurant))
            .catch(error => console.log(error))
    }
    

    return (
            <div>
                { props.restaurants ? props.restaurants.map( restaurant => {
                    return (
                        <div key={restaurant.id} className="restaurant-item">
                           <h2 onClick={restaurantClicked(restaurant)}>{restaurant.name}</h2>
                           <FontAwesomeIcon icon={faEdit} onClick={() => editClicked(restaurant)}/>
                        <FontAwesomeIcon icon={faTrash} onClick={() => deleteClicked(restaurant)}/>
                        </div>
                    )
                }): null}
            </div>
    )
}

export default RestaurantList; 
