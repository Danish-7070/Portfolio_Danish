import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';
import axios from 'axios';
import { useTeam } from '../../context/teamContext';
import wallpaperfb from "../../assets/wallpaperfb.jpg";
import image1 from "../../assets/image1.png";

const URL = import.meta.env.VITE_BACKEND_URL;

const AllLeagues = () => {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [visibleLeaguesCount, setVisibleLeaguesCount] = useState(4); // Show 4 leagues initially
    const navigate = useNavigate();
    const { currTeam } = useTeam();

    const fetchLeagues = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${URL}/teams/leagues`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${localStorage.getItem("token")}`,
                },
            });
            const data = response.data;
            if (response.status >= 400) {
                throw new Error(data.message);
            }
            setLeagues(data.leagues);
        } catch (error) {
            console.log('error occured', error)
            setError(error.response?.data?.message || "Some Error Occurred");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLeagues();
    }, []);

    const handleLeagueClick = (id) => {
        navigate(`/customer/leagues/${id}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const handleShowMoreLeagues = () => {
        setVisibleLeaguesCount((prevCount) => (prevCount === 4 ? leagues.length : 4)); // Toggle between 4 and all leagues
    };

    return (
        <div className="bg-gray-900 text-white" style={{ backgroundImage: `url(${image1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

            <Navbar />
            <div className="p-10 max-sm:p-5 mt-10 min-h-[60vh]">
                <h1 className="text-4xl font-extrabold text-center text-primary mb-10">Football Leagues</h1>
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-200"></div>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div role="alert" className="alert alert-error leading-tight flex justify-between py-1 w-[84%] mx-auto mb-2">
                                <span>{error}</span>
                                <div>
                                    <button className="btn btn-sm border-none " onClick={() => setError(null)}>x</button>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {leagues.length === 0 ? (
                                <h3 className=" font-semibold text-2xl mb-4">No Leagues Available.
                                </h3>
                            ) : (
                                <>
                                    {leagues.slice(0, visibleLeaguesCount).map((league, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 p-6 rounded-lg shadow-lg cursor-pointer"
                                            onClick={() => handleLeagueClick(league._id)}
                                        >
                                            <p className="text-2xl font-semibold mb-4">{league.leagueName}</p>
                                            <p className="text-sm mb-2">
                                                <strong>Start Date:</strong> {formatDate(league.startDate)}
                                            </p>
                                            <p className="text-sm mb-2">
                                                <strong>End Date:</strong> {formatDate(league.endDate)}
                                            </p>
                                            <p className="text-sm">
                                                <strong>Teams Participating:</strong> {league.teams.length}
                                            </p>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                        {leagues.length > 4 && (
                            <button 
                                onClick={handleShowMoreLeagues}
                                className="text-red-500 font-semibold hover:bg-red-500 hover:text-white border-red-500 border-2 p-2 rounded-lg mt-4"
                            >
                                {visibleLeaguesCount === 4 ? 'Show More' : 'Show Less'}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllLeagues;
