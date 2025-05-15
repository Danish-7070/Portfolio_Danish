export const dummyGroundData = [
    {
      id: 1,
      name: 'City Sports Ground',
      address: '123 Main Street, Cityville',
      phone: '123-456-7890',
      prices: [{ duration: 1, price: 50 }, { duration: 2, price: 100 }, { duration: 3, price: 150 }], // Updated to include duration and price
      groundType: 'Football',
      reserved_times: [{ date: '2024-10-16', times: ['09:00', '10:30'] }], // Updated to match the required structure
      startTime: '08:00', // Adjusted to HH:MM format
      endTime: '22:00',   // Adjusted to 24-hour format (10:00 PM is 22:00)
    },
    {
      id: 2,
      name: 'River Park Ground',
      address: '456 Riverside Drive, Rivertown',
      phone: '987-654-3210',
      prices: [{ duration: 1, price: 60 }, { duration: 2, price: 110 }, { duration: 3, price: 160 }], // Updated to include duration and price
      groundType: 'Cricket',
      reserved_times: [{ date: '2024-10-16', times: ['13:00', '15:30'] }], // Updated to match the required structure
      startTime: '07:00', // Adjusted to HH:MM format
      endTime: '21:00',   // Adjusted to 24-hour format (09:00 PM is 21:00)
    },
    // Add more sample data as needed
  ];
  