import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSiderbar from "../../components/sidebar/sidebar";
import dfawallpaper from "../../assets/dfa-wallpaper.png";
import toast from "react-hot-toast";
const URL = import.meta.env.VITE_BACKEND_URL;

const AddGround = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [groundType, setGroundType] = useState("");
  const [city, setCity] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rateWithLights, setRateWithLights] = useState(0);
  const [rateWithoutLights, setRateWithoutLights] = useState(0);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError(null);
    if (
      name === "" ||
      address === "" ||
      phone === "" ||
      groundType === "" ||
      startTime === "" ||
      endTime === ""
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${URL}/grounds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //jwt from locals storage
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          address,
          phone,
          groundType,
          city,
          startTime,
          endTime,
          rateWithLights,
          rateWithoutLights,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      toast.success("Ground created successfully");
      setActiveTab("Remove Ground");
    } catch (error) {
      console.log('error ha', error)
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${dfawallpaper})`,
        backgroundSize: "cover",
      }}
    >
      <AdminSiderbar />
      <div className="flex flex-col justify-center gap-4 w-full max-sm:w-full max-md:w-2/3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Add a new Ground</h1>
          {error && (
            <div role="alert" className="alert alert-error leading-tight flex justify-between  py-1">
              <span>{`${error}`}</span>
              <div>
                <button className="btn btn-sm border-none " onClick={() => setError(null)}>x</button>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-gray-500">Ground Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g Dream Football Arena"
                className="rounded-md p-3 border border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-gray-500">Ground Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g 1234 Dream Football Arena"
                className="rounded-md p-3 border border-gray-300"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-gray-500">Ground Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g 123456789"
                className="rounded-md p-3 border border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-gray-500">Ground Type</label>
              <select
                value={groundType}
                onChange={(e) => setGroundType(e.target.value)}
                className="rounded-md p-3 border border-gray-300"
              >
                <option value="">Select Ground Type</option>
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-gray-500">Ground Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Start Time"
                className="rounded-md p-3 border border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-gray-500">Ground End Time</label>

              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="End Time"
                className="rounded-md p-3 border border-gray-300"
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
            className={`btn btn-primary mt-5 w-full max-sm:w-full text-white rounded-full ${loading ? "cursor-not-allowed" : ""
              }`}
            type="submit"
          >
            {loading && <span className="loading loading-spinner"></span>}
            {loading ? "Creating Ground..." : "Create Ground"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGround;