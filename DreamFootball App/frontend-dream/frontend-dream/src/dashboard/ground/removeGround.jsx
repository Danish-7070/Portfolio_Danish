import React, { useEffect, useState } from 'react';
import GroundCard from '../../components/ground/groundCard';
import { dummyGroundData } from './dummyGroundData';
import AdminSiderbar from '../../components/sidebar/sidebar';
import axios from 'axios';

const URL = import.meta.env.VITE_BACKEND_URL;
const RemoveGround = () => {
    // const [grounds, setGrounds] = useState([dummyGroundData]);
    const [grounds, setGrounds] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchGrounds = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${URL}/grounds`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            if (response.status>=400) {
                throw new Error(data.message);
            }
            setGrounds(data.grounds);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
            fetchGrounds();
    }, []);



    const removeGround =async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.delete(`${URL}/grounds/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('token')}`,
                },
            });
            const data = response.data;
            if (response.status>=400) {
                throw new Error(data);
            }
            await fetchGrounds();
        } catch (error) {
            console.log('error ha',error)
            setError(error.response.data.message);
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="pt-2 pb-16">
            <AdminSiderbar />
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
                </div>
                
            ) : (
                <div className="flex flex-col  justify-start gap-4 w-full pt-5">
                    <div className="flex flex-col gap-4">
                        {error && (
                            <div role="alert" className="alert alert-error leading-tight flex justify-between  py-1">
                                <span>{error}</span>
                                <div>
                                    <button className="btn btn-sm border-none " onClick={() => setError(null)}>x</button>
                                </div>
                            </div>
                        )}
                        {grounds.length > 0 ? (
                            grounds.map((ground) => (
                                <GroundCard key={ground._id} ground={ground} onRemove={removeGround} />
                            ))
                        ) : (
                            <p className="text-gray-500">No grounds available.</p>
                        )}
                    </div>
                </div>
            )
            }
        </div>
    );
};

export default RemoveGround;
