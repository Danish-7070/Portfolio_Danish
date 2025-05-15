import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';

const URL = import.meta.env.VITE_BACKEND_URL;

export const AdminContext = createContext();

export const useAdmin = () => {
    const context = React.useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}

export const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [fetchingAdmin, setFetchingAdmin] = useState(true);
    const [errorFetchingAdmin, setErrorFetchingAdmin] = useState(null);

    const fetchAdmin = async () => {
        const adminToken = localStorage.getItem('token');
        if (!adminToken) {
            setFetchingAdmin(false);
            return;
        }

        try {
            setFetchingAdmin(true);
            setErrorFetchingAdmin(null);
            
            const response = await axios.get(`${URL}/auth/admin/profile`, {
                headers: {
                    Authorization: adminToken
                },
            });
            
            if (response.status >= 400) {
                throw new Error(response.data.message || "An error occurred");
            }
            
            setAdmin(response.data.admin);
        } catch (error) {
            console.log('Error fetching admin profile:', error.response?.data?.message || error.message);
            setErrorFetchingAdmin(error.response?.data?.message || "An error occurred");
            
            // Clear token if unauthorized/forbidden (token invalid or expired)
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('adminToken');
            }
        } finally {
            setFetchingAdmin(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setAdmin(null);
    };

    useEffect(() => {
        fetchAdmin();
    }, []);

    return (
        <AdminContext.Provider value={{ 
            admin, 
            fetchingAdmin, 
            errorFetchingAdmin, 
            fetchAdmin,
            logout
        }}>
            {children}
        </AdminContext.Provider>
    );
};