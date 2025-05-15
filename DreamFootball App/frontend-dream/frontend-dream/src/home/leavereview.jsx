import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import review from "../assets/review.png";
import axios from "axios";
import toast from "react-hot-toast";

const URL = import.meta.env.VITE_BACKEND_URL;

const LeaveReview = () => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReviewSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${URL}/reviews`, {
        rating,
        description
      }, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`
        }
      });
      console.log('response', response)
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }

      toast.success("Review Submitted Successfully");
      setDescription("");
      setRating(0);
    } catch (err) {
      console.log('error', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col md:flex-row items-center p-10 max-sm:p-5 bg-customDark">
      <div className="w-1/3 flex justify-center max-sm:w-full">
        <img src={review} alt="review" />
      </div>
      <div className="container w-2/3 max-sm:w-full">
        {error && (
          <div
            role="alert"
            className="alert alert-error leading-tight flex justify-between py-1 w-full mx-auto mb-2"
          >
            <span>{error}</span>
            <button className="btn btn-sm  border-none" onClick={() => setError(null)}>
              x
            </button>
          </div>
        )}
        <h3 className="text-xl sm:text-2xl ">
          Leave a Review for your experience with Dream Arena
        </h3>
        <div className="flex gap-2 mb-3 mt-3">
          {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;
            return (
              <label key={i} className="flex items-center">
                <FaStar
                  className="star"
                  color={
                    ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                  }
                  size={20}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(ratingValue)}
                />
              </label>
            );
          })}
        </div>
        <textarea
          placeholder="Leave a review"
          className="w-full opacity-45 p-10 rounded-xl text-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button onClick={handleReviewSubmit} disabled={loading} className="btn bg-red-500 border-0 w-full hover:bg-red-700">
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>

    </div>
  );
};

export default LeaveReview;
