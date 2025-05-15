import React, { useState, useEffect, useRef } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

const URL = import.meta.env.VITE_BACKEND_URL;

const DisplayReview = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch reviews from the backend
    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${URL}/all-reviews`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${localStorage.getItem("token")}`,
                },
            });
            const data = response.data;
            if (response.status >= 400) {
                throw new Error(data.message);
            }
            setReviews(data.reviews);
        } catch (error) {
            console.error('Error fetching reviews', error);
            setError(error.response?.data?.message || "Some Error Occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Render star rating
    const renderStars = (rating) => {
        return [...Array(5)].map((star, index) => (
            <FaStar
                key={index}
                className="inline-block mx-0.5"
                color={index < rating ? "#ffc107" : "#e4e5e9"}
                size={20}
            />
        ));
    };



    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <span className="loading loading-spinner text-primary"></span>
                </div>
            ) : (
                <>
                    {error ? (
                        <div className="alert alert-error shadow-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 w-full">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl  font-extrabold text-primary">
                                        What Our Customers Say
                                    </h2>
                                    <p className="mt-4 text-xl text-white font-semibold">
                                        Hear from our valued customers about their experiences
                                    </p>
                                </div>
                                <div className="flex w-full">
                                    {reviews.length > 0 ? (
                                        <>
                                            <div className='swiper w-full hidden sm:block'>
                                                <Swiper
                                                    slidesPerView={2}
                                                    spaceBetween={20}
                                                    freeMode={true}
                                                    speed={300}
                                                    loop={true}
                                                    direction="horizontal"
                                                    modules={[Autoplay]}
                                                    autoplay={{
                                                        delay: 2000, // Time before switching to the next slide
                                                        disableOnInteraction: false, // Keep autoplay running after user interaction
                                                    }}
                                                    breakpoints={{
                                                        1200: {
                                                            slidesPerView: 3,
                                                        },
                                                        992: {
                                                            slidesPerView: 2,
                                                        },
                                                        576: {
                                                            slidesPerView: 2,
                                                        },
                                                    }}
                                                    className="swiper-wrapper w-2/3"
                                                >
                                                    {reviews.map((review, index) => (
                                                        <SwiperSlide key={index}>
                                                            <div className=" w-full">
                                                                <div className="bg-white  shadow-lg rounded-xl p-6 h-full flex flex-col">
                                                                    <div className="mb-4">
                                                                        {renderStars(review.rating)}
                                                                    </div>
                                                                    <p className="text-gray-600 mb-4 flex-grow italic">
                                                                        "{review.description}"
                                                                    </p>
                                                                    <div className="flex items-center">
                                                                        <div className="ml-4">
                                                                            <p className="text-sm font-medium text-gray-900">
                                                                                {review.by.username || 'Anonymous'}
                                                                            </p>
                                                                            <p className="text-sm text-gray-500">
                                                                                {new Date(review.createdAt).toLocaleDateString()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </div>
                                            <div className='swiper w-full sm:hidden'>
                                                <Swiper
                                                    slidesPerView={1}
                                                    spaceBetween={20}
                                                    freeMode={true}
                                                    speed={300}
                                                    loop={true}
                                                    direction="horizontal"
                                                    modules={[Autoplay]}
                                                    autoplay={{
                                                        delay: 2000, // Time before switching to the next slide
                                                        disableOnInteraction: false, // Keep autoplay running after user interaction
                                                    }}
                                                    breakpoints={{
                                                        1200: {
                                                            slidesPerView: 3,
                                                        },
                                                        992: {
                                                            slidesPerView: 2,
                                                        },
                                                        576: {
                                                            slidesPerView: 2,
                                                        },
                                                    }}
                                                    className="swiper-wrapper w-2/3"
                                                >
                                                    {reviews.map((review, index) => (
                                                        <SwiperSlide key={index}>
                                                            <div className=" w-full">
                                                                <div className="bg-white  shadow-lg rounded-xl p-6 h-full flex flex-col">
                                                                    <div className="mb-4">
                                                                        {renderStars(review.rating)}
                                                                    </div>
                                                                    <p className="text-gray-600 mb-4 flex-grow italic">
                                                                        "{review.description}"
                                                                    </p>
                                                                    <div className="flex items-center">
                                                                        <div className="ml-4">
                                                                            <p className="text-sm font-medium text-gray-900">
                                                                                {review.by.username || 'Anonymous'}
                                                                            </p>
                                                                            <p className="text-sm text-gray-500">
                                                                                {new Date(review.createdAt).toLocaleDateString()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            No reviews available yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default DisplayReview;
