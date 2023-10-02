import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchDeleteReview } from "../../store/reviews";
import './DeleteReviewModal.css'

const DeleteReviewModal = ({ reviewId, onReviewDelete }) => {
  const dispatch = useDispatch();

  const { closeModal } = useModal();

  const handleDelete = () => {
    dispatch(fetchDeleteReview(reviewId))
      .then(() => {
        if (onReviewDelete) {
          onReviewDelete();
        }
        closeModal();
      })

  }
  return (
    <>
      <div className="deleteReviewModal">
        <p>Confirm Delete</p>
        <p>Are you sure you want to delete this review?</p>
        <div>
          <button className='delete' onClick={handleDelete}

          >Yes (Delete Review)</button></div>

        <div><button className="noDelete"
          onClick={closeModal}>No (Keep Review)</button></div>
      </div>
    </>
  )
}

export default DeleteReviewModal;
