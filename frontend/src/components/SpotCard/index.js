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
          <p className="spotLocation">{`${spot.city}, ${spot.state}`}</p>
          <p className="spotRating">{spot.avgRating
            ? <span><i className="fa-solid fa-star star-color"></i> {`${spot.avgRating.toFixed(2)}`}</span>
            : <span><i className="fa-solid fa-star star-color"></i> New</span>}</p>
            <p className="spotPrice">{`$${spot.price} night`}</p>
        </div>
      </div>

    </>
  )
}

export default SpotCard;
