import React, { useState } from 'react';
import Navbar from '../../components/navbar/navbar';
import registebg from "../../assets/register.png";
import axios from 'axios';

const URL = import.meta.env.VITE_BACKEND_URL;

const ContactUs = () => {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email && subject && message) {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.post(`${URL}/contact`, {
                    email,
                    subject,
                    message
                },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `${localStorage.getItem('token')}`
                        }
                    }
                );
                const data = response.data;
                if (response.status >= 400) {
                    throw new Error(data.message);
                }
                setSuccess(true);
                resetForm();
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        } else {
            setError('Please fill in all fields.');
        }
    };

    const resetForm = () => {
        setEmail('');
        setSubject('');
        setMessage('');
    };

    return (
        <div>
            <Navbar />
            {/* <section className="dark:bg-gray-900 min-h-screen max-lg:pt-20" style={{ backgroundImage: `url(${registebg})`, backgroundSize: "cover" }}> */}
            <section className="dark:bg-custom min-h-screen max-lg:pt-20" 
            // style={{ backgroundImage: `url(${registebg})`, backgroundSize: "cover" }}
            >
                <div className="flex items-center justify-center h-full py-12 lg:py-24 px-4 mx-auto max-w-screen-md">
                    <div className="w-full">
                        <h2 className="mb-6 font-sans text-5xl tracking-tight font-extrabold text-center text-gray-900 dark:text-red-700">Contact Us</h2>
                        <p className="mb-10 lg:mb-12  text-center text-gray-600 dark:text-primary sm:text-xl">
                            Have questions about our football club? We're here to assist you!
                            Please share your inquiries, feedback, or support requests.
                        </p>
                        {success && <p className="text-green-500 text-center mb-4">Message sent successfully!</p>}
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-md  text-gray-200 font-bold">Your Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="shadow-md bg-[#111827] border border-gray-300 text-white text-md rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 transition duration-200 ease-in-out hover:shadow-lg dark:bg-customDark dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="name@yourclub.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block mb-2 text-md font-medium text-gray-200 font-bold">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="block p-3 w-full text-md text-white bg-[#111827] rounded-lg border border-gray-300 shadow-md focus:ring-primary-500 focus:border-primary-500 transition duration-200 ease-in-out hover:shadow-lg dark:bg-customDark dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="How can we assist you?"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block mb-2 text-md font-medium text-gray-200 font-bold">Your Message</label>
                                <textarea
                                    id="message"
                                    rows="6"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="block p-3 w-full text-md text-white bg-[#111827] rounded-lg shadow-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500 transition duration-200 ease-in-out hover:shadow-lg dark:bg-customDark dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Leave a message for us..."
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="py-3 px-5 text-md font-medium text-center text-white rounded-lg bg-red-700 w-full sm:w-auto hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ContactUs;
