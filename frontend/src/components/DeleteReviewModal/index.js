import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchDeleteReview } from "../../store/reviews";

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
      <div className="deleteModal">
        <h1>Confirm Delete</h1>
        <h2 className="areYouSure">Are you sure you want to delete this review?</h2>
        <div className="deleteButton">
          <button className='delete' onClick={handleDelete}

          >Yes (Delete Review)</button></div>

        <div className="dontDelete"><button className="noDelete"
          onClick={closeModal}>No (Keep Review)</button></div>
      </div>
    </>
  )
}

export default DeleteReviewModal;
