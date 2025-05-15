import React, { useState, useRef, useEffect } from "react";

const AddBookingForm = ({ onSubmit, customersData, groundsData }) => {
  const [customer, setCustomer] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerSelectionType, setCustomerSelectionType] = useState("existing"); // "existing" or "new"
  const [bookingDate, setBookingDate] = useState("");
  const [bookingStartTime, setbookingStartTime] = useState("");
  const [bookingEndTime, setbookingEndTime] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingDuration, setBookingDuration] = useState(1.5);
  const [bookingPrice, setBookingPrice] = useState(0);
  const [bookingStatus, setBookingStatus] = useState("pending");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentDate, setPaymentDate] = useState("");
  const [ground, setGround] = useState("");
  const [tid, setTid] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [withLights, setWithLights] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  // Customer search dropdown states
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const dropdownRef = useRef(null);

  // Function to determine if lights are needed based on time and date
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

  // Filter customers when search term changes
  useEffect(() => {
    if (customersData && customersData.length > 0 && customerSelectionType === "existing") {
      const filtered = customersData.filter(cust =>
        cust.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cust.email && cust.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cust.phone && cust.phone.includes(searchTerm))
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [searchTerm, customersData, customerSelectionType]);

  // Update withLights based on booking date and time
  useEffect(() => {
    // Calculate if lights are needed based on current selections
    const lightsNeeded = isLightsNeeded(bookingDate, bookingTime);

    // Only calculate price if we have all required inputs
    if (ground && groundsData && groundsData.length > 0 && lightsNeeded !== null) {
      // Update the withLights state based on the calculation
      setWithLights(lightsNeeded);

      const selectedGround = groundsData.find(g => g._id === ground);
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
  }, [ground, bookingDate, bookingTime, bookingDuration, groundsData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create booking object based on customer selection type
      const newBooking = {
        bookingDate: new Date(bookingDate),
        bookingTime,
        bookingDuration,
        bookingPrice,
        bookingStatus,
        paymentMethod,
        paymentStatus,
        paymentDate: paymentDate ? new Date(paymentDate) : null,
        ground,
        tid: paymentMethod === "cash" ? null : tid,
        phone,
        withLights
      };

      // Add either customer ID or customer name based on selection type
      if (customerSelectionType === "existing") {
        newBooking.customer = customer;
        newBooking.customerName = null;
      } else {
        newBooking.customerName = customerName;
        newBooking.customer = null;
      }

      console.log("new booking:", newBooking);
      await onSubmit(newBooking);

      resetForm();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to reset form fields
  const resetForm = () => {
    setCustomer("");
    setCustomerName("");
    setBookingDate("");
    setbookingStartTime("");
    setbookingEndTime("");
    setBookingTime("");
    setBookingDuration(1.5);
    setBookingPrice(0);
    setBookingStatus("pending");
    setPaymentMethod("");
    setPaymentStatus("pending");
    setPaymentDate("");
    setGround("");
    setTid("");
    setSearchTerm("");
    setPhone("");
    setWithLights(false);
    setCalculatedPrice(null);
  };

  // Handle customer search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  // Handle customer selection from dropdown
  const handleCustomerSelect = (customerId) => {
    setCustomer(customerId);
    setIsDropdownOpen(false);

    // Find the selected customer to display their username in the search field
    const selectedCustomer = customersData?.find(cust => cust._id === customerId);
    if (selectedCustomer) {
      setSearchTerm(selectedCustomer.username);
      // If the customer has a phone number, set it
      if (selectedCustomer.phone) {
        setPhone(selectedCustomer.phone);
      }
    }
  };

  // Handle radio button change for customer selection type
  const handleCustomerTypeChange = (e) => {
    setCustomerSelectionType(e.target.value);
    // Reset the other field when switching
    if (e.target.value === "existing") {
      setCustomerName("");
    } else {
      setCustomer("");
      setSearchTerm("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Add a new Booking</h1>

      {/* Customer Selection Type */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-500 font-medium">Select Customer Type</label>
        <div className="flex gap-6 mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="customerType"
              value="existing"
              checked={customerSelectionType === "existing"}
              onChange={handleCustomerTypeChange}
              className="radio radio-primary"
            />
            <span>Select Existing Customer</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="customerType"
              value="new"
              checked={customerSelectionType === "new"}
              onChange={handleCustomerTypeChange}
              className="radio radio-primary"
            />
            <span>Enter New Customer</span>
          </label>
        </div>
      </div>

      {/* Form inputs for booking details */}
      <div className="flex gap-2">
        {customerSelectionType === "existing" ? (
          <div className="flex flex-col gap-2 w-1/2" ref={dropdownRef}>
            <label className="text-gray-500">Select Customer</label>

            {/* Search input for customer */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={() => setIsDropdownOpen(true)}
                className="rounded-md p-3 border border-gray-300 w-full"
                required={customerSelectionType === "existing"}
                disabled={customerSelectionType !== "existing"}
              />

              {/* Customer dropdown */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Filter customers..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="rounded-md p-2 border-b border-gray-200 w-full sticky top-0 bg-white"
                  />

                  {!filteredCustomers || filteredCustomers.length === 0 ? (
                    <div className="p-3 text-gray-500">No customers found</div>
                  ) : (
                    filteredCustomers.map((cust) => (
                      <div
                        key={cust._id}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCustomerSelect(cust._id)}
                      >
                        <div className="font-medium">{cust.username}</div>
                        {cust.email && <div className="text-sm text-gray-600">{cust.email}</div>}
                        {cust.phone && <div className="text-sm text-gray-600">{cust.phone}</div>}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Hidden select for form submission */}
              <select
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="hidden"
                required={customerSelectionType === "existing"}
                disabled={customerSelectionType !== "existing"}
              >
                <option value="">Select Customer</option>
                {customersData && customersData.length > 0 && customersData.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-1/2">
            <label className="text-gray-500">Customer Name</label>
            <input
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="rounded-md p-3 border border-gray-300 w-full"
              required={customerSelectionType === "new"}
              disabled={customerSelectionType !== "new"}
            />
          </div>
        )}

        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Booking Date</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="rounded-md p-3 border border-gray-300"
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Phone Number</label>
          <input
            type="text"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-md p-3 border border-gray-300"
          />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Booking Time</label>
          <input
            type="time"
            value={bookingTime}
            onChange={(e) => {
              const hours = e.target.value.split(':')[0];
              const minutes = parseInt(e.target.value.split(':')[1]) < 30 ? '00' : '30';
              setBookingTime(`${hours}:${minutes}`);
            }}
            className="rounded-md p-3 border border-gray-300"
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-1/2">
          <label htmlFor="bookingDuration" className="text-gray-500">
            Booking Duration (hours)
          </label>
          <input
            type="number"
            value={bookingDuration}
            onChange={(e) => {
              const value = Number(e.target.value);
              const roundedValue = Math.round(value * 2) / 2; // Round to nearest 0.5
              setBookingDuration(roundedValue);
            }}
            onBlur={(e) => {
              const value = Number(e.target.value);
              const roundedValue = Math.round(value * 2) / 2;
              setBookingDuration(roundedValue);
            }}
            className="rounded-md p-3 border border-gray-300"
            min="1"
            step="0.5"
            required
          />
          {/* Lights information */}
          {bookingDate && bookingTime && (
            <div className="flex flex-col gap-2 w-full p-3 bg-gray-100 rounded-md mt-2 mb-2">
              <p className="font-medium">
                {isLightsNeeded(bookingDate, bookingTime)
                  ? "Lights will be required for this booking time."
                  : "No lights needed for this booking time."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="rounded-md p-3 border border-gray-300"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="easypaisa">Easypaisa</option>
            <option value="cash">Cash</option>
            <option value="bankTransfer">Bank Transfer</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="rounded-md p-3 border border-gray-300"
            required
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      {paymentMethod !== "cash" &&
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-gray-500">Transaction ID (TID)</label>
            <input
              type="text"
              value={tid}
              onChange={(e) => setTid(e.target.value)}
              className="rounded-md p-3 border border-gray-300"
              placeholder="Transaction ID"
              required
            />
          </div>
        </div>}

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-gray-500">Ground</label>
          <select
            value={ground}
            onChange={(e) => setGround(e.target.value)}
            className="rounded-md p-3 border border-gray-300"
            required
          >
            <option value="">Select Ground</option>
            {groundsData && groundsData.length > 0 && groundsData.map((ground) => (
              <option key={ground._id} value={ground._id}>
                {ground.name}
              </option>
            ))}
          </select>

          {/* Price information */}
          {bookingDate && bookingTime && ground && (
            <div className="flex flex-col gap-2 w-full p-3 bg-gray-100 rounded-md mt-2 mb-2">
              {calculatedPrice ? (
                <p className="font-medium">
                  Booking Price: PKR {calculatedPrice}/-
                  ({withLights ? "With Lights" : "Without Lights"} @
                  {withLights
                    ? ` PKR ${groundsData.find(g => g._id === ground)?.rateWithLights || 0}`
                    : ` PKR ${groundsData.find(g => g._id === ground)?.rateWithoutLights || 0}`
                  } per hour × {bookingDuration} hours)
                </p>
              ) : (
                <p className="font-medium text-yellow-600">
                  Rate not specified for {withLights ? "With Lights" : "Without Lights"} option
                </p>
              )}
            </div>
          )}

        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        className={`btn btn-primary mt-5 w-full text-white rounded-full ${loading ? "cursor-not-allowed" : ""
          }`}
        type="submit"
        disabled={loading}
      >
        {loading && <span className="loading loading-spinner"></span>}
        {loading ? "Creating Booking..." : "Create Booking"}
      </button>
    </form>
  );
};

export default AddBookingForm;