import React, { useEffect, useState } from "react";
import GroundCard from "../../components/ground/groundCard";
import { dummyGroundData } from "./dummyGroundData"; // Assuming you have this file
import EditGroundForm from "../../components/ground/editGroundForm";
import AdminSiderbar from "../../components/sidebar/sidebar";
import axios from "axios";
const URL = import.meta.env.VITE_BACKEND_URL;

const EditGroundPage = () => {
    // const [grounds, setGrounds] = useState(dummyGroundData);
    const [grounds, setGrounds] = useState([]);
    const [selectedGround, setSelectedGround] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchGrounds = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${URL}/grounds`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('token')}`,
                },
            });
            const data = response.data;
            if (response.status >= 400) {
                console.log('response', response);
                console.log('data', data);
                console.log('error', error);
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




    const handleEdit = (ground) => {
        setSelectedGround(ground);
    };

    const handleSubmit = async (updatedGround) => {
        try {
            const { _id } = selectedGround;
            setLoading(true);
            setError(null);
            const response = await axios.put(`${URL}/grounds/${_id}`, updatedGround, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('token')}`,
                },
            });
            const data = response.data;
            if (response.status >= 400) {
                throw new Error(data.message);
            }
            await fetchGrounds();
            setSelectedGround(null);
        }
        catch (error) {
            console.log('error is:', error.response.data.message);
            setError(error.response.data.message);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <AdminSiderbar />
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
                </div>

            ) : (
                <div className=" flex flex-col justify-start relative  gap-4 mt-5">
                    {selectedGround && <div className="absolute top-0 left-0 border-primary border-2 rounded-md p-1 text-center bg-primary text-white cursor-pointer"
                        onClick={() => setSelectedGround(null)}
                    >
                        {"Back"}
                    </div>
                    }
                    {error && (
                        <div role="alert" className="alert alert-error leading-tight flex justify-between  py-1 w-1/2 mx-auto">
                            <span>{error}</span>
                            <div>
                                <button className="btn btn-sm border-none " onClick={() => setError(null)}>x</button>
                            </div>
                        </div>
                    )}
                    {selectedGround ? (
                        <EditGroundForm groundData={selectedGround} onSubmit={handleSubmit} />
                    ) : (
                        <div className="flex flex-col gap-4">
                            {grounds.length > 0 ? (
                                grounds.map((ground) => (
                                    <GroundCard key={ground._id} ground={ground} onEdit={handleEdit} type="edit" />
                                ))
                            ) : (
                                <p className="text-gray-500">No grounds available.</p>
                            )}
                        </div>
                    )}
                </div>
            )
            }
        </div>
    );
};

export default EditGroundPage;
