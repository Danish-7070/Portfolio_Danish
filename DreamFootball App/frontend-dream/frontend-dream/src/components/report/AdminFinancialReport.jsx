import React, { useState, useEffect } from 'react';
import { Download, Filter, DollarSign, FileText, RefreshCw, BarChart3 } from 'lucide-react';
import axios from 'axios';

// Import modular components
import ReportSummary from './ReportSummary';
import ReportCharts from './ReportCharts';
import ReportTable from './ReportTable';

// Import utility functions
import { exportToCSV } from '../../utils/reportExportUtil';
import AdminSiderbar from '../sidebar/sidebar';

const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const AdminFinancialReport = () => {
  // State management
  const [grounds, setGrounds] = useState([]);
  const [selectedGround, setSelectedGround] = useState('');
  const [selectedGrounds, setSelectedGrounds] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState({ csv: false, pdf: false });
  const [selectionMode, setSelectionMode] = useState('single'); // 'single' or 'multiple'

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 16 }, (_, i) => 2020 + i);

  // Fetch grounds on component mount
  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const response = await axios.get(`${URL}/admin/financial-report/grounds`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem("token")}`,
          }
        });
        setGrounds(response.data);
      } catch (err) {
        setError('Failed to fetch grounds');
        console.error(err);
      }
    };

    fetchGrounds();
  }, []);

  // Fetch report data when Generate Report button is clicked
  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (selectionMode === 'single') {
        // Single ground report
        if (!selectedGround) {
          setError('Please select a ground');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${URL}/admin/financial-report`, {
          params: {
            groundId: selectedGround,
            month: selectedMonth,
            year: selectedYear
          },
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          }
        });
        setReportData(response.data);
      } else {
        // Multiple grounds report
        if (selectedGrounds.length === 0) {
          setError('Please select at least one ground');
          setLoading(false);
          return;
        }
        
        // Fetch reports for all selected grounds
        const promises = selectedGrounds.map(groundId => 
          axios.get(`${URL}/admin/financial-report`, {
            params: {
              groundId,
              month: selectedMonth,
              year: selectedYear
            },
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            }
          })
        );
        
        const responses = await Promise.all(promises);
        
        // Merge all report data into one
        const combinedReportData = mergeCombineReports(responses.map(response => response.data));
        setReportData(combinedReportData);
      }
    } catch (err) {
      setError('Failed to fetch report data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Merge multiple reports into one combined report
  const mergeCombineReports = (reports) => {
    if (!reports || reports.length === 0) return null;
    
    // Initialize combined report with zeroed counters
    const combinedReport = {
      totalRevenue: 0,
      totalBookings: 0,
      totalHours: 0,
      bookingsWithLights: 0,
      bookingsWithoutLights: 0,
      dailyData: []
    };
    
    // Daily data map to merge entries by date
    const dailyDataMap = new Map();
    
    // Process each report
    reports.forEach(report => {
      // Add to totals
      combinedReport.totalRevenue += report.totalRevenue || 0;
      combinedReport.totalBookings += report.totalBookings || 0;
      combinedReport.totalHours += report.totalHours || 0;
      combinedReport.bookingsWithLights += report.bookingsWithLights || 0;
      combinedReport.bookingsWithoutLights += report.bookingsWithoutLights || 0;
      
      // Process daily data
      if (report.dailyData && report.dailyData.length > 0) {
        report.dailyData.forEach(dayData => {
          const dateKey = new Date(dayData.date).toISOString().split('T')[0];
          
          if (!dailyDataMap.has(dateKey)) {
            dailyDataMap.set(dateKey, {
              date: new Date(dayData.date),
              bookings: 0,
              revenue: 0,
              hours: 0
            });
          }
          
          const existingData = dailyDataMap.get(dateKey);
          existingData.bookings += dayData.bookings;
          existingData.revenue += dayData.revenue;
          existingData.hours += dayData.hours;
        });
      }
    });
    
    // Convert daily data map back to array
    combinedReport.dailyData = Array.from(dailyDataMap.values()).sort((a, b) => a.date - b.date);
    
    return combinedReport;
  };

  const handleSelectionModeChange = (mode) => {
    setSelectionMode(mode);
    // Reset selections when changing modes
    if (mode === 'single') {
      setSelectedGrounds([]);
    } else {
      setSelectedGround('');
    }
  };

  const handleGroundChange = (e) => {
    setSelectedGround(e.target.value);
  };

  const handleGroundCheckboxChange = (groundId) => {
    setSelectedGrounds(prev => {
      if (prev.includes(groundId)) {
        return prev.filter(id => id !== groundId);
      } else {
        return [...prev, groundId];
      }
    });
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleExportCSV = () => {
    if (!reportData) return;
    
    setExportLoading(prev => ({ ...prev, csv: true }));
    try {
      let groundName = "Multiple Grounds";
      
      if (selectionMode === 'single') {
        groundName = grounds.find(g => g._id === selectedGround)?.name || 'Unknown';
      } else if (selectedGrounds.length === 1) {
        groundName = grounds.find(g => g._id === selectedGrounds[0])?.name || 'Unknown';
      }
      
      exportToCSV(reportData, {
        groundName,
        isMultipleGrounds: selectionMode === 'multiple' && selectedGrounds.length > 1,
        selectedGroundNames: selectionMode === 'multiple' ? 
          selectedGrounds.map(id => grounds.find(g => g._id === id)?.name).filter(Boolean) : [],
        monthName: months[selectedMonth],
        year: selectedYear
      });
    } catch (error) {
      console.error('CSV export error:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setExportLoading(prev => ({ ...prev, csv: false }));
    }
  };

  const handleExportPDF = () => {
    if (!reportData) return;
    
    setExportLoading(prev => ({ ...prev, pdf: true }));
    try {
      // Dynamically import the exportToPDF function
      import('../../utils/reportExportUtil').then(({ exportToPDF }) => {
        let groundName = "Multiple Grounds";
        
        if (selectionMode === 'single') {
          groundName = grounds.find(g => g._id === selectedGround)?.name || 'Unknown';
        } else if (selectedGrounds.length === 1) {
          groundName = grounds.find(g => g._id === selectedGrounds[0])?.name || 'Unknown';
        }
        
        exportToPDF(reportData, {
          groundName,
          isMultipleGrounds: selectionMode === 'multiple' && selectedGrounds.length > 1,
          selectedGroundNames: selectionMode === 'multiple' ? 
            selectedGrounds.map(id => grounds.find(g => g._id === id)?.name).filter(Boolean) : [],
          monthName: months[selectedMonth],
          year: selectedYear
        });
      }).catch(error => {
        console.error('Failed to load PDF export function:', error);
        alert('Failed to generate PDF. Please try again later.');
      });
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setTimeout(() => {
        setExportLoading(prev => ({ ...prev, pdf: false }));
      }, 2000); // Give time for PDF generation
    }
  };

  return (
    <>
     <AdminSiderbar />
     <div className="bg-white p-6 rounded-lg shadow-md mt-14">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="text-green-600" size={28} />
          <h5 className="text-2xl font-bold text-gray-800">Financial Report</h5>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleExportCSV} 
            disabled={!reportData || exportLoading.csv}
            className="px-4 py-2 flex items-center gap-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportLoading.csv ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} />
                Export CSV
              </>
            )}
          </button>
          <button 
            onClick={handleExportPDF} 
            disabled={!reportData || exportLoading.pdf}
            className="px-4 py-2 flex items-center gap-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportLoading.pdf ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileText size={16} />
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
        {/* Ground Selection Mode */}
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="text-gray-600" size={20} />
          <h5 className="text-lg font-semibold text-gray-700">Selection Mode</h5>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="selectionMode"
              checked={selectionMode === 'single'}
              onChange={() => handleSelectionModeChange('single')}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700 font-medium">Single Ground</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="selectionMode"
              checked={selectionMode === 'multiple'}
              onChange={() => handleSelectionModeChange('multiple')}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700 font-medium">Multiple Grounds</span>
          </label>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-gray-600" size={20} />
          <h5 className="text-lg font-semibold text-gray-700">Report Filters</h5>
        </div>

        <div className="flex flex-col gap-4">
          {/* Ground selection */}
          <div className="flex flex-wrap gap-4 items-center">
            {selectionMode === 'single' ? (
              <select
                value={selectedGround}
                onChange={handleGroundChange}
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
              >
                <option value="">Select Ground</option>
                {grounds.map(ground => (
                  <option key={ground._id} value={ground._id}>{ground.name}</option>
                ))}
              </select>
            ) : (
              <div className="bg-white border border-gray-300 rounded-md p-3 w-full max-h-48 overflow-y-auto">
                <div className="flex flex-wrap gap-3">
                  {grounds.map(ground => (
                    <label key={ground._id} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={selectedGrounds.includes(ground._id)}
                        onChange={() => handleGroundCheckboxChange(ground._id)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700">{ground.name}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-2 text-gray-500 text-sm">
                  Selected: {selectedGrounds.length} ground{selectedGrounds.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}

            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <button 
              onClick={fetchReportData}
              disabled={loading || (selectionMode === 'single' && !selectedGround) || (selectionMode === 'multiple' && selectedGrounds.length === 0)}
              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <BarChart3 size={16} />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw size={36} className="text-green-500 animate-spin" />
            <p className="text-gray-600 mt-2">Loading report data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && reportData && (
        <div className="space-y-8">
          {/* Mode indicator */}
          {selectionMode === 'multiple' && selectedGrounds.length > 1 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800">Combined Report</h3>
              <p className="text-blue-600">
                Showing combined data for {selectedGrounds.length} grounds:
                {' '}
                {selectedGrounds.map(id => 
                  grounds.find(g => g._id === id)?.name
                ).filter(Boolean).join(', ')}
              </p>
            </div>
          )}
          
          {/* Summary Component */}
          <ReportSummary reportData={reportData} />

          {/* Charts Component */}
          <ReportCharts reportData={reportData} />

          {/* Table Component */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Daily Breakdown</h3>
            <ReportTable reportData={reportData} />
          </div>
        </div>
      )}

      {!loading && !error && !reportData && (
        <div className="bg-blue-50 p-8 rounded-lg text-center border border-blue-100 shadow-sm">
          <p className="text-blue-700 text-lg font-medium">
            {selectionMode === 'single' 
              ? 'Please select a ground and click Generate Report to view the financial report.'
              : 'Please select one or more grounds and click Generate Report to view the combined financial report.'}
          </p>
        </div>
      )}
    </div>
    </>
  );
};

export default AdminFinancialReport;