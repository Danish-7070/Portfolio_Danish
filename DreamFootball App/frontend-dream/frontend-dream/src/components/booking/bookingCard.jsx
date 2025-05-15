import React, { useEffect } from "react";
import { AiFillCheckSquare, AiFillDelete, AiFillEdit } from "react-icons/ai";

const BookingCard = ({ booking, onEdit, onCancel, onConfirm, onPending, onCompleted }) => {

  const handleEditClick = async () => {
    await onEdit(booking);
  };

  const handleCancelClick = async () => {
    await onCancel(booking._id);
  };

  const handleConfirmClick = async () => {
    await onConfirm(booking._id);
  }

  const handlePendingClick = async () => {
    await onPending(booking._id);
  }

  const handleCompletedClick = async () => {
    await onCompleted(booking._id);
  }

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 relative">

      <div className="absolute top-1 left-1">
        <span className={`
          ${booking.bookingStatus === "pending" && "bg-blue-500"
          }
          ${booking.bookingStatus === "confirmed" && "bg-green-500"
          }
          ${booking.bookingStatus === "cancelled" && "bg-red-500"
          }
          text-white rounded-md px-2 py-1`}>
          {booking.bookingStatus === "pending" && "Pending"}
          {booking.bookingStatus === "confirmed" && "Confirmed"}
          {booking.bookingStatus === "cancelled" && "Cancelled"}
        </span>
      </div>

      <h3 className="text-2xl mt-3 font-semibold text-gray-800 mb-4">
        Booking Details
      </h3>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-gray-600">
        {booking.customer && <div className="flex justify-between">
          <strong>Customer:</strong>
          <span>{booking.customer.username}</span>
        </div>}
        {booking.customerName && <div className="flex justify-between">
          <strong>Customer:</strong>
          <span>{booking.customerName}</span>
        </div>}

        {booking.team && <div className="flex justify-between">
          <strong>Team:</strong>
          <span>{booking.team.teamName}</span>
        </div>}

        <div className="flex justify-between">
          <strong>Date:</strong>
          <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
        </div>

        <div className="flex justify-between">
          <strong>Time:</strong>
          <span>{booking.bookingTime}</span>
        </div>

        <div className="flex justify-between">
          <strong>Duration:</strong>
          <span>{booking.bookingDuration} hours</span>
        </div>

        <div className="flex justify-between">
          <strong>Price:</strong>
          <span>
            {booking?.bookingPrice ? `PKR ${booking?.bookingPrice}` : "N/A"}
            </span>
          {/* <span>
            {(booking.withLights) ? (
              booking.ground?.rateWithLights ? `PKR ${booking.ground?.rateWithLights * Number(booking.bookingDuration)}` : 'N/A or 0'
            ) : (
              booking.ground?.rateWithoutLights ? booking.ground?.rateWithoutLights * booking.bookingDuration : 'N/A or 0'
            )}
            </span> */}
        </div>

        <div className="flex justify-between">
          <strong>Status:</strong>
          <span>{booking.bookingStatus}</span>
        </div>

        <div className="flex justify-between">
          <strong>Payment Method:</strong>
          <span>{booking.paymentMethod}</span>
        </div>

        <div className="flex justify-between">
          <strong>Payment Status:</strong>
          <span>{booking.paymentStatus}</span>
        </div>

        {/* <div className="flex justify-between">
          <strong>Payment Date:</strong>
          <span>
            {booking.paymentDate
              ? new Date(booking.paymentDate).toLocaleDateString()
              : "N/A"}
          </span>
        </div> */}

         <div className="flex justify-between">
          <strong>Contact No:</strong>
          <span>{booking?.phone || (booking?.customer?.phone ? booking?.customer?.phone : "N/A")}</span>
        </div>
        <div className="flex justify-between">
          <strong>Ground:</strong>
          <span>{booking.ground?.name}</span>
        </div>

        <div className="flex justify-between">
          <strong>Transaction ID (TID)</strong>
          <span>{booking.tid ? booking.tid : "N/A"}</span>
        </div>

        <div className="flex justify-between">
          <strong>{booking.withLights ? "With Lights" : "Without Lights"}</strong>
          {/* <span>{booking.ground?.name}</span> */}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="mt-4 bg-primary text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center"
          onClick={handleEditClick}
        >
          <AiFillEdit className="mr-2" />
          <p>Edit</p>
        </button>
        {booking.bookingStatus === "pending" && (
          <>
            <button
              className="mt-4 bg-green-500 text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center"
              onClick={handleConfirmClick}
            >
              <AiFillDelete className="mr-2" />
              <p>Confirm</p>
            </button>
            <button
              className="mt-4 bg-red-500 text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center"
              onClick={handleCancelClick}
            >
              <AiFillDelete className="mr-2" />
              <p>Cancel</p>
            </button>
          </>
        )}
        {booking.bookingStatus === "confirmed" && (
          <>
            <button
              className="mt-4 bg-red-500 text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center"
              onClick={handleCancelClick}
            >
              <AiFillDelete className="mr-2" />
              <p>Cancel</p>
            </button>
            <button
              className="mt-4 bg-blue-500 text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center"
              onClick={handlePendingClick}
            >
              <AiFillDelete className="mr-2" />
              <p>Set to Pending</p>
            </button>
            <button
              className="mt-4 bg-green-500 text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center"
              onClick={handleCompletedClick}
            >
              <AiFillCheckSquare className="mr-2" />
              <p>Set to Completed</p>
            </button> 
          </>
        )}
        {booking.bookingStatus === "cancelled" && (
          <>
            {/* <button
              className="mt-4 bg-green-500 text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center"
              onClick={handleConfirmClick}
            >
              <AiFillDelete className="mr-2" />
              <p>Confirm</p>
            </button> */}
            <button
              className="mt-4 bg-blue-500 text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center"
              onClick={handlePendingClick}
            >
              <AiFillDelete className="mr-2" />
              <p>Set to Pending</p>
            </button>

          </>
        )}
        {booking.bookingStatus === "completed" && (
          <>
            <button
              className="mt-4 bg-green-600 text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center" disabled
            >
              <AiFillCheckSquare className="mr-2" />
              <p>Completed</p>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
