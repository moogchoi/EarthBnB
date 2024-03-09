import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchSpots } from "../../store/spots";
import SpotCard from "../SpotCard";
import { Link } from 'react-router-dom';

const SpotIndex = () => {
  const dispatch = useDispatch();
  const spots = Object.values(useSelector(state => state.spots));

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  if (!spots) return null;

  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-2 xl:p-5">
      {spots.map((spot) => (
        <div key={spot.id}>
          <Link to={`/spots/${spot.id}`} key={spot.id}>
            <SpotCard spot={spot} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SpotIndex;
