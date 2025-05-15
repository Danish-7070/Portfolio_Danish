import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaFootballBall, FaTrophy, FaChartLine, FaPercentage, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { GiWhistle, GiSoccerField, GiSoccerBall, GiSoccerKick } from 'react-icons/gi';
import { IoStatsChart } from 'react-icons/io5';
import { MdOutlineSports, MdScore, MdStars } from 'react-icons/md';
import { BiFootball, BiCalendar } from 'react-icons/bi';

// Stat card component for reusable statistics display
const StatCard = ({ icon, value, label, bgColor = "bg-gray-100", iconColor = "text-custom", valueColor = "text-gray-800" }) => (
    <div className={`${bgColor} rounded-lg p-4 flex flex-col items-center justify-center shadow-sm`}>
        <div className="mb-2">{React.cloneElement(icon, { className: iconColor, size: 22 })}</div>
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
    </div>
);

// Match card component for displaying individual matches
const MatchCard = ({ match, currentTeamId }) => {
    const isTeamA = match.teamA._id === currentTeamId;
    const opponent = isTeamA ? match.teamB : match.teamA;
    const yourScore = isTeamA ? match.score.teamA : match.score.teamB;
    const opponentScore = isTeamA ? match.score.teamB : match.score.teamA;
    const isWin = match.winner && match.winner._id === currentTeamId;
    const isLoss = match.winner && match.winner._id !== currentTeamId;
    const isDraw = !match.winner;
    
    let resultBgColor = "bg-gray-100";
    let resultTextColor = "text-gray-700";
    let resultLabel = "Draw";
    
    if (isWin) {
        resultBgColor = "bg-green-100";
        resultTextColor = "text-green-700";
        resultLabel = "Win";
    } else if (isLoss) {
        resultBgColor = "bg-red-100";
        resultTextColor = "text-red-700";
        resultLabel = "Loss";
    }
    
    // Format date
    const matchDate = new Date(match.date);
    const formattedDate = matchDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                        <BiCalendar className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">{formattedDate}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${resultBgColor} ${resultTextColor}`}>
                        {resultLabel}
                    </div>
                </div>
                
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {isTeamA ? (
                                <img 
                                    src={match.teamA.image?.url || "https://via.placeholder.com/50?text=Team"} 
                                    alt={match.teamA.teamName}
                                    className="w-8 h-8 rounded-full object-cover"
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Team" }}
                                />
                            ) : (
                                <img 
                                    src={match.teamB.image?.url || "https://via.placeholder.com/50?text=Team"} 
                                    alt={match.teamB.teamName}
                                    className="w-8 h-8 rounded-full object-cover"
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Team" }}
                                />
                            )}
                        </div>
                        <div>
                            <div className="font-medium">Your Team</div>
                            <div className="text-xl font-bold">{yourScore}</div>
                        </div>
                    </div>
                    
                    <div className="text-sm font-medium text-gray-500">VS</div>
                    
                    <div className="flex items-center space-x-2">
                        <div>
                            <div className="font-medium text-right">{opponent.teamName}</div>
                            <div className="text-xl font-bold text-right">{opponentScore}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <img 
                                src={opponent.image?.url || "https://via.placeholder.com/50?text=Team"} 
                                alt={opponent.teamName}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Team" }}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 flex items-center">
                        <FaTrophy className="text-yellow-500 mr-1" size={12} />
                        <span>{match.league.leagueName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeamDetailsModal2 = ({ team, onClose }) => {
    const [showMatches, setShowMatches] = useState(false);
    const defaultTeamImage = 'https://via.placeholder.com/50?text=Team';

    // Close modal when clicking outside
    const handleOutsideClick = (e) => {
        if (e.target.id === 'modal-backdrop') {
            onClose();
        }
    };

    // Toggle match history view
    const toggleMatchesView = () => {
        setShowMatches(!showMatches);
    };

    return (
        <div 
            id="modal-backdrop"
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={handleOutsideClick}
        >
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header with team name */}
                <div className="bg-gradient-to-r from-customDark to-custom p-6 text-white flex justify-between items-center">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold">{team.team.teamName}</h2>
                        <div className="flex items-center mt-1">
                            <span className="text-white/90">{team.team.city}</span>
                        </div>
                        <div className="inline-flex items-center mt-2 bg-gray-700 bg-opacity-50 rounded-full px-3 py-1">
                            <span className="text-sm font-medium text-gray-200">
                                {team.leaguesParticipated} {team.leaguesParticipated === 1 ? 'League' : 'Leagues'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-800 bg-opacity-50 mr-4 flex items-center justify-center shadow-lg border-2 border-primary">
                            {team.team.image?.url ? (
                                <img 
                                    src={team.team.image.url} 
                                    alt={team.team.teamName} 
                                    className="w-14 h-14 rounded-full object-cover"
                                    onError={(e) => { e.target.src = defaultTeamImage }}
                                />
                            ) : (
                                <BiFootball className="text-4xl text-custom" />
                            )}
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                        >
                            <IoMdClose size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 text-black">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Key statistics summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <MdStars className="mr-2 text-yellow-500" /> Team Summary
                                </h3>
                                
                                <div className="space-y-4">
                                    {/* Matches played - clickable */}
                                    <div 
                                        className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={toggleMatchesView}
                                    >
                                        <div className="flex items-center">
                                            <GiWhistle className="text-gray-500 mr-2" />
                                            <span className="font-semibold">Matches</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-xl font-bold mr-2">{team.matchesPlayed}</span>
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Goals scored */}
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                        <div className="flex items-center">
                                            <FaFootballBall className="text-custom mr-2" />
                                            <span className="font-semibold">Goals Scored</span>
                                        </div>
                                        <span className="text-xl font-bold">{team.goalsScored}</span>
                                    </div>
                                    
                                    {/* Goals conceded */}
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                        <div className="flex items-center">
                                            <GiSoccerKick className="text-red-500 mr-2" />
                                            <span className="font-semibold">Goals Conceded</span>
                                        </div>
                                        <span className="text-xl font-bold">{team.goalsConceded}</span>
                                    </div>
                                    
                                    {/* Clean Sheets */}
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                        <div className="flex items-center">
                                            <FaCheck className="text-green-500 mr-2" />
                                            <span className="font-semibold">Clean Sheets</span>
                                        </div>
                                        <span className="text-xl font-bold">{team.cleanSheets}</span>
                                    </div>
                                    
                                    {/* Total Points */}
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm bg-yellow-50">
                                        <div className="flex items-center">
                                            <FaTrophy className="text-yellow-500 mr-2" />
                                            <span className="font-semibold">Total Points</span>
                                        </div>
                                        <span className="text-xl font-bold">{team.points}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Main content area - conditionally show matches or stats */}
                        <div className="lg:col-span-2">
                            {showMatches ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <button 
                                            onClick={toggleMatchesView}
                                            className="flex items-center text-custom hover:text-customDark transition-colors"
                                        >
                                            <FaArrowLeft className="mr-2" /> 
                                            <span>Back to Statistics</span>
                                        </button>
                                        
                                        <div className="text-sm text-gray-500">
                                            {team.matchesPlayed} {team.matchesPlayed === 1 ? 'match' : 'matches'} played
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                        <GiWhistle className="mr-2 text-custom" /> Match History
                                    </h3>
                                    
                                    {team.matches && team.matches.length > 0 ? (
                                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                            {team.matches.map((match, index) => (
                                                <MatchCard 
                                                    key={match._id || index} 
                                                    match={match} 
                                                    currentTeamId={team.team._id}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                                            <GiSoccerField className="mx-auto text-gray-400 text-4xl mb-2" />
                                            <p className="text-gray-500">No match data available</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Match record visualization */}
                                    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                                            <GiSoccerField className="mr-2 text-green-600" /> 
                                            Match Record
                                        </h4>
                                        
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-gray-600">Win Percentage</span>
                                                <span className="text-sm font-medium text-gray-800">{team.winPercentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                <div 
                                                    className="bg-green-500 h-3 rounded-full" 
                                                    style={{ width: `${Math.min(100, team.winPercentage)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <div className="w-full h-12 bg-gray-100 rounded-lg overflow-hidden flex">
                                            {team.winCount > 0 && (
                                                <div 
                                                    className="h-full bg-green-500 flex items-center justify-center text-white font-medium"
                                                    style={{ width: `${(team.winCount / team.matchesPlayed) * 100}%` }}
                                                >
                                                    {Math.round((team.winCount / team.matchesPlayed) * 100)}%
                                                </div>
                                            )}
                                            {team.drawCount > 0 && (
                                                <div 
                                                    className="h-full bg-gray-400 flex items-center justify-center text-white font-medium"
                                                    style={{ width: `${(team.drawCount / team.matchesPlayed) * 100}%` }}
                                                >
                                                    {Math.round((team.drawCount / team.matchesPlayed) * 100)}%
                                                </div>
                                            )}
                                            {team.lossCount > 0 && (
                                                <div 
                                                    className="h-full bg-red-500 flex items-center justify-center text-white font-medium"
                                                    style={{ width: `${(team.lossCount / team.matchesPlayed) * 100}%` }}
                                                >
                                                    {Math.round((team.lossCount / team.matchesPlayed) * 100)}%
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span className="flex items-center">
                                                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div> 
                                                Wins ({team.winCount})
                                            </span>
                                            <span className="flex items-center">
                                                <div className="w-3 h-3 bg-gray-400 rounded-full mr-1"></div> 
                                                Draws ({team.drawCount})
                                            </span>
                                            <span className="flex items-center">
                                                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div> 
                                                Losses ({team.lossCount})
                                            </span>
                                        </div>
                                    </div>

                                    {/* Per match statistics */}
                                    <h4 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                        <IoStatsChart className="mr-2 text-custom" /> 
                                        Per Match Performance
                                    </h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <StatCard 
                                            icon={<FaFootballBall />}
                                            value={team.goalsPerMatch}
                                            label="Goals/Match"
                                            bgColor="bg-custom/10"
                                        />
                                        <StatCard 
                                            icon={<GiSoccerKick />}
                                            value={team.goalsConcededPerMatch}
                                            label="Conceded/Match"
                                            bgColor="bg-red-100"
                                            iconColor="text-red-500"
                                        />
                                        <StatCard 
                                            icon={<FaTrophy />}
                                            value={team.pointsPerMatch}
                                            label="Points/Match"
                                            bgColor="bg-yellow-100"
                                            iconColor="text-yellow-600"
                                            valueColor="text-yellow-700"
                                        />
                                        <StatCard 
                                            icon={<GiSoccerBall />}
                                            value={team.goalDifference}
                                            label="Goal Difference"
                                            bgColor={team.goalDifference >= 0 ? "bg-green-100" : "bg-red-100"}
                                            iconColor={team.goalDifference >= 0 ? "text-green-600" : "text-red-600"}
                                            valueColor={team.goalDifference >= 0 ? "text-green-700" : "text-red-700"}
                                        />
                                    </div>
                                    
                                    {team.assistsCount > 0 && (
                                        <div className="bg-gradient-to-r from-customDark/10 to-custom/10 rounded-lg p-4 mt-4">
                                            <div className="flex items-center mb-2">
                                                <MdScore className="mr-2 text-custom" />
                                                <h5 className="font-semibold">Team Assists</h5>
                                            </div>
                                            <p className="text-2xl font-bold">{team.assistsCount}</p>
                                            <p className="text-sm text-gray-600">Total assists across all matches</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamDetailsModal2;