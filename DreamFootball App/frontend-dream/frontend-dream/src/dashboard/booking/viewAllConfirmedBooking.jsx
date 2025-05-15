import React, { useState, useEffect } from "react";
import AdminSiderbar from "../../components/sidebar/sidebar";
import { GiEmptyHourglass } from "react-icons/gi";
import BookingCard from "../../components/booking/bookingCard";
import EditBookingForm from "../../components/booking/editBookingForm";
import axios from "axios";
import toast from "react-hot-toast";
import BookingFilters from "./bookingFilters";

const URL = import.meta.env.VITE_BACKEND_URL;

const ViewAllConfirmedBooking = () => {
  // const [bookings, setBookings] = useState(dummyBookingData);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [grounds, setGrounds] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/bookings`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      // console.log('response', response.data);
      if (response.status >= 400) {
        throw new Error(data.message);
      }

      const confirmedBookings = data.bookings.filter(
        (booking) => booking.bookingStatus === "confirmed" || booking.bookingStatus === "completed"
      );

      setBookings(confirmedBookings || []);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/admin/customers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      setCustomers(data.customers || []);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrounds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/grounds`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      setGrounds(data.grounds || []);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    console.log("bookings", bookings);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchGrounds();
  }, []);

  const handleEditBooking = (booking) => {
    console.log("Selected booking:", booking);
    setSelectedBooking(booking);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.delete(
        `${URL}/bookings/cancel/${bookingId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      await fetchBookings();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      //patch request to /bookings/status/:bookingId with body {bookingStatus: "confirmed"}
      const response = await axios.patch(
        `${URL}/bookings/status/${bookingId}`,
        {
          bookingStatus: "confirmed",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      await fetchBookings();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCompletedBooking = async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      //patch request to /bookings/status/:bookingId with body {bookingStatus: "confirmed"}
      const response = await axios.patch(
        `${URL}/bookings/status/${bookingId}`,
        {
          bookingStatus: "completed",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      await fetchBookings();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePendingBooking = async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      //patch request to /bookings/status/:bookingId with body {bookingStatus: "pending"}
      const response = await axios.patch(
        `${URL}/bookings/status/${bookingId}`,
        {
          bookingStatus: "pending",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      console.log("response", response.data);
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      await fetchBookings();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEditBooking = async (updatedBooking, bookingId) => {
    try {
      setLoading(true);
      setError(null);
      //put request to /bookings/:bookingId with body updatedBooking
      // console.log('updatedBooking', updatedBooking);
      const response = await axios.put(
        `${URL}/bookings/${updatedBooking._id}`,
        updatedBooking,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      await fetchBookings();
      setSelectedBooking(null);
      toast.success("Booking updated successfully");
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    console.log("filtered bookings: ", filteredBookings)
  },[filteredBookings])

  return (
    <div className="">
      <AdminSiderbar />
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="pt-10 flex flex-col justify-start gap-4 mx-auto relative">
          {error && (
            <div
              role="alert"
              className="alert alert-error leading-tight flex justify-between  py-1 w-full mx-auto"
            >
              <span>{error}</span>
              <div>
                <button
                  className="btn btn-sm border-none "
                  onClick={() => setError(null)}
                >
                  x
                </button>
              </div>
            </div>
          )}
          {selectedBooking && (
            <div
              className="absolute top-0 left-0 border-primary border-2 rounded-md p-1 text-center bg-primary text-white cursor-pointer"
              onClick={() => setSelectedBooking(null)}
            >
              {"Back"}
            </div>
          )}
          {selectedBooking ? (
            <EditBookingForm
              bookingData={selectedBooking}
              customersData={customers}
              groundsData={grounds}
              onSubmit={handleSubmitEditBooking}
            />
          ) : (
            <div className="flex flex-col gap-4">
              <BookingFilters
                bookings={bookings}
                setFilteredBookings={setFilteredBookings}
                grounds={grounds} 
              />
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onEdit={handleEditBooking}
                    onConfirm={handleConfirmBooking}
                    onPending={handlePendingBooking}
                    onCancel={handleCancelBooking}
                    onCompleted={handleCompletedBooking}
                    type="edit"
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-xl shadow-md border border-black border-dashed">
                  <GiEmptyHourglass className="text-6xl text-gray-500" />
                  <p className="text-gray-500 text-2xl">No Bookings found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewAllConfirmedBooking;
