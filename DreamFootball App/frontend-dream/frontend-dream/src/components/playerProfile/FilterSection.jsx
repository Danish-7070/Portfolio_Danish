import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { BsFilterLeft } from 'react-icons/bs';
import { TbFilterOff } from 'react-icons/tb';

const FilterSection = ({ 
    searchTerm, 
    selectedTeam, 
    teams, 
    onSearchChange, 
    onTeamFilterChange, 
    onClearFilters 
}) => {
    return (
        <div className="mb-8 bg-customDark2 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search input */}
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-white/60" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search player name..."
                        value={searchTerm}
                        onChange={onSearchChange}
                        className="bg-white/20 text-white pl-10 pr-4 py-2 rounded-lg w-full placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-customDark"
                    />
                </div>

                {/* Team filter dropdown */}
                <div className="relative flex-grow sm:flex-grow-0 sm:w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BsFilterLeft className="text-white/60" />
                    </div>
                    <select
                        value={selectedTeam}
                        onChange={onTeamFilterChange}
                        className="bg-white/20 text-white pl-10 pr-4 py-2 rounded-lg w-full appearance-none focus:outline-none focus:ring-2 focus:ring-customDark"
                    >
                        <option value="" className='bg-customDark2'>All Teams</option>
                        {teams.map(team => (
                            <option key={team._id} value={team._id} className='bg-customDark2'>
                                {team.teamName}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>

                {/* Clear filters button */}
                {(searchTerm || selectedTeam) && (
                    <button
                        onClick={onClearFilters}
                        className="bg-customDark hover:bg-customDark2 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <TbFilterOff className="mr-2" /> Clear
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterSection;