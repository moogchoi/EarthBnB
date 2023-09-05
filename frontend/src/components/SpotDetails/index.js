import React from "react";
import { useDispatch, useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { fetchReceiveSpot } from "../../store/spots";
import { fetchLoadSpotReviews, fetchUserReviews } from "../../store/reviews";
import './SpotDetails.css'
import OpenModalButton from "../OpenModalButton";
import ReviewModal from "../ReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";

const SpotDetails = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const history = useHistory()
  const [goToSpot, setGoToSpot] = useState(spotId);
  const spot = useSelector(state => state.spots[spotId])
  const sessionUser = useSelector((state) => state.session.user);
  const [hasReview, setHasReview] = useState(false)

  const reviewIds = useSelector(state => state.reviews.spotReviews && state.reviews.spotReviews[spotId]);
  const allReviews = useSelector(state => state.reviews.reviews);
  const reviews = reviewIds && reviewIds.map(id => allReviews[id]);

  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchUserReviews())
        .then(reviews => {

          const foundReview = Object.values(reviews).find((review) => {
            return review.spotId === +spotId
          });
          if (foundReview) {
            setHasReview(true)
          }

        })
        .then(() => dispatch(fetchLoadSpotReviews(spotId)))
    }
  }, [sessionUser, dispatch, spotId])


  useEffect(() => {
    dispatch(fetchReceiveSpot(spotId))
    dispatch(fetchLoadSpotReviews(spotId))
  }, [dispatch, spotId])

  if (!spot || !spot.Owner || !spotId) return null;

  const canPostReview = sessionUser && sessionUser.id !== spot.Owner.id && !hasReview;

  const handleSubmit = e => {
    e.preventDefault();
    history.push(`/spots/${goToSpot}`);
  }

  const handleReviewDelete = () => {
    setHasReview(false)
    dispatch(fetchLoadSpotReviews(spotId))
    dispatch(fetchReceiveSpot(spotId))
  }

  let postReviewButton;
  if (canPostReview) {
    postReviewButton = (
      <>
        <OpenModalButton
          modalComponent={<ReviewModal spotId={spotId} setHasReview={setHasReview} />}
          buttonText="Post Review" />
      </>
    )
  }

  return (
    <div id='spot-details-parent'>
      <div className="spotTitle">
        <h1>{spot.name}</h1>
        <h3>{spot.city}, {spot.state}, {spot.country}</h3>
      </div>
      <div className="spotImages">
        {Array.isArray(spot.SpotImages) && spot.SpotImages.map((image, index) => (
          <img
            className={index === 0 ? "large-image" : "small-image"}
            key={index} src={image.url} alt={`${spot.name} ${index + 1}`} />
        ))}
      </div>
      <div className="spotInfo">
        <div className="owner_des">
          <div className="ownerInfo">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
          <div className="spotDescription">{spot.description}</div>
        </div>
        <div className="price_reserveButContainer">

          <div className="priceAndReviews">
            <div>${spot.price} night</div>

            <div className="reviewsStar"> <i className="fa-solid fa-star"></i> {spot.avgRating}
              {spot.numReviews > 1
                ? <span> &#x2022; {spot.numReviews} reviews</span>
                : spot.numReviews === 1
                  ? <span>  &#x2022; {spot.numReviews} review</span>
                  : <span> New</span>
              }</div>
          </div>
          <div className="resBut">
          </div>
        </div>
      </div>

      <div className="reviews">
        <span><h1><i className="fa-solid fa-star"></i> {spot.avgRating}     {spot.numReviews > 1
          ? <span>&#x2022; {spot.numReviews} reviews</span>
          : spot.numReviews === 1
            ? <span>&#x2022;  {spot.numReviews} review</span>
            : <span> New <h2>Be the first to post a review!</h2></span>
        }</h1></span>

        {postReviewButton}

        {Array.isArray(reviews) && [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review, index) => (
          <div key={index}>
            <div className="nametext">{review.User?.firstName} {review.User?.lastName}</div> <div className="date"><div>{new Date(review?.createdAt).toISOString().split('T')[0]}</div></div>
            <div className="reviewcss"> {review?.review}</div>
            {sessionUser && sessionUser.id === review.userId && (
              <OpenModalButton
                className="deleteReviewButton"
                modalComponent={<DeleteReviewModal reviewId={review.id} onReviewDelete={handleReviewDelete} setHasReview={setHasReview} />}
                buttonText="Delete Review"

              />
            )}</div>
        ))}
      </div>
    </div>
  )
}

export default SpotDetails;
