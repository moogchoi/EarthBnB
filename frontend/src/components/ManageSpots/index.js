import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotCurrentUser } from "../../store/spots";
import './ManageSpots.css';

const SpotCard = ({ spot }) => {
  const { closeModal } = useModal();
  return (
    <>
      <div className="spotCard">
        <Link to={`/spots/${spot.id}`}>
          <div className="spotImage">
            <img src={spot.previewImage} alt={`${spot.name}`}></img>
          </div>
          <div className="spotLocation">
            <h3>{`${spot.city}, ${spot.state}`}</h3>
            <h3 className="starReview">{spot.avgRating
              ? <span><i className="fa-solid fa-star star-color"></i> {`${spot.avgRating.toFixed(2)}`}</span>
              : <span><i className="fa-solid fa-star star-color"></i> New</span>}</h3>
          </div>
          <h3 className="price">{`$${spot.price} night`}</h3>
        </Link>
        <div className="manageButtons">
          <Link to={`/spots/${spot.id}/edit`}><button className="manBut">Update</button></Link>
          <OpenModalButton
            buttonText="Delete"
            className="deleteBut"
            modalComponent={<DeleteSpotModal spotId={spot.id} closeModal={closeModal} />}
          />
        </div>
      </div>
    </>
  );
}

const ManageSpots = () => {
  const dispatch = useDispatch();
  const spots = Object.values(useSelector(state => state.spots));

  useEffect(() => {
    dispatch(fetchSpotCurrentUser());
  }, [dispatch]);

  if (!spots) return null;
  return (
    <>
      <h1 className="spotsHeader">Manage Spots</h1>
      <Link to='/spots/new'><button className="newSpot"> Create a new spot</button></Link>
      <div className="AllSpotsContainer">
        {spots.map((spot) => (
          <SpotCard
            spot={spot}
            key={spot.id} />
        ))}
      </div>
    </>
  );
}

export default ManageSpots;
