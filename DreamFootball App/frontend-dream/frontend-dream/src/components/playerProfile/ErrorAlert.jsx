import React from 'react';
import { IoMdClose } from 'react-icons/io';

const ErrorAlert = ({ message, onClose }) => {
    return (
        <div
            role="alert"
            className="alert alert-error flex justify-between items-center py-3 px-4 mb-6 bg-red-400 border border-red-500 rounded-md text-black"
        >
            <span>{message}</span>
            <button
                className="text-red-600 hover:text-red-800 focus:outline-none"
                onClick={onClose}
            >
                <IoMdClose size={20} />
            </button>
        </div>
    );
};

export default ErrorAlert;