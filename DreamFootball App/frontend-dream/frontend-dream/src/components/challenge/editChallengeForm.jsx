import React, { useState, useEffect } from 'react';

const EditChallengeForm = ({ challengeData, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState();
  const [status, setStatus] = useState("inactive");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (challengeData) {
      setTitle(challengeData.title);
      setDescription(challengeData.description);
      setPoints(challengeData.points);
      setStatus(challengeData.status);
    }
  }, [challengeData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedChallenge = {
        id: challengeData.id, 
        title,
        description,
        points: Number(points),
        status,
        createdAt: challengeData.createdAt, 
      };

      console.log('Challenge updated successfully', updatedChallenge);
      onSubmit(updatedChallenge);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Edit Challenge</h1>

      {/* Form inputs for challenge details */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-500">Challenge Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter challenge title"
          className="rounded-md p-3 border border-gray-300"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-gray-500">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter challenge description"
          className="rounded-md p-3 border border-gray-300"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-gray-500">Points</label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          className="rounded-md p-3 border border-gray-300"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-gray-500">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md p-3 border border-gray-300"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Display error message if there's an error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Submit button */}
      <button
        className={`btn btn-primary mt-5 w-full text-white rounded-full ${loading ? "cursor-not-allowed" : ""}`}
        type="submit"
        disabled={loading}
      >
        {loading && <span className="loading loading-spinner"></span>}
        {loading ? "Updating Challenge..." : "Update Challenge"}
      </button>
    </form>
  );
};

export default EditChallengeForm;
