import React, { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';

const BookingFilters = ({ bookings, setFilteredBookings, grounds }) => {
  const [activeFilters, setActiveFilters] = useState({
    today: false,
    thisWeek: false,
    specificDate: null,
    month: null,
    year: null,
    city: '',
    groundId: ''
  });

  const [filteredGrounds, setFilteredGrounds] = useState([]);


  useEffect(() => {
    console.log("grounds in fitler: ", grounds)
  }, [])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 16 }, (_, i) => 2020 + i);

  const cities = [
    "Rawalpindi", "Islamabad", "Lahore", "Peshawar",
    "Faisalabad", "Karachi", "Quetta", "Kashmir", "Other"
  ];

  useEffect(() => {
    // Update filtered grounds when city changes
    if (activeFilters.city) {
      if (activeFilters.city === 'Other') {
        // Filter grounds where city is 'Other' or null
        const otherGrounds = grounds.filter(ground =>
          !ground.city || ground.city === 'Other'
        );
        setFilteredGrounds(otherGrounds);
      } else {
        // Filter grounds by selected city
        const cityGrounds = grounds.filter(ground =>
          ground.city === activeFilters.city
        );
        setFilteredGrounds(cityGrounds);
      }
      // Clear ground selection when city changes
      setActiveFilters(prev => ({ ...prev, groundId: '' }));
    } else {
      // If no city is selected, show all grounds
      setFilteredGrounds(grounds);
    }
  }, [activeFilters.city, grounds]);

  const getStartOfDay = (date) => {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);
    return normalized;
  };

  const getEndOfDay = (date) => {
    const normalized = new Date(date);
    normalized.setUTCHours(23, 59, 59, 999);
    return normalized;
  };

  const applyFilters = (bookingsData, filters) => {
    let filtered = [...bookingsData];
    filtered = filtered.filter(booking => {
      if (booking.ground) {
        return booking
      }
    }
    );

    // Apply city filter
    if (filters.city) {
      filtered = filtered.filter(booking => {
        const bookingGround = grounds.find(g => g._id === booking?.ground._id);
        if (filters.city === 'Other') {
          return !bookingGround?.city || bookingGround?.city === 'Other';
        }
        return bookingGround?.city === filters.city;
      });
    }

    // Apply ground filter
    if (filters.groundId) {
      console.log("filtered: ", filtered)
      filtered = filtered.filter(booking => {
        if (booking.ground) {
          return booking.ground._id === filters.groundId
        }
      }
      );
    }

    // Apply year filter
    if (filters.year !== null) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate.getUTCFullYear() === filters.year;
      });
    }

    // Apply month filter
    if (filters.month !== null) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate.getUTCMonth() === filters.month;
      });
    }

    // Apply today filter
    if (filters.today) {
      const today = getStartOfDay(new Date());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate >= today && bookingDate < tomorrow;
      });
    }

    // Apply this week filter
    if (filters.thisWeek) {
      const now = new Date();
      const startOfWeek = getStartOfDay(new Date(now));
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = getEndOfDay(new Date(startOfWeek));
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
      });
    }

    // Apply specific date filter
    if (filters.specificDate) {
      const selectedDate = getStartOfDay(new Date(filters.specificDate));
      const endOfDay = getEndOfDay(new Date(filters.specificDate));

      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate >= selectedDate && bookingDate <= endOfDay;
      });
    }

    // Sort the filtered bookings by date
    filtered.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

    return filtered;
  };

  useEffect(() => {
    const filteredResults = applyFilters(bookings, activeFilters);
    setFilteredBookings(filteredResults);
  }, [bookings, activeFilters, setFilteredBookings]);

  const toggleFilter = (filterName, value = null) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };

      if ((filterName === 'today' || filterName === 'thisWeek') && value === true) {
        newFilters.specificDate = null;
      }

      if (filterName === 'specificDate' && value) {
        newFilters.today = false;
        newFilters.thisWeek = false;
      }

      newFilters[filterName] = value !== null ? value : !prev[filterName];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      today: false,
      thisWeek: false,
      specificDate: null,
      month: null,
      year: null,
      city: '',
      groundId: ''
    });
  };

  const filteredBookingsCount = applyFilters(bookings, activeFilters).length;

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-primary" size={24} />
          <h2 className="text-lg font-semibold">Booking Filters</h2>
        </div>
        <div className="text-sm text-gray-600">
          Showing {filteredBookingsCount} booking{filteredBookingsCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-4">
        {/* City Filter */}
        <select
          value={activeFilters.city}
          onChange={(e) => toggleFilter('city', e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select City</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {/* Ground Filter */}
        <select
          value={activeFilters.groundId}
          onChange={(e) => toggleFilter('groundId', e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select Ground</option>
          {filteredGrounds.map(ground => (
            <option key={ground._id} value={ground._id}>{ground.name}</option>
          ))}
        </select>

        <button
          onClick={() => toggleFilter('today', true)}
          className={`px-4 py-2 rounded-md transition-colors ${activeFilters.today ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
        >
          Today
        </button>

        <button
          onClick={() => toggleFilter('thisWeek', true)}
          className={`px-4 py-2 rounded-md transition-colors ${activeFilters.thisWeek ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
        >
          This Week
        </button>

        <input
          type="date"
          value={activeFilters.specificDate || ''}
          onChange={(e) => toggleFilter('specificDate', e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <select
          value={activeFilters.month !== null ? activeFilters.month : ''}
          onChange={(e) => toggleFilter('month', e.target.value === '' ? null : parseInt(e.target.value))}
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select Month</option>
          {months.map((month, index) => (
            <option key={month} value={index}>{month}</option>
          ))}
        </select>

        <select
          value={activeFilters.year || ''}
          onChange={(e) => toggleFilter('year', e.target.value === '' ? null : parseInt(e.target.value))}
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select Year</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <button
          onClick={clearAllFilters}
          className="px-4 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center gap-1"
        >
          <X size={16} />
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default BookingFilters;