import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const RECEIVE_SPOT = 'spots/RECEIVE_SPOT';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

export const receiveSpot = (spot) => ({
  type: RECEIVE_SPOT,
  spot,
});

export const editSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});

export const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  spotId
})

export const deleteUserSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  if (response.ok) {
    dispatch(deleteSpot(spotId))
  } else {
    const error = await response.json()
    return error
  }
}

export const fetchSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');
  if (response.ok) {
    const data = await response.json();
    const spots = data.Spots;
    dispatch(loadSpots(spots))
  }
  return response;
}

export const fetchReceiveSpot = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  if (response.ok) {
    const data = await response.json()
    dispatch(receiveSpot(data))
  } else {
    const error = await response.json()
    return error
  }
}

export const fetchSpotCurrentUser = () => async (dispatch) => {
  const response = await fetch('/api/spots/current');
  if (response.ok) {
    const data = await response.json();
    dispatch(loadSpots(data))
  }
  return response;
}

export const createSpot = (spot, spotImages) => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/spots/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(spot)
    });
    if (response.ok) {
      const newSpot = await response.json()
      await dispatch(createSpotImages(spotImages, newSpot.id))
      return newSpot
    }

    else {
      const errors = await response.json()
      return errors
    }
  } catch (error) {
    const errors = await error.json()
    return errors
  }
}

export const updateSpot = (spot) => async (dispatch) => {
  try {

    const response = await csrfFetch(`/api/spots/${spot.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(spot)
    });
    if (response.ok) {
      const updatedSpot = await response.json()
      dispatch(editSpot(updatedSpot))
      return updatedSpot
    }
    else {
      const error = await response.json()
      return error
    }
  } catch (error) {
    const errors = await error.json()
    return errors
  }

}

export const createSpotImages = (spotImages, newSpotId) => async (dispatch) => {

  for (let spotImage of spotImages) {

    const response = await csrfFetch(`/api/spots/${newSpotId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(spotImage)
    })
  }

}

const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      const spotsState = {};
      action.spots.forEach((spot) => {
        spotsState[spot.id] = spot;
      });
      return spotsState
    case RECEIVE_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    case UPDATE_SPOT:
      return { ...state, [action.spot.id]: action.spot };

    case DELETE_SPOT:
      const newState = { ...state };
      delete newState[action.spotId];
      return newState


    default:
      return state;
  }
}

export default spotsReducer
