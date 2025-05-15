import React, { useState, useEffect } from "react";
import AdminSiderbar from "../../components/sidebar/sidebar";
import { BiStar, BiUser } from "react-icons/bi";
import { AiOutlineTeam } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import { FaRegClipboard } from "react-icons/fa";
import { FaFlagCheckered } from "react-icons/fa";
import { GiAmericanFootballBall } from "react-icons/gi";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;

const Card = ({ icon, title, value, color }) => {
  return (
    <div
      className="relative flex w-full p-5 rounded-lg shadow-md gap-5 min-h-36 justify-between card"
      style={{ background: color }}
    >
      <div
        className="absolute w-20 h-20 rounded-full bg-white text-white opacity-20"
        style={{ bottom: "-30%", right: "-5%" }}
      ></div>

      <div>
        <div>{icon}</div>
        <p className="text-white text-xl">{title}</p>
        <p className="text-3xl font-semibold text-white">{value}</p>
      </div>
    </div>
  );
};

const MainDashboard = () => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/admin/statistics`,{
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      if (response.status >= 400) {
        throw new Error(response.data.message);
      }
      setStatistics(response.data);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <div className="p-5 pt-14 h-screen lg:p-20">
      <AdminSiderbar />
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="p-5 w-full">
          {error && (
            <div
              role="alert"
              className="alert alert-error leading-tight flex justify-between  py-1 w-full mx-auto"
            >
              <span>{error}</span>
              <div>
                <button
                  className="btn btn-sm border-none "
                  onClick={() => setError(null)}
                >
                  x
                </button>
              </div>
            </div>
          )}
            <h1 className="text-2xl font-bold mb-2">
              Welcome to the{" "}
              <span className="text-secondary">Dream Arena Dashboard!</span>
            </h1>
            <p className="text-md mb-5">Following are the statistics of the Dream Arena</p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Card
                icon={<BiUser size={50} className="w-10 rounded-full text-white" />}
                title="Number of Users"
                value={statistics.totalNumberOfUsers || 0}
                color="#208ce4"
              />
              <Card
                icon={<MdEmail size={50} className="w-10 rounded-full text-white" />}
                title="Number of Emails"
                value={statistics.totalNumberOfEmails || 0}
                color="#5b5b5b"
              />
              <Card
                icon={<AiOutlineTeam size={50} className="w-10 rounded-full text-white" />}
                title="Number of Teams"
                value={statistics.totalNumberOfTeams || 0}
                color="#f55252"
              />
              <Card
                icon={<GiAmericanFootballBall size={50} className="w-10 rounded-full text-white" />}
                title="Number of Grounds"
                value={statistics.totalNumberOfGrounds || 0}
                color="#b5b5b5"
              />
              <Card
                icon={<AiOutlineCheck size={50} className="w-10 rounded-full text-white" />}
                title="Confirmed Bookings"
                value={statistics.totalNumberOfConfirmedBookings || 0}
                color="#5b5b5b"
              />
              <Card
                icon={<FaRegClipboard size={50} className="w-10 rounded-full text-white" />}
                title="Completed Bookings"
                value={statistics.totalNumberOfCompletedBookings || 0}
                color="#f7c744"
              />
              <Card
                icon={<FaFlagCheckered size={50} className="w-10 rounded-full text-white" />}
                title="Number of Leagues"
                value={statistics.totalNumberOfLeagues || 0}
                color="#f55252"
              />
              <Card
                icon={<BiStar size={50} className="w-10 rounded-full text-white" />}
                title="Rating"
                value={statistics.averageRating || 0}
                color="#f7c744"
              />
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
          </div>

          <div className="p-5 w-full">
            <h1 className="text-2xl font-bold mb-2">Analysis</h1>
            <p className="text-md mb-5">Following is the analysis of the Dream Arena</p>
            <p className="text-md mb-5 text-gray-700 p-5 border-2 rounded-2xl shadow">
              In the last 30 days, the number of users has increased by 10%. The
              number of bookings has increased by 5%. The number of grounds has
              increased by 10%. The number of leagues has increased by 5%.
            </p>
          </div>
        </>
      )}
    </div>

  );
};

export default MainDashboard;
