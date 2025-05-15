import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';

const URL = import.meta.env.VITE_BACKEND_URL;

export const UserContext = createContext();

export const useUser = () => {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export const UserProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [fetchingCustomer, setFetchingCustomer] = useState(true);
    const [errorFetchingCustomer, setErrorFetchingCustomer] = useState(null);

    const fetchCustomer = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setFetchingCustomer(false);
            return;
        }

        try {
            setFetchingCustomer(true);
            setErrorFetchingCustomer(null);
            
            // Use the new auth profile endpoint
            const response = await axios.get(`${URL}/auth/customer/profile`, {
                headers: {
                    Authorization: token
                },
            });
            
            if (response.status >= 400) {
                throw new Error(response.data.message || "An error occurred");
            }
            
            setCustomer(response.data.customer);
        } catch (error) {
            console.log('Error fetching customer profile:', error.response?.data?.message || error.message);
            setErrorFetchingCustomer(error.response?.data?.message || "An error occurred");
            
            // Clear token if unauthorized/forbidden (token invalid or expired)
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('token');
            }
        } finally {
            setFetchingCustomer(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setCustomer(null);
    };

    useEffect(() => {
        fetchCustomer();
    }, []);

    return (
        <UserContext.Provider value={{ 
            customer, 
            fetchingCustomer, 
            errorFetchingCustomer, 
            fetchCustomer,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
};