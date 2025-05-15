import React from 'react';
import { FaFootballBall, FaHandsHelping, FaTrophy, FaPercentage } from 'react-icons/fa';
import { GiWhistle, GiSoccerKick } from 'react-icons/gi';
import { MdSportsScore } from 'react-icons/md';

const PlayerCard = ({ player, onClick }) => {
    const defaultTeamImage = 'https://via.placeholder.com/30?text=Team';
    
    // Generate background color based on player's win percentage
    const getBackgroundGradient = (winPercentage) => {
        const percentage = parseFloat(winPercentage);
        if (percentage >= 70) return 'from-green-500 to-green-700';
        if (percentage >= 50) return 'from-teal-500 to-teal-700';
        if (percentage >= 30) return 'from-yellow-500 to-yellow-700';
        return 'from-red-400 to-red-600';
    };

    return (
        <div 
            className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer border-2 border-transparent hover:border-customDark"
            onClick={onClick}
        >
            <div className={`relative h-16 bg-gradient-to-r ${getBackgroundGradient(player.winPercentage)} flex items-center justify-between px-4`}>
                <h3 className="text-xl font-bold text-white">{player.player.name}</h3>
                
                {player.player.team && (
                    <div className="flex items-center">
                        <img 
                            src={player.player.team.image?.url || defaultTeamImage} 
                            alt={player.player.team.teamName} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-white"
                            onError={(e) => { e.target.src = defaultTeamImage }}
                        />
                    </div>
                )}
            </div>

            <div className="p-4 bg-white text-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600 font-medium">
                        {player.player.team ? player.player.team.teamName : 'No Team'}
                    </p>
                    <div className="flex items-center text-sm">
                        <FaTrophy className="text-yellow-500 mr-1" />
                        <span className="font-semibold">{player.winPercentage}%</span>
                        <span className="text-gray-500 text-xs ml-1">win rate</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center p-3 bg-gradient-to-b from-custom/10 to-custom/20 rounded-lg border-l-4 border-custom">
                        <FaFootballBall className="text-custom mb-1" />
                        <span className="text-lg font-bold">{player.goals}</span>
                        <span className="text-xs">Goals</span>
                    </div>
                    
                    <div className="flex flex-col items-center p-3 bg-gradient-to-b from-customDark/10 to-customDark/20 rounded-lg border-l-4 border-customDark">
                        <FaHandsHelping className="text-customDark mb-1" />
                        <span className="text-lg font-bold">{player.assists}</span>
                        <span className="text-xs">Assists</span>
                    </div>
                    
                    <div className="flex flex-col items-center p-3 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg border-l-4 border-gray-400">
                        <GiWhistle className="text-gray-600 mb-1" />
                        <span className="text-lg font-bold">{player.matchesPlayed}</span>
                        <span className="text-xs">Matches</span>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Performance Metrics</span>
                        <div className="flex items-center">
                            <span className="mr-4">W: {player.winCount}</span>
                            <span className="mr-4">D: {player.drawCount}</span>
                            <span>L: {player.lossCount}</span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        {player.winCount > 0 && (
                            <div style={{ width: `${(player.winCount / player.matchesPlayed) * 100}%` }} className="h-full bg-green-500 float-left"></div>
                        )}
                        {player.drawCount > 0 && (
                            <div style={{ width: `${(player.drawCount / player.matchesPlayed) * 100}%` }} className="h-full bg-gray-400 float-left"></div>
                        )}
                        {player.lossCount > 0 && (
                            <div style={{ width: `${(player.lossCount / player.matchesPlayed) * 100}%` }} className="h-full bg-red-500 float-left"></div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center text-sm">
                    <GiSoccerKick className="text-custom mr-1" />
                    <span className="text-gray-700">{player.goalsPerMatch} g/m</span>
                </div>
                <div className="flex items-center text-sm">
                    <MdSportsScore className="text-customDark mr-1" />
                    <span className="text-gray-700">{player.assistsPerMatch} a/m</span>
                </div>
              
            </div>
        </div>
    );
};

export default PlayerCard;