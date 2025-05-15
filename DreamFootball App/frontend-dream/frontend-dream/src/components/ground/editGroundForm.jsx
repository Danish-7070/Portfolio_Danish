import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditGroundForm = ({ groundData, onSubmit }) => {
  const navigate = useNavigate();

  // Initialize form fields with the passed ground data
  const [name, setName] = useState(groundData?.name || "");
  const [address, setAddress] = useState(groundData?.address || "");
  const [phone, setPhone] = useState(groundData?.phone || "");
  const [groundType, setGroundType] = useState(groundData?.groundType || "");
  const [city, setCity] = useState(groundData?.city || "");
  const [startTime, setStartTime] = useState(groundData?.startTime || "10:00");
  const [endTime, setEndTime] = useState(groundData?.endTime || "11:00");  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rateWithLights, setRateWithLights] = useState(groundData?.rateWithLights || 0);
  const [rateWithoutLights, setRateWithoutLights] = useState(groundData?.rateWithoutLights || 0);

  useEffect(() => {
    // Populate form with the passed ground data when the component is mounted
    if (groundData) {
      setName(groundData.name);
      setAddress(groundData.address);
      setPhone(groundData.phone);
      setGroundType(groundData.groundType);
      setCity(groundData.city || "");
      setStartTime(groundData.startTime);
      setEndTime(groundData.endTime);
    }
  }, [groundData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedGround = {
        ...groundData, // Keep the id and other static fields
        name,
        address,
        phone,
        groundType,
        city,
        startTime,
        endTime,
        rateWithLights,
        rateWithoutLights,
      };

      // Call the onSubmit function passed as a prop to update the ground data
      onSubmit(updatedGround);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4 w-full px-4 py-10 mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Edit Ground</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-gray-500">Ground Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g Dream Football Arena"
              className="rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-500">Ground Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g 1234 Dream Football Arena"
              className="rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-gray-500">Ground Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g 123456789"
              className="rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-500">Ground Type</label>
            <select
              value={groundType}
              onChange={(e) => setGroundType(e.target.value)}
              className="rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select Ground Type</option>
              <option value="Football">Football</option>
              <option value="Cricket">Cricket</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-gray-500">Ground Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-500">Ground End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-gray-500">Rate With Lights</label>
              <input
                type="number"
                min="0"
                value={rateWithLights}
                onChange={(e) => setRateWithLights(e.target.value)}
                placeholder="e.g 1000"
                className="rounded-md p-3 border border-gray-300"
                required
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-gray-500">Rate Without Lights</label>
              <input
                type="number"
                min="0"
                value={rateWithoutLights}
                onChange={(e) => setRateWithoutLights(e.target.value)}
                placeholder="e.g 800"
                className="rounded-md p-3 border border-gray-300"
                required
              />
            </div>
          </div>

        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-1/2">
            <label className="text-gray-500">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-md p-3 border border-gray-300"
            >
              <option value="">Select Ground City</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Lahore">Lahore</option>
              <option value="Peshawar">Peshawar</option>
              <option value="Faisalabad">Faisalabad</option>
              <option value="Karachi">Karachi</option>
              <option value="Quetta">Quetta</option>
              <option value="Kashmir">Kashmir</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <button
          className={`btn btn-primary mt-5 w-full max-sm:w-full text-white rounded-full ${loading ? "cursor-not-allowed" : ""}`}
          type="submit"
        >
          {loading && <span className="loading loading-spinner"></span>}
          {loading ? "Processing..." : "Update Ground"}
        </button>
      </form>
    </div>
  );
};

export default EditGroundForm;