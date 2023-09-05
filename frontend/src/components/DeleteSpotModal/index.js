import React from "react";
import { useDispatch } from "react-redux";
import "./DeleteSpotModal.css"
import { deleteUserSpot } from "../../store/spots";

function DeleteSpotModal({ spotId, closeModal }) {
  const dispatch = useDispatch();

  return (
    <>
      <div className="deleteSpotModal">
        <h1>Confirm Delete</h1>
        <p className="deleteConfirm">Are you sure you want to remove this spot from the listings?</p>
        <div className="deleteButton">
          <button className='delete' onClick={() => {
            dispatch(deleteUserSpot(spotId))
              .then(closeModal)
          }}
          >Yes (Delete Spot)</button></div>

        <div className="dontDelete">
          <button className="noDelete"
            onClick={closeModal}>No (Keep Spot)</button></div>
      </div>
    </>
  )
}



export default DeleteSpotModal;
