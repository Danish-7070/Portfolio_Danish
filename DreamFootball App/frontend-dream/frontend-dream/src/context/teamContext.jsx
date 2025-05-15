import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';

const URL = import.meta.env.VITE_BACKEND_URL;

export const TeamContext = createContext();

export const useTeam = () => {
    const context = React.useContext(TeamContext);
    if (!context) {
        throw new Error('useTeam must be used within a TeamProvider');
    }
    return context;
}

export const TeamProvider = ({ children }) => {
    const [currTeam, setCurrTeam] = useState(null);
    const [isFetchingTeam, setIsFetchingTeam] = useState(true);
    const [teamFetchingError, setTeamFetchingError] = useState(null);

    const fetchTeam = async () => {
        const teamToken = localStorage.getItem('teamToken');
        if (!teamToken) {
            setIsFetchingTeam(false);
            return;
        }

        try {
            setIsFetchingTeam(true);
            setTeamFetchingError(null);
            
            // Use the new auth profile endpoint
            const response = await axios.get(`${URL}/auth/team/profile`, {
                headers: {
                    Authorization: teamToken
                },
            });
            
            if (response.status >= 400) {
                throw new Error(response.data.message || "An error occurred");
            }
            
            setCurrTeam(response.data.team);
        } catch (error) {
            console.log('Error fetching team profile:', error.response?.data?.message || error.message);
            setTeamFetchingError(error.response?.data?.message || "An error occurred");
            
            // Clear token if unauthorized/forbidden (token invalid or expired)
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('teamToken');
            }
        } finally {
            setIsFetchingTeam(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('teamToken');
        setCurrTeam(null);
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    return (
        <TeamContext.Provider value={{ 
            currTeam, 
            isFetchingTeam, 
            teamFetchingError,
            fetchTeam,
            logout
        }}>
            {children}
        </TeamContext.Provider>
    );
};