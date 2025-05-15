import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';
import axios from 'axios';
import { useTeam } from '../../context/teamContext';
import { formatDate } from '../../utils/formatDate';

const URL = import.meta.env.VITE_BACKEND_URL;

const CustomerLeagues = () => {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [visibleLeaguesCount, setVisibleLeaguesCount] = useState(4); // Default to showing 4 leagues
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
            console.log('currTeam', currTeam)
            console.log('response data leagues', data.leagues)
            // const specificLeagues = data.leagues.filter(league => league.teams.map((team) => team._id).includes(currTeam._id));
            // setLeagues(specificLeagues);
            setLeagues(data.leagues);
            // console.log('specificLeagues', specificLeagues)
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

    const handleShowMoreLeagues = () => {
        setVisibleLeaguesCount((prevCount) => (prevCount === 4 ? leagues.length : 4)); // Toggle between 4 and all leagues
    };

    return (
        <div className="bg-custom text-white min-h-screen">
            <Navbar />
            <div className="p-10 max-sm:p-5 mt-20">
                <h1 className="text-4xl font-bold text-center text-red-500 mb-10">Your Football Leagues</h1>
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-200"></div>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div role="alert" className="alert alert-error leading-tight flex justify-between  py-1 w-[84%] mx-auto mb-2">
                                <span>{error}</span>
                                <div>
                                    <button className="btn btn-sm border-none " onClick={() => setError(null)}>x</button>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {leagues.length === 0 ? (
                                <h2 className=" font-semibold mb-4">No Leagues Available.
                                {
                                    !currTeam && " Please login your team to view leagues"
                                }
                                </h2>
                            )
                                :
                                (
                                    <>
                                        {leagues.slice(0, visibleLeaguesCount).map((league, index) => (
                                            <div
                                                key={index}
                                                className="bg-customDark2 transition-all duration-300 p-6 rounded-lg shadow-lg cursor-pointer"
                                                onClick={() => handleLeagueClick(league._id)}
                                            >
                                                <h2 className="text-2xl font-semibold mb-4">{league.leagueName}</h2>
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

export default CustomerLeagues;
