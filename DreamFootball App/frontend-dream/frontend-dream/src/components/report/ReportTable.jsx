import React from 'react';

/**
 * Component for displaying financial report data in a table
 * @param {Object} props - Component props
 * @param {Object} props.reportData - Financial report data
 */
const ReportTable = ({ reportData }) => {
  if (!reportData || !reportData.dailyData || reportData.dailyData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No daily data available for this period.</p>
      </div>
    );
  }

  // Sort daily data by date (most recent first)
  const sortedData = [...reportData.dailyData].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left border border-gray-200 font-semibold text-gray-700">Date</th>
            <th className="p-3 text-center border border-gray-200 font-semibold text-gray-700">Bookings</th>
            <th className="p-3 text-center border border-gray-200 font-semibold text-gray-700">Hours</th>
            <th className="p-3 text-right border border-gray-200 font-semibold text-gray-700">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="p-3 border border-gray-200">
                {new Date(item.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  weekday: 'short'
                })}
              </td>
              <td className="p-3 border border-gray-200 text-center font-medium">
                {item.bookings}
              </td>
              <td className="p-3 border border-gray-200 text-center">
                {item.hours}
              </td>
              <td className="p-3 border border-gray-200 text-right font-medium text-green-700">
                PKR {item.revenue.toLocaleString()}/-
              </td>
            </tr>
          ))}
          <tr className="bg-green-50 font-bold">
            <td className="p-3 border border-gray-200">Total</td>
            <td className="p-3 border border-gray-200 text-center">{reportData.totalBookings}</td>
            <td className="p-3 border border-gray-200 text-center">{reportData.totalHours}</td>
            <td className="p-3 border border-gray-200 text-right text-green-800">
              PKR {reportData.totalRevenue.toLocaleString()}/-
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;