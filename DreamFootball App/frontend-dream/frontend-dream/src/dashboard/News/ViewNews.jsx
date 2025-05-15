import React, { useState, useEffect } from "react";
import AdminSiderbar from "../../components/sidebar/sidebar";
import NewsCard from "./NewsCard";  // Assuming you have a NewsCard component
import { GiEmptyHourglass } from "react-icons/gi";
import axios from "axios";
import toast from "react-hot-toast";

const URL = import.meta.env.VITE_BACKEND_URL;  // Backend URL

const ViewNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch all news
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/news`);
      if (response.status >= 400) {
        throw new Error(response.data.message);
      }
      setNews(response.data.news);  // Assuming the response returns an array of news
    } catch (error) {
      setError(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();  // Fetch news when the component mounts
  }, []);

  // Handle news deletion
  const handleRemove = async (newsId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.delete(`${URL}/news/${newsId}`);
      if (response.status >= 400) {
        throw new Error(response.data.message);
      }
      toast.success("News deleted successfully!");
      fetchNews();  // Refresh the list of news
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to delete news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-2 pb-16">
      <AdminSiderbar />
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex flex-col justify-start gap-4 w-full pt-5">
          {error && (
            <div
              role="alert"
              className="alert alert-error leading-tight flex justify-between py-1 w-full mx-auto"
            >
              <span>{error}</span>
              <div>
                <button
                  className="btn btn-sm border-none"
                  onClick={() => setError(null)}
                >
                  x
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-4">
            {news.length > 0 ? (
              news.map((newsItem) => (
                <NewsCard
                  key={newsItem._id}
                  newsItem={newsItem}
                  onRemove={handleRemove} // Pass the handleRemove function
                  type="remove"
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-xl shadow-md border border-black border-dashed">
                <GiEmptyHourglass className="text-6xl text-gray-500" />
                <p className="text-gray-500 text-2xl">No news found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewNews;
