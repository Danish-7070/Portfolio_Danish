import React from 'react';
import { DollarSign, Calendar, Clock } from 'lucide-react';

/**
 * Component for displaying financial report summary stats
 * @param {Object} props - Component props
 * @param {Object} props.reportData - Financial report data
 */
const ReportSummary = ({ reportData }) => {
  if (!reportData) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <DollarSign className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-xl font-bold">PKR {reportData.totalRevenue}/-</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Calendar className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-xl font-bold">{reportData.totalBookings}</p>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <Clock className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Hours</p>
            <p className="text-xl font-bold">{reportData.totalHours}</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-600">Bookings With Lights</p>
            <p className="text-xl font-bold">{reportData.bookingsWithLights}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-600">Bookings Without Lights</p>
            <p className="text-xl font-bold">{reportData.bookingsWithoutLights}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummary;