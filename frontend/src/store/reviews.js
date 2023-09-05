import { csrfFetch } from "./csrf";

const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS';
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';

export const loadSpotReviews = (spotId, reviews) => ({
  type: LOAD_SPOT_REVIEWS,
  spotId,
  reviews,
});

export const loadUserReviews = (reviews) => ({
  type: LOAD_USER_REVIEWS,
  reviews
});

export const editReview = (review) => ({
  type: UPDATE_REVIEW,
  review,
});

export const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId
})

export const createReview = (spotId, review) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(review)
    });
    if (response.ok) {
      const newReview = await response.json()
      console.log("newReview fetch", newReview)
      dispatch(editReview(newReview))
      return newReview
    } else {
      const errors = await response.json()
      return errors
    }
  } catch (error) {
    const errors = await error.json()
    return errors

  }
}

export const fetchLoadSpotReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  if (response.ok) {
    const data = await response.json()
    const reviews = data.Reviews;
    dispatch(loadSpotReviews(spotId, reviews))
  } else {
    const error = await response.json()
    return error
  }
}

export const fetchUserReviews = () => async (dispatch) => {
  const response = await csrfFetch('/api/reviews/current', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  if (response.ok) {
    const data = await response.json();
    const reviews = data.Reviews;
    dispatch(loadUserReviews(reviews))

    return reviews
  } else {
    const error = await response.json()
    return error
  }
}

export const fetchDeleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  if (response.ok) {
    dispatch(deleteReview(reviewId))
  } else {
    const error = await response.json()
    return error
  }
}


const reviewsReducer = (state = {}, action) => {

  switch (action.type) {
    case LOAD_SPOT_REVIEWS:
      const { spotId, reviews } = action;
      const reviewsState = {};
      reviews.forEach((review) => {
        reviewsState[review.id] = review;
      })
      return {
        ...state,
        reviews: { ...state.reviews, ...reviewsState },
        spotReviews: { ...state.spotReviews, [spotId]: reviews.map(review => review.id) }
      }

    case LOAD_USER_REVIEWS:
      return {
        ...state,
        currentUserReviews: action.reviews.map(review => review.id)
      }
    case UPDATE_REVIEW:
      const newReview = action.review;
      const newReviewSpotId = newReview.spotId;
      const userId = newReview.userId;
      return {
        ...state,
        reviews: { ...state.reviews, [newReview.id]: newReview },
        spotReviews: { ...state.spotReviews, [newReviewSpotId]: [...(state.spotReviews[newReviewSpotId] || []), newReview.id] },
        currentUserReviews: [...state.currentUserReviews, newReview.id]
      };
    case DELETE_REVIEW:
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState
    default:
      return state;
  }
}

export default reviewsReducer;
