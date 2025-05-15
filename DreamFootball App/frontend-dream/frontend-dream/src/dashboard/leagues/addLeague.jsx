import React, { useEffect, useState } from 'react';
import LeagueForm from './leagueForm';
import AdminSiderbar from '../../components/sidebar/sidebar';
import dfawallpaper from "../../assets/dfa-wallpaper.png";
import { dummyLeaguesData } from './dummyLeaguesData';
import axios from 'axios';
import toast from 'react-hot-toast';

const URL = import.meta.env.VITE_BACKEND_URL;

const AddLeague = ({ setActiveTab }) => {
    // const [leagues, setLeagues] = useState(dummyLeaguesData);
    const [leagues, setLeagues] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddLeague = async (newLeague) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(`${URL}/leagues`, newLeague, {
                headers: {
                    'Content-Type': 'multipart/form-data',  // This is necessary for handling files
                    Authorization: `${localStorage.getItem('token')}`
                }
            });
            const data = response.data;
            if (response.status >= 400) {
                throw new Error(data.message);
            }
            toast.success('League added successfully');
            setActiveTab('View Leagues');
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${URL}/teams`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('token')}`
                }
            });
            const data = response.data;
            if (response.status >= 400) {
                throw new Error(data.message);
            }
            setTeams(data.teams);
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                backgroundImage: `url(${dfawallpaper})`,
                backgroundSize: "cover",
            }}
        >
            <AdminSiderbar />
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
                </div>

            ) : (
                <>
                {error && (
                            <div role="alert" className="alert alert-error leading-tight flex justify-between  py-1 w-3/4 mx-auto">
                                <span>{error}</span>
                                <div>
                                    <button className="btn btn-sm border-none " onClick={() => setError(null)}>x</button>
                                </div>
                            </div>
                        )}
                    {/* <h2 className="text-2xl font-semibold">Add New League</h2> */}
                    <LeagueForm teamsData={teams} onSubmit={handleAddLeague} />
                </>
            )}
        </div>

    );
};

export default AddLeague;
