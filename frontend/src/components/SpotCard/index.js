import React from "react";
import './SpotCard.css';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";

const SpotCard = ({ spot }) => {

  return (
    <>
      <div className="spotCard">
        <div className="spotImage">
          <img src={spot.previewImage} alt={`${spot.name}`}/>
        </div>
        <div className="spotInfo">
          <p>{`${spot.city}, ${spot.state}`}</p>
          <p>{spot.avgRating
            ? <span><i className="fa-solid fa-star star-color"></i> {`${spot.avgRating}`}</span>
            : <span><i className="fa-solid fa-star star-color"></i> New</span>}</p>
        </div>
        <p className="spotPrice">{`$${spot.price} night`}</p>
      </div>

    </>
  )
}

export default SpotCard;
