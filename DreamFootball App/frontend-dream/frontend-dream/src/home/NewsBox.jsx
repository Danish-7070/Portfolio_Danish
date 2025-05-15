import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegNewspaper } from 'react-icons/fa';

const URL = import.meta.env.VITE_BACKEND_URL;

const NewsCard = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_CHARACTERS = 200;

  // Function to truncate text
  const getTruncatedText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.slice(0, maxLength) + '...' 
      : text;
  };

  return (
    <div className="bg-white min-h-40 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 p-4">
      <div className="flex flex-col items-start pb-4 space-y-2 text-primary-600">
        <FaRegNewspaper className="text-2xl" />
        <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
        
        <p className="text-gray-600 text-left text-sm mb-4">
          {isExpanded ? item.content : getTruncatedText(item.content, MAX_CHARACTERS)}
          
          {item.content.length > MAX_CHARACTERS && (
            <button 
              className="text-blue-500 ml-2 hover:underline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'See Less' : 'See More'}
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

const NewsBox = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4); // State for controlling visible news items

  // Fetch the news from the backend
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/news`);
      if (response.status >= 400) {
        throw new Error(response.data.message);
      }
      setNews(response.data.news);  // Assuming response contains news data in an array
    } catch (error) {
      setError(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();  // Fetch news when the component mounts
  }, []);

  const handleShowMore = () => {
    if (visibleCount === 4) {
      setVisibleCount(news.length); // Show all items if it's currently limited
    } else {
      setVisibleCount(4); // Show only the first 4 items
    }
  };

  return (
    <section className="bg-transparent py-8 px-4 mx-auto max-w-screen-xl">
      <div className="mx-auto max-w-screen-lg sm:text-center">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-4xl text-primary mb-6">
          Latest News
        </h2>
        
        {error && (
          <div role="alert" className="alert alert-error leading-tight flex justify-between py-2 mb-4 text-red-600 bg-red-100 rounded-md">
            <span>{error}</span>
            <button className="btn btn-sm border-none" onClick={() => setError(null)}>
              x
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-900"></div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {news.slice(0, visibleCount).map((item) => (
                <NewsCard key={item._id} item={item} />
              ))}
            </div>
            
            {/* Show More / Show Less Button */}
            {news.length > 4 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleShowMore}
                  className="text-white font-semibold bg-primary hover:bg-red-600  border-primary border-2 p-2 rounded-lg"
                >
                  {visibleCount === 4 ? 'Show More' : 'Show Less'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsBox;
