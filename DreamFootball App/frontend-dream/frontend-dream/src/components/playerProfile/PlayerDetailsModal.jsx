import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaFootballBall, FaHandsHelping, FaTrophy, FaChartLine, FaPercentage, FaUsers, FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { GiGoalKeeper, GiWhistle, GiSoccerField, GiSoccerBall } from 'react-icons/gi';
import { IoStatsChart } from 'react-icons/io5';
import { MdOutlineSports, MdScore, MdStars } from 'react-icons/md';
import { BiLineChart } from 'react-icons/bi';

// Stat card component for reusable statistics display
const StatCard = ({ icon, value, label, bgColor = "bg-gray-100", iconColor = "text-custom", valueColor = "text-gray-800" }) => (
    <div className={`${bgColor} rounded-lg p-4 flex flex-col items-center justify-center shadow-sm`}>
        <div className="mb-2">{React.cloneElement(icon, { className: iconColor, size: 22 })}</div>
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
    </div>
);

const PlayerDetailsModal = ({ player, onClose }) => {
    const defaultTeamImage = 'https://via.placeholder.com/50?text=Team';

    // Calculate contribution percentage and impact score
    const contributionPercentage = ((parseInt(player.goals) + parseInt(player.assists)) / Math.max(1, player.matchesPlayed) * 100).toFixed(1);
    const impactScore = ((parseInt(player.goals) * 1.5) + parseInt(player.assists) + (parseInt(player.cleanSheets) * 2)).toFixed(1);

    // Close modal when clicking outside
    const handleOutsideClick = (e) => {
        if (e.target.id === 'modal-backdrop') {
            onClose();
        }
    };

    return (
        <div 
            id="modal-backdrop"
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={handleOutsideClick}
        >
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header with player name and team */}
                <div className="bg-gradient-to-r from-customDark to-custom p-6 text-white flex justify-between items-center">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold">{player.player.name}</h2>
                        {player.player.team && (
                            <div className="flex items-center mt-1">
                                <img 
                                    src={player.player.team.image?.url || defaultTeamImage} 
                                    alt={player.player.team.teamName} 
                                    className="w-6 h-6 rounded-full object-cover mr-2"
                                    onError={(e) => { e.target.src = defaultTeamImage }}
                                />
                                <span className="text-white/90">{player.player.team.teamName}</span>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={onClose}
                        className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                        <IoMdClose size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-black">
                        {/* Key statistics summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <MdStars className="mr-2 text-yellow-500" /> Performance Summary
                                </h3>
                                
                                <div className="space-y-4">
                                    {/* Match record */}
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                        <div className="flex items-center">
                                            <GiWhistle className="text-gray-500 mr-2" />
                                            <span className="font-semibold">Matches</span>
                                        </div>
                                        <span className="text-xl font-bold">{player.matchesPlayed}</span>
                                    </div>
                                    
                                    {/* Goals */}
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                        <div className="flex items-center">
                                            <FaFootballBall className="text-custom mr-2" />
                                            <span className="font-semibold">Goals</span>
                                        </div>
                                        <span className="text-xl font-bold">{player.goals}</span>
                                    </div>
                                    
                                    {/* Assists */}
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                        <div className="flex items-center">
                                            <FaHandsHelping className="text-customDark mr-2" />
                                            <span className="font-semibold">Assists</span>
                                        </div>
                                        <span className="text-xl font-bold">{player.assists}</span>
                                    </div>
                                    
                                    {/* Clean Sheets */}
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                        <div className="flex items-center">
                                            <GiGoalKeeper className="text-blue-500 mr-2" />
                                            <span className="font-semibold">Clean Sheets</span>
                                        </div>
                                        <span className="text-xl font-bold">{player.cleanSheets}</span>
                                    </div>
                                    
                                    {/* Impact Score */}
                                    
                                </div>
                            </div>
                        </div>
                        
                        {/* Main statistics area */}
                        <div className="lg:col-span-2">
                            <div className="space-y-6">
                                {/* Per match statistics */}
                                <div>
                                    <h4 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                        <IoStatsChart className="mr-2 text-custom" /> 
                                        Per Match Performance
                                    </h4>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <StatCard 
                                            icon={<FaFootballBall />}
                                            value={player.goalsPerMatch}
                                            label="Goals/Match"
                                            bgColor="bg-custom/10"
                                        />
                                        <StatCard 
                                            icon={<FaHandsHelping />}
                                            value={player.assistsPerMatch}
                                            label="Assists/Match"
                                            bgColor="bg-customDark/10"
                                            iconColor="text-customDark"
                                        />
                                    </div>
                                </div>

                                {/* Match record */}
                                <div>
                                    <h4 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                        <FaTrophy className="mr-2 text-yellow-500" /> 
                                        Match Record
                                    </h4>
                                    
                                    <div className="grid grid-cols-3 gap-4">
                                        <StatCard 
                                            icon={<FaCaretUp />}
                                            value={player.winCount}
                                            label="Wins"
                                            bgColor="bg-green-100"
                                            iconColor="text-green-600"
                                            valueColor="text-green-700"
                                        />
                                        
                                        <StatCard 
                                            icon={<FaUsers />}
                                            value={player.drawCount}
                                            label="Draws"
                                            bgColor="bg-gray-100"
                                            iconColor="text-gray-600"
                                            valueColor="text-gray-700"
                                        />
                                        
                                        <StatCard 
                                            icon={<FaCaretDown />}
                                            value={player.lossCount}
                                            label="Losses"
                                            bgColor="bg-red-100"
                                            iconColor="text-red-600"
                                            valueColor="text-red-700"
                                        />
                                    </div>
                                </div>

                                {/* Win percentage visualization */}
                                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                    <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                                        <GiSoccerField className="mr-2 text-green-600" /> 
                                        Performance Distribution
                                    </h4>
                                    
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-600">Win Percentage</span>
                                            <span className="text-sm font-medium text-gray-800">{player.winPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div 
                                                className="bg-green-500 h-3 rounded-full" 
                                                style={{ width: `${Math.min(100, player.winPercentage)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full h-12 bg-gray-100 rounded-lg overflow-hidden flex">
                                        {player.winCount > 0 && (
                                            <div 
                                                className="h-full bg-green-500 flex items-center justify-center text-white font-medium"
                                                style={{ width: `${(player.winCount / player.matchesPlayed) * 100}%` }}
                                            >
                                                {Math.round((player.winCount / player.matchesPlayed) * 100)}%
                                            </div>
                                        )}
                                        {player.drawCount > 0 && (
                                            <div 
                                                className="h-full bg-gray-400 flex items-center justify-center text-white font-medium"
                                                style={{ width: `${(player.drawCount / player.matchesPlayed) * 100}%` }}
                                            >
                                                {Math.round((player.drawCount / player.matchesPlayed) * 100)}%
                                            </div>
                                        )}
                                        {player.lossCount > 0 && (
                                            <div 
                                                className="h-full bg-red-500 flex items-center justify-center text-white font-medium"
                                                style={{ width: `${(player.lossCount / player.matchesPlayed) * 100}%` }}
                                            >
                                                {Math.round((player.lossCount / player.matchesPlayed) * 100)}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Wins</span>
                                        <span>Draws</span>
                                        <span>Losses</span>
                                    </div>
                                </div>
                                
                                {/* Additional performance metrics */}
                                <div>
                                    <h4 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                        <MdScore className="mr-2 text-custom" /> 
                                        Performance Metrics
                                    </h4>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-r from-customDark/10 to-custom/10 rounded-lg p-4">
                                            <div className="flex items-center mb-2">
                                                <GiSoccerBall className="mr-2 text-custom" />
                                                <h5 className="font-semibold">Goal Conversion</h5>
                                            </div>
                                            <p className="text-2xl font-bold">{player.goals > 0 ? (player.goals / player.matchesPlayed * 100).toFixed(1) : 0}%</p>
                                            <p className="text-sm text-gray-600">{player.goals} goals across {player.matchesPlayed} matches</p>
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerDetailsModal;