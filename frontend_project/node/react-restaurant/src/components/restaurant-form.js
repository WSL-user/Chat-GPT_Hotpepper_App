import React, { useState, useEffect } from 'react';
import { API } from '../api-service';
import { useCookies } from "react-cookie";

//飲食店の情報を登録するフォーム作成
function RestaurantForm(props) {
    const [ name, setName] = useState(props.restaurant.name);
    const [ address, setAddress] = useState(props.restaurant.address)
    const [ wifi, setWifi] = useState(props.restaurant.wifi)
    const [ child, setChild] = useState(props.restaurant.child)
    const [ budget, setBudget] = useState(props.restaurant.budget)
    const [ genre, setGenre] = useState(props.restaurant.genre)
    const [ sub_genre, setSubGenre] = useState(props.restaurant.sub_genre)
    const [token] = useCookies(["mr-token"]);

    useEffect(() => {
        setName(props.restaurant.name);
        setAddress(props.restaurant.address);
        setWifi(props.restaurant.wifi);
        setChild(props.restaurant.child);
        setBudget(props.restaurant.budget);
        setGenre(props.restaurant.genre);
        setSubGenre(props.restaurant.sub_genre);
    }, [props.restaurant])

    const updateClicked = () => {
        console.log('update here');
        API.updateRestaurant(props.restaurant.id, {name, address, budget, wifi, child, genre, sub_genre}, token["mr-token"])
            .then( resp => props.updatedRestaurant(resp) )
            .catch(error => console.log(error))
    }

    const createClicked = () => {
        console.log('creae here');
        API.createRestaurant({name, address, budget, wifi, child, genre, sub_genre}, token["mr-token"])
            .then( resp => props.restaurantCreated(resp) )
            .catch(error => console.log(error))
    }

    const isDisabled = name.length ===0 || address.length === 0;

    
    return (
        <React.Fragment>
            { props.restaurant? (
                    <div>
                <label htmlFor="name">Name</label><br/>
                <input className="inputForm" id="name" type="text" placeholder="name" value={name}
                        onChange={evt => setName(evt.target.value)}
                /><br/>
                <label htmlFor="address">Address</label><br/>
                <textarea className="inputForm" id="address" type="text" placeholder="catch" value={address}
            onChange={evt => setAddress(evt.target.value)}></textarea><br/>

                <label htmlFor="budget">Budget</label><br/>
                <input className="inputForm" id="budget" type="text" placeholder="budget" value={budget}
            onChange={evt => setBudget(evt.target.value)}/><br/>

                <label htmlFor="wifi">Wifi</label><br/>
                <input className="inputForm" id="wifi" type="text" placeholder="wifi" value={wifi}
            onChange={evt => setWifi(evt.target.value)}/><br/>

                <label htmlFor="child">Child</label><br/>
                <input className="inputForm" id="child" type="text" placeholder="child" value={child}
            onChange={evt => setChild(evt.target.value)}/><br/>

                <label htmlFor="genre">Genre</label><br/>
                <input className="inputForm" id="genre" type="text" placeholder="child" value={genre}
            onChange={evt => setGenre(evt.target.value)}/><br/>

                <label htmlFor="sub_genre">Sub genre</label><br/>
                <input className="inputForm" id="sub_genre" type="text" placeholder="sub_genre" value={sub_genre}
            onChange={evt => setSubGenre(evt.target.value)}/><br/>


                {props.restaurant.id ?
                 <button className="updateButton" onClick={updateClicked} disabled={isDisabled}>Update</button> :
                 <button onClick={createClicked} disabled={isDisabled}>Create</button>		     
                }


            </div>
            ): null}
        </React.Fragment>
    )
}

export default RestaurantForm;
