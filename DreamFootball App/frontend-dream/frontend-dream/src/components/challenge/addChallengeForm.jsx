import React, { useState } from 'react';
import { dummyChallengeData } from '../../dashboard/challenges/dummyChallengesData';

const AddChallengeForm = () => {
  const [challenges, setChallenges] = useState(dummyChallengeData);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState();
  const [status, setStatus] = useState("inactive");
  const [createdAt, setCreatedAt] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newChallenge = {
        id: challenges.length + 1,
        title,
        description,
        points: Number(points),
        status,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      };

      console.log('Challenge added successfully', newChallenge);
      setChallenges([...challenges, newChallenge]);
      resetForm();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPoints(0);
    setStatus("inactive");
    setCreatedAt("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Add a New Challenge</h1>

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
          min="0"
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

      <div className="flex flex-col gap-2">
        <label className="text-gray-500">Creation Date</label>
        <input
          type="date"
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
          className="rounded-md p-3 border border-gray-300"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        className={`btn btn-primary mt-5 w-full text-white rounded-full ${loading ? "cursor-not-allowed" : ""}`}
        type="submit"
        disabled={loading}
      >
        {loading && <span className="loading loading-spinner"></span>}
        {loading ? "Adding Challenge..." : "Add Challenge"}
      </button>
    </form>
  );
};

export default AddChallengeForm;
