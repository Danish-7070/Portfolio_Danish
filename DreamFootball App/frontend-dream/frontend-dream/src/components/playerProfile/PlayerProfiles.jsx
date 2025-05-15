import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrophy, FaFootballBall, FaHandsHelping } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { BsFilterLeft } from 'react-icons/bs';
import { GiGoalKeeper, GiWhistle } from 'react-icons/gi';
import { TbFilterOff } from 'react-icons/tb';
import Navbar from '../navbar/navbar';
import PlayerServices from '../../services/PlayerServices';
import TeamServices from "../../services/TeamServices"

// Components
import PlayerCard from './PlayerCard';
import PlayerDetailsModal from './PlayerDetailsModal';
import FilterSection from './FilterSection';
import ErrorAlert from './ErrorAlert';

const PlayerProfiles = () => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch players statistics
                const playersResponse = await PlayerServices.fetchPlayerStatistics();
                if (playersResponse.error) {
                    throw new Error(playersResponse.error.message || 'Failed to fetch player data');
                }

                // Fetch teams for filter dropdown
                const teamsResponse = await TeamServices.fetchTeamsForCustomers();
                if (teamsResponse.error) {
                    throw new Error(teamsResponse.error.message || 'Failed to fetch team data');
                }

                // console.log('players response', playersResponse.data.data.players);
                setPlayers(playersResponse.data.data.players);
                setTeams(teamsResponse.data.teams);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePlayerSelect = (player) => {
        setSelectedPlayer(player);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleTeamFilterChange = (e) => {
        setSelectedTeam(e.target.value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedTeam('');
    };

    const filteredPlayers = players.filter(player => {
        const matchesSearch = player.player.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTeam = selectedTeam === '' || (player.player.team && player.player.team._id === selectedTeam);
        return matchesSearch && matchesTeam;
    });

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-custom text-white p-20 pt-5 max-sm:p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="mx-auto mt-20 p-10 max-sm:p-2">
                        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-primary mb-2">Player Profiles</h1>
                            <p className="text-primary/80 font-semibold">Browse player statistics and performance data</p>
                        </div>

                        <FilterSection
                            searchTerm={searchTerm}
                            selectedTeam={selectedTeam}
                            teams={teams}
                            onSearchChange={handleSearchChange}
                            onTeamFilterChange={handleTeamFilterChange}
                            onClearFilters={clearFilters}
                        />

                        {filteredPlayers.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-xl font-medium">No players match your filters</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-4 py-2 bg-customDark hover:bg-customDark2 rounded-md flex items-center mx-auto"
                                >
                                    <TbFilterOff className="mr-2" /> Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredPlayers.map((player) => (
                                    <PlayerCard
                                        key={player.player._id}
                                        player={player}
                                        onClick={() => handlePlayerSelect(player)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {showModal && selectedPlayer && (
                    <PlayerDetailsModal
                        player={selectedPlayer}
                        onClose={closeModal}
                    />
                )}
            </div>
        </>
    );
};

export default PlayerProfiles;