import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;

const localizer = momentLocalizer(moment);

const GeneralBooking = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grounds, setGrounds] = useState([]);
  const [selectedGround, setSelectedGround] = useState(null);
  const [formattedEvents, setFormattedEvents] = useState([]);
  
  // Helper function to format time in HH:MM AM/PM format
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formattedBookings = (data) => {
    // If no ground is selected, set events to empty array
    if (!selectedGround) {
      setFormattedEvents([]);
      return;
    }
    
    const processedData = data.bookings.filter((booking) => booking.ground._id === selectedGround);

    const events = processedData.map((booking) => {
      const formattedDate = moment(booking.bookingDate).format("YYYY-MM-DD");
      
      // Create start time
      const startDateTime = new Date(`${formattedDate}T${booking.bookingTime}:00`);
      
      // Calculate end time by adding hours and minutes separately
      let endDateTime = new Date(startDateTime);
      const durationHours = Math.floor(booking.bookingDuration);
      const durationMinutes = (booking.bookingDuration % 1) * 60;
      
      endDateTime.setHours(endDateTime.getHours() + durationHours);
      endDateTime.setMinutes(endDateTime.getMinutes() + durationMinutes);

      // Format the times for the title
      const startTimeStr = formatTime(startDateTime);
      const endTimeStr = formatTime(endDateTime);
      
      // Create a dynamic title with the start and end times
      const dynamicTitle = `Booking (${startTimeStr} - ${endTimeStr})`;

      return {
        title: booking.title || dynamicTitle,
        date: booking.bookingDate,
        start: startDateTime,
        end: endDateTime,
      };
    });
    
    setFormattedEvents(events);
  };

  const fetchGrounds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/all-grounds`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
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

  const fetchFormattedBookings = async () => {
    try {
      await fetchGrounds();
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/bookings`);
      const data = response.data;

      if (response.status >= 400) {
        throw new Error(data.message);
      }
      
      const today = new Date();
      const formattedToday = moment(today).format("YYYY-MM-DD");
      const filteredData = data.bookings.filter((booking) => {
        const formattedDate = moment(booking.bookingDate).format("YYYY-MM-DD");
        return formattedDate >= formattedToday;
      });
      
      formattedBookings({ bookings: filteredData });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormattedBookings();
  }, [selectedGround]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex pt-5 items-center justify-center">
        <select
          className="w-1/2 p-2 mt-2 rounded-lg text-black"
          onChange={(e) => setSelectedGround(e.target.value)}
          value={selectedGround}
        >
          <option value="">Select Ground</option>
          {grounds.map((ground) => (
            <option key={ground._id} value={ground._id}>
              {ground.name}
            </option>
          ))}
        </select>
      </div>
      <div className="p-20 pt-2 max-sm:p-5 max-sm:pt-20 bg-custom text-white">
        {loading ? (
          <div className="w-full h-64 flex justify-center items-center ">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white"></div>
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={selectedGround ? formattedEvents : []}
            startAccessor="start"
            endAccessor="end"
            defaultView="day"
            style={{ height: 500, marginTop: "20px" }}
            className="bg-gray-100 text-black w-full md:w-3/4 lg:w-full mx-auto p-10 max-sm:p-0 rounded-xl shadow-lg"
          />
        )}
      </div>
    </div>
  );
};

export default GeneralBooking;