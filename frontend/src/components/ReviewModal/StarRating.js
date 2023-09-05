import { useState, useEffect } from "react";


const StarRating = ({ onChange }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="starRating">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <button
            type="button"
            key={index}
            className={ratingValue <= (hover || rating) ? "on" : "off"} //sets hover or rating
            onClick={() => {
              setRating(ratingValue);
              onChange(ratingValue);
            }}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(rating)}>
            {ratingValue <= (hover || rating) ? (
              <i className="fa-solid fa-star"></i>
            ) : (
              <i className="fa-regular fa-star"></i>
            )}
          </button>
        )
      })}
    </div>
  );
}


export default StarRating;
