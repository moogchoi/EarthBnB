import React from "react";
import './SpotIndex.css';
import SpotCard from "../SpotCard";
import { fetchSpots } from "../../store/spots";
import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { useEffect } from 'react';

const SpotIndex = () => {
  const dispatch = useDispatch();
  const spots = Object.values(useSelector(state => state.spots))


  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])

  if (!spots) return null;
  return (

    <div className="AllSpotsContainer">
      {spots.map((spot) => (
        <div>
          <Link to={`/spots/${spot.id}`}
            key={spot.id}>
            <SpotCard
              spot={spot}
              key={spot.id} />
          </Link>
        </div>
      ))}
    </div>

  )

}

export default SpotIndex;
