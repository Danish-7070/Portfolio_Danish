import React, { useEffect, useState } from 'react';
import { Mail, MessageSquare, Calendar, X } from 'lucide-react';
import AdminSiderbar from '../../components/sidebar/sidebar';
import dfawallpaper from "../../assets/dfa-wallpaper.png";
import axios from 'axios';

const URL = import.meta.env.VITE_BACKEND_URL;

const ContactFormsAdmin = () => {
    const [contactForms, setContactForms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedMessages, setExpandedMessages] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMessage, setCurrentMessage] = useState("");
    const [currentSubject, setCurrentSubject] = useState("");

    const fetchContactForms = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${URL}/contact`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${localStorage.getItem("token")}`,
                },
            });
            const data = response.data;
            if (response.status >= 400) {
                throw new Error(data.message);
            }
            console.log('response of contact forms', response)
            setContactForms(data.contactForms);
        } catch (error) {
            console.log('error occurred', error)
            setError(error.response?.data?.message || "Some Error Occurred");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchContactForms();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Open Modal and Set Message
    const openModal = (subject, message) => {
        setCurrentSubject(subject);
        setCurrentMessage(message);
        setIsModalOpen(true);
    };


    // Close Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentMessage(""); // Clear message when modal is closed
    };

    return (
        <div
            style={{
                backgroundImage: `url(${dfawallpaper})`,
                backgroundSize: "cover",
            }}
            className="flex flex-col min-h-screen"
        >
            <AdminSiderbar />
            <div className="container mx-auto px-4 py-8 mt-14">
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {error ? (
                            <div
                                role="alert"
                                className="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center justify-between"
                            >
                                <span className="block sm:inline">{error}</span>
                                <button
                                    onClick={() => setError(null)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <>
                                {contactForms.map((form) => (
                                    <div
                                        key={form._id}
                                        className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                                        style={{
                                            borderTop: `4px solid #9CE37D`
                                        }}
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center mb-4">
                                                <Mail className="mr-3 text-[#9CE37D]" size={24} />
                                                <h3 className="text-xl font-semibold text-gray-800 truncate">{form.email}</h3>
                                            </div>

                                            <div className="flex items-center mb-4">
                                                <MessageSquare className="mr-3 text-[#9CE37D]" size={24} />
                                                <p className="text-lg text-gray-700 font-medium truncate">Subject: {form.subject}</p>
                                            </div>

                                            <div className="flex items-center mb-4">
                                                <Calendar className="mr-3 text-[#9CE37D]" size={24} />
                                                <p className="text-gray-600">{formatDate(form.createdAt)}</p>
                                            </div>

                                            <button
                                                onClick={() => openModal(form.subject, form.message)} // Pass subject and message
                                                className="w-full py-2 rounded-md transition-all duration-300"
                                                style={{
                                                    backgroundColor: '#9CE37D',
                                                    color: 'white',
                                                }}
                                            >
                                                Show Message
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Subject: {currentSubject}</h2> {/* Display subject */}
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="text-gray-800">{currentMessage}</div> {/* Display message */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContactFormsAdmin;
