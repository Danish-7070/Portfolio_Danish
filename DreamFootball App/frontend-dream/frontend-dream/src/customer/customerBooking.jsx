import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/navbar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { BiHistory } from "react-icons/bi";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../context/userContext";
import { formatDate, formatDate2 } from "../utils/formatDate";
import commonService from "../services/commonService";

const URL = import.meta.env.VITE_BACKEND_URL;

const CustomerBooking = () => {
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingDuration, setBookingDuration] = useState(1.5);
  const [bookingPrice, setBookingPrice] = useState(0);
  const [bookingStatus, setBookingStatus] = useState("pending");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentDate, setPaymentDate] = useState("");
  const [withLights, setWithLights] = useState(false);
  const [tid, setTid] = useState(""); // transaction id
  const [phone,setPhone] = useState('')
  const [ground, setGround] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Add a state to track the calculated price
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  // Remove the static events array and create a state for events
  const [calendarEvents, setCalendarEvents] = useState([]);

  const [playersRequired, setPlayersRequired] = useState(0);

  const [bookingHistoryData, setBookingHistoryData] = useState([]);

  const { customer } = useUser();

  const [grounds, setGrounds] = useState([]);


  // Add a useEffect to calculate the price whenever relevant values change
  useEffect(() => {
    if (ground && grounds.length > 0) {
      const selectedGround = grounds.find(g => g._id === ground);
      if (selectedGround) {
        const rate = withLights
          ? selectedGround.rateWithLights
          : selectedGround.rateWithoutLights;

        if (rate && rate > 0) {
          setCalculatedPrice(rate * bookingDuration);
          setBookingPrice(rate * bookingDuration);
        } else {
          setCalculatedPrice(null);
          setBookingPrice(0);
        }
      }
    }
  }, [ground, withLights, bookingDuration, grounds]);

  useEffect(() => {
    if (bookingHistoryData.length > 0) {
      const formattedEvents = bookingHistoryData.map(booking => {
        // Parse the booking date and time
        const bookingDateTime = new Date(booking.bookingDate);
        const [hours, minutes] = booking.bookingTime.split(':').map(Number);

        // Set the start time
        bookingDateTime.setHours(hours, minutes, 0);
        const startTime = new Date(bookingDateTime);

        // Calculate end time by adding duration (in hours)
        const endTime = new Date(bookingDateTime);
        endTime.setTime(endTime.getTime() + (booking.bookingDuration * 60 * 60 * 1000));

        // Format times for title
        const startTimeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTimeStr = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
          title: `Booking (${startTimeStr} - ${endTimeStr})`,
          start: startTime,
          end: endTime,
          resource: booking._id
        };
      });

      setCalendarEvents(formattedEvents);
    }
  }, [bookingHistoryData]);

  useEffect(() => {
    console.log("customer:", customer);
    fetchBookings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newBooking = {
        customer: customer._id,
        team: null,
        bookingDate: new Date(bookingDate),
        bookingTime,
        bookingDuration,
        bookingPrice,
        bookingStatus,
        paymentMethod,
        teamRequired: false,
        paymentStatus,
        paymentDate: paymentDate ? new Date(paymentDate) : null,
        ground,
        playersRequired,
        withLights,
        tid,
        phone
      };
      console.log("new booking:", newBooking);

      const response = await axios.post(
        `${URL}/customer/bookings`,
        newBooking,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      console.log("response", response);
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      toast.success("Booking added successfully");
      resetForm();
      await fetchBookings();
    } catch (error) {
      setError(error.response.data.message || "Error creating booking");
      toast.error(error.response.data.message || "Error creating booking");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBookingDate("");
    setBookingTime("");
    setBookingDuration(1.5);
    setBookingPrice(0);
    setBookingStatus("pending");
    setPaymentMethod("");
    setPaymentStatus("pending");
    setPaymentDate("");
    setGround("");
    setPlayersRequired(0);
    setWithLights(false);
    setTid("");
  };

  const fetchGrounds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/customer/grounds`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      console.log("response of fetchGrounds:", response);
      if (response.status >= 400) {
        throw new Error(data.message);
      }

      setGrounds(data.grounds);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/customer/bookings`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      console.log("response of fetchBookings:", response);
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      const specificBookings = data.bookings
        .filter((booking) => {
          return booking.customer != null;
        })
        .filter((booking) => booking.customer._id === customer._id);
      setBookingHistoryData(specificBookings);
      console.log("specific bookings:", specificBookings);
      setBookingHistoryData(specificBookings);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Add a function to determine if lights are needed based on time and date
  const isLightsNeeded = (date, time) => {
    if (!date || !time) return null;

    const bookingDate = new Date(date);
    const month = bookingDate.getMonth() + 1; // January is 0
    const [hours, minutes] = time.split(':').map(Number);

    // Summer months (March to September)
    if (month >= 3 && month <= 9) {
      // 5am to 6:00pm will be without lights in summer
      return !(hours >= 5 && hours < 18);
    } else {
      // Winter months (October to February)
      // 6am to 5pm will be without lights in winter
      return !(hours >= 6 && hours < 17);
    }
  };

  // Update the useEffect to use the automatically determined lights setting
  useEffect(() => {
    // Calculate if lights are needed based on current selections
    const lightsNeeded = isLightsNeeded(bookingDate, bookingTime);

    // Only calculate price if we have all required inputs
    if (ground && grounds.length > 0 && lightsNeeded !== null) {
      // Update the withLights state based on the calculation
      setWithLights(lightsNeeded);

      const selectedGround = grounds.find(g => g._id === ground);
      if (selectedGround) {
        const rate = lightsNeeded
          ? selectedGround.rateWithLights
          : selectedGround.rateWithoutLights;

        if (rate && rate > 0) {
          setCalculatedPrice(rate * bookingDuration);
          setBookingPrice(rate * bookingDuration);
        } else {
          setCalculatedPrice(null);
          setBookingPrice(0);
        }
      }
    } else {
      setCalculatedPrice(null);
      setBookingPrice(0);
    }
  }, [ground, bookingDate, bookingTime, bookingDuration, grounds]);

  useEffect(() => {
    fetchGrounds();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-20 max-sm:p-5 max-sm:pt-20 mt-10 bg-custom text-white min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-primary">Customer Bookings</h1>
        </div>

        {/* New Add Booking Form Section - Directly on page */}
        <div className="mt-10 bg-customDark2 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-primary mb-4">Add New Booking</h1>
          
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="bookingDate" className="text-white font-semibold">
                Booking Date
              </label>
              <input
                type="date"
                id="bookingDate"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="input input-bordered"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="bookingTime" className="text-white font-semibold">
                Booking Time
              </label>
              <input
                type="time"
                id="bookingTime"
                value={bookingTime}
                onChange={(e) => {
                  const hours = e.target.value.split(':')[0];
                  const minutes = parseInt(e.target.value.split(':')[1]) < 30 ? '00' : '30';
                  setBookingTime(`${hours}:${minutes}`);
                }}
                className="input input-bordered"
                step="1800"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="bookingDuration" className="text-white font-semibold">
                Booking Duration (hours)
              </label>
              <input
                type="number"
                id="bookingDuration"
                value={bookingDuration}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  const roundedValue = Math.round(value * 2) / 2;
                  setBookingDuration(roundedValue);
                }}
                onBlur={(e) => {
                  const value = Number(e.target.value);
                  const roundedValue = Math.round(value * 2) / 2;
                  setBookingDuration(roundedValue);
                }}
                className="input input-bordered"
                min="1"
                step="0.5"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="playersRequired" className="text-white font-semibold">
                No of Players Needed
              </label>
              <input
                type="number"
                id="playersRequired"
                value={playersRequired}
                onChange={(e) => setPlayersRequired(Number(e.target.value))}
                className="p-3 rounded-md input-bordered disabled:opacity-50 bg-white"
                min="0"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="ground" className="text-white font-semibold">
                Select Ground
              </label>
              <select
                id="ground"
                value={ground}
                onChange={(e) => setGround(e.target.value)}
                className="input input-bordered"
                required
              >
                <option value="">Select Ground</option>
                {grounds.map((ground) => (
                  <option key={ground._id} value={ground._id}>
                    {ground.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="paymentMethod" className="text-white font-semibold">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="input input-bordered"
                required
              >
                <option value="">Select Payment Method</option>
                <option value="easypaisa">Easypaisa</option>
                <option value="cash">Cash</option>
                <option value="bankTransfer">Bank Transfer</option>
              </select>
            </div>
            
            {
              paymentMethod !=='cash' ?
              (
              <div className="flex flex-col gap-2">
              <label htmlFor="tid" className="text-white font-semibold">
                Transaction ID
              </label>
              <input
                type="text"
                id="tid"
                value={tid}
                onChange={(e) => setTid(e.target.value)}
                className="input input-bordered"
                placeholder="Transaction ID"
                required
              />
            </div>
              )
              :
              <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-white font-semibold">
                Phone No.
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input input-bordered"
                placeholder="contact No."
                required
              />
            </div>
            }
            
            {/* Payment information section - spans full width */}
            <div className="md:col-span-2 mt-2">
              {paymentMethod === "easypaisa" && (
                <p className="text-white font-bold bg-customDark p-3 rounded-md">
                  NOTE: Please send the payment to 03215259146!
                </p>
              )}

              {paymentMethod === "bankTransfer" && (
                <div className="text-white bg-customDark p-3 rounded-md">
                  <p className="font-bold mb-2">NOTE: Please send the payment to</p>
                  <p>
                    IBAN: PK23MEZN0008170105726343
                    <br />
                    Account no: 0105726343
                    <br />
                    Account title: DREAM VALLEY ENTERPRISES (SMC-PRIVATE) Ltd
                    <br />
                    Bank name: Meezan Bank
                  </p>
                  <p className="my-2 font-bold">OR</p>
                  <p>
                    IBAN: PK20BAHL0182098100075001
                    <br />
                    Account no: 01820981000750018
                    <br />
                    Account title: DANYAL MUMTAZ
                    <br />
                    Bank name: Bank Al Habib
                  </p>
                </div>
              )}

              {paymentMethod === "cash" && (
                <p className="text-white font-bold bg-customDark p-3 rounded-md">
                  NOTE: Please bring the cash with you!
                </p>
              )}
            </div>
            
            {/* Lights information - spans full width */}
            <div className="md:col-span-2 text-white mt-2 bg-customDark p-3 rounded-md">
              {bookingDate && bookingTime ? (
                <p className="font-bold">
                  {isLightsNeeded(bookingDate, bookingTime)
                    ? "Lights will be required for this booking time."
                    : "No lights needed for this booking time."}
                </p>
              ) : (
                <p className="font-bold">Please select a date and time to determine lighting requirements.</p>
              )}
            </div>

            {/* Price information - spans full width */}
            <div className="md:col-span-2 text-white mt-2 bg-customDark p-3 rounded-md">
              {bookingDate && bookingTime && ground ? (
                calculatedPrice ? (
                  <p className="font-bold">
                    Booking Price: PKR {calculatedPrice}/-
                    ({isLightsNeeded(bookingDate, bookingTime) ? "With Lights" : "Without Lights"} @
                    {isLightsNeeded(bookingDate, bookingTime)
                      ? ` PKR ${grounds.find(g => g._id === ground)?.rateWithLights || 0}`
                      : ` PKR ${grounds.find(g => g._id === ground)?.rateWithoutLights || 0}`
                    } per hour × {bookingDuration} hours)
                  </p>
                ) : (
                  <p className="font-bold text-yellow-300">
                    Rate not specified for {isLightsNeeded(bookingDate, bookingTime) ? "With Lights" : "Without Lights"} option
                  </p>
                )
              ) : (
                <p className="font-bold">Please select a date, time, and ground to see pricing</p>
              )}
            </div>

            {/* Submit button - spans full width */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className={`btn btn-primary text-black w-full ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Creating Booking..." : "Create Booking"}
              </button>
            </div>
          </form>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Booking History Section */}
        <div className="mt-10">
          <h1 className="text-2xl font-bold text-primary">Booking History</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            {bookingHistoryData.map((booking) => (
              <div
                key={booking.id}
                className="bg-customDark2 p-5 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center">
                  <h6 className="text-xl sm:text-3xl font-bold">
                    Booking ID: {commonService.handleCode(booking._id)}
                  </h6>
                  <BiHistory className="text-white text-3xl" />
                </div>
                <div className="flex justify-end items-center mt-2">
                  <p>
                    {formatDate2(booking.bookingDate)} {booking.bookingTime}
                  </p>
                </div>
                <p>
                  <span className="font-bold">Duration:</span>{" "}
                  {booking.bookingDuration} hours
                </p>

                <p>
                  <span className="font-bold">Payment Method:</span>{" "}
                  {booking.paymentMethod}
                </p>

                <p>
                  <span className="font-bold">Ground:</span>{" "}
                  {booking.ground ? booking.ground.name : "N/A"}
                </p>
                <p>
                  {booking.withLights ? "With Lights" : "Without Lights"}
                </p>
                <p className="font-bold">Price: &nbsp;
                  <span>PKR &nbsp;
                    {(booking.withLights) ? (
                      booking?.bookingPrice ? booking?.bookingPrice : 'N/A or 0'
                    ) : (
                      booking?.bookingPrice ? booking?.bookingPrice : 'N/A or 0'
                    )}
                  </span>
                </p>
                <p className="font-bold">
                  <span>TID: &nbsp;
                    {booking.tid ? booking.tid : 'N/A'}
                  </span>
                </p>
                <p
                  className={`rounded-full px-4 text-black font-bold text-sm mt-3 text-center py-2 ${booking.bookingStatus === "pending"
                    ? "bg-yellow-500"
                    : booking.bookingStatus === "approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                    }`}
                >
                  {booking.bookingStatus}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBooking;