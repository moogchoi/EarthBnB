import React from 'react';
import './SpotDetails.css';
import { fetchReceiveSpot } from '../../store/spots';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import { deleteUserSpot, fetchLoadSpotReviews } from '../../store/reviews';
import { fetchUserReviews } from '../../store/reviews';
import OpenModalButton from '../OpenModalButton';
import PostReviewModal from '../PostReviewModal';
import DeleteReviewModal from '../DeleteReviewModal';

const SpotDetails = () => {
	const dispatch = useDispatch();
	const { spotId } = useParams();
	const { closeModal } = useModal();
	const history = useHistory();
	const [goToSpot, setGoToSpot] = useState(spotId);
	const spot = useSelector((state) => state.spots[spotId]);
	const sessionUser = useSelector((state) => state.session.user);
	const [userReviews, setUserReviews] = useState([]);
	const [hasReview, setHasReview] = useState(false);

	const reviewIds = useSelector(
		(state) => state.reviews.spotReviews && state.reviews.spotReviews[spotId]
	);

	const allReviews = useSelector((state) => state.reviews.reviews);

	const reviews = reviewIds && reviewIds.map((id) => allReviews[id]);

	useEffect(() => {
		if (sessionUser) {
			dispatch(fetchUserReviews())
				.then((reviews) => {
					const foundReview = Object.values(reviews).find((review) => {
						return review.spotId === +spotId;
					});
					if (foundReview) {
						setHasReview(true);
					}
				})
				.then(() => dispatch(fetchLoadSpotReviews(spotId)));
		}
	}, [sessionUser, dispatch, spotId]);

	useEffect(() => {
		dispatch(fetchReceiveSpot(spotId));
		dispatch(fetchLoadSpotReviews(spotId));
	}, [dispatch, spotId]);

	if (!spot || !spot.Owner || !spotId) return null;

	const canPostReview =
		sessionUser && sessionUser.id !== spot.Owner.id && !hasReview;

	const handleSubmit = (e) => {
		e.preventDefault();
		history.push(`/spots/${goToSpot}`);
	};

	const handleReviewDelete = () => {
		setHasReview(false);
		dispatch(fetchLoadSpotReviews(spotId));
		dispatch(fetchReceiveSpot(spotId));
	};

	//SESSION CODE FOR DELETE/POST REVIEW
	let postReviewButton;
	if (canPostReview) {
		postReviewButton = (
			<>
				<OpenModalButton
					modalComponent={
						<PostReviewModal spotId={spotId} setHasReview={setHasReview} />
					}
					buttonText='Post Your Review'
				/>
			</>
		);
	}

	return (
		<div className='singleSpot'>
			<div className='spotNameLocation'>
				<h1>{spot.name}</h1>
				<h3>
					{spot.city}, {spot.state}, {spot.country}
				</h3>
			</div>
			<div className='spotImages'>
				{Array.isArray(spot.SpotImages) &&
					spot.SpotImages.map((image, index) => (
						<img
							className={index === 0 ? 'large-image' : 'small-image'}
							key={index}
							src={image.url}
							alt={`${spot.name} ${index + 1}`}
						/>
					))}
			</div>
			<div className='spotInfo'>
				<div className='owner_des'>
					<div className='ownerInfo'>
						Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
					</div>
					<div className='spotDescription'>{spot.description}</div>
				</div>
				<div className='price_reserveButContainer'>
					<div className='priceAndReviews'>
						<div>${spot.price} night</div>

						<div className='reviewsStar'>
							{spot.numReviews > 1 ? (
								<span><i className='fa-solid fa-star'></i> {spot.avgStarRating.} {spot.numReviews} reviews</span>
							) : spot.numReviews === 1 ? (
								<span><i className='fa-solid fa-star'></i> {spot.avgStarRating} {spot.numReviews} review</span>
							) : (
								<span><i className='fa-solid fa-star'></i> New</span>
							)}
						</div>
					</div>
					<div className='resBut'>
          <button className="reserveButton" onClick={() => alert("Feature Coming Soon...")}>Reserve</button>
					</div>
				</div>
			</div>

			<div className='reviews'>
				<span>
					<h1>
						<i className='fa-solid fa-star'></i> {spot.avgStarRating}{' '}
						{spot.numReviews > 1 ? (
							<span>&#x2022; {spot.numReviews} reviews</span>

						) : spot.numReviews === 1 ? (
							<span>&#x2022; {spot.numReviews} review</span>
						) : (
							<span className='reviewBar'>
								{' '}
								New

								<h2>Be the first to post a review!</h2>
							</span>
						)}
					</h1>
				</span>
				<div className='reviews'>{postReviewButton}</div>


				{Array.isArray(reviews) &&
					[...reviews]
						.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
						.map((review, index) => (
							<div key={index}>
								<div className='nametext'>
									{review.User?.firstName} {review.User?.lastName}
								</div>{' '}
								<div className='date'>
									<div>
										{new Date(review?.createdAt).toISOString().split('T')[0]}
									</div>
								</div>
								<div className='reviewcss'> {review?.review}</div>
								{sessionUser && sessionUser.id === review.userId && (
									<OpenModalButton
										className='deleteReviewButton'
										modalComponent={
											<DeleteReviewModal
												reviewId={review.id}
												onReviewDelete={handleReviewDelete}
												setHasReview={setHasReview}
											/>
										}
										buttonText='Delete Review'
									/>
								)}
							</div>
						))}
			</div>
		</div>
	);
};

export default SpotDetails;
