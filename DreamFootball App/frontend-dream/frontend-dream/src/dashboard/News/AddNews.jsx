import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminSiderbar from "../../components/sidebar/sidebar";

const URL = import.meta.env.VITE_BACKEND_URL; // Backend URL for API calls

const AddNews = ({ setActiveTab }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (title === "" || content === "") {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${URL}/news`, { title, content });
      const data = response.data;
        console.log(data);
      if (response.status >= 400) {
        throw new Error(data.message);
      }

      toast.success("News added successfully!");
      setActiveTab("View News"); 
    } catch (error) {
      setError(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4 w-full max-sm:w-full max-md:w-2/3">
      <AdminSiderbar />
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Add a New News Article</h1>
          <div className="flex flex-col gap-2">
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
            <label className="text-gray-500">News Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New Announcement"
              className="rounded-md p-3 border border-gray-300"
            />
            <label className="text-gray-500">Content</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the content here"
              className="rounded-md p-3 border border-gray-300"
              rows="6"
            />
          </div>
          <button
            className={`btn btn-primary mt-5 w-full text-white rounded-full ${loading ? "cursor-not-allowed" : ""}`}
            type="submit"
          >
            {loading && <span className="loading loading-spinner"></span>}
            {loading ? "Adding News..." : "Add News"}
          </button>
          {error && <p className="text-red-500">{error.message}</p>}
        </form>
      )}
    </div>
  );
};

export default AddNews;
