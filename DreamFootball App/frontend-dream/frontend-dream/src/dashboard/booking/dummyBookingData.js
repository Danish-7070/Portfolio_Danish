export const dummyBookingData = [
    {
        id: 1, // Added an ID for easy reference
        customer: "60f8f8f8f8f8f8f8f8f8f8f8", // Replace with actual ObjectId of a Customer
        bookingDate: "2024-10-01", // Format for input type="date"
        bookingTime: "14:00",
        bookingDuration: 2,
        bookingPrice: 100,
        bookingStatus: "confirmed",
        paymentMethod: "credit_card",
        paymentStatus: "completed",
        paymentDate: "2024-10-01", // Format for input type="date"
        ground: "Stadium A", // id of ground model goes here
    },
    {
        id: 2, // Added an ID for easy reference
        customer: "60f8f8f8f8f8f8f8f8f8f8f9", // Replace with actual ObjectId of a Customer
        bookingDate: "2024-10-02", // Format for input type="date"
        bookingTime: "16:00",
        bookingDuration: 3,
        bookingPrice: 150,
        bookingStatus: "pending",
        paymentMethod: "paypal",
        paymentStatus: "pending",
        paymentDate: null, // Null indicates no payment date yet
        ground: "Stadium B",
    },
    // Add more bookings as needed
];
