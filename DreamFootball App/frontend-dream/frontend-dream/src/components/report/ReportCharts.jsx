import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Label
} from 'recharts';
import { getBarChartData, getDonutChartData, createTooltipFormatter, renderCustomizedLabel } from '../../utils/reportChartUtil';

/**
 * Component for displaying financial report charts
 * @param {Object} props - Component props
 * @param {Object} props.reportData - Financial report data
 */
const ReportCharts = ({ reportData }) => {
  if (!reportData || !reportData.dailyData || reportData.dailyData.length === 0) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg text-center">
        <p className="text-yellow-700">No data available for charts.</p>
      </div>
    );
  }

  const barChartData = getBarChartData(reportData.dailyData);
  const donutChartData = getDonutChartData(reportData);
  const tooltipFormatter = createTooltipFormatter();

  // Custom colors for better visual appeal
  const COLORS = {
    revenue: "#10B981", // Green
    bookings: "#6366F1", // Indigo
    hours: "#F59E0B",    // Amber
    withLights: "#8B5CF6", // Purple
    withoutLights: "#60A5FA" // Blue
  };

  return (
    <div className="space-y-8">
      {/* Daily Revenue Bar Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Daily Revenue & Activity</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={barChartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              barGap={8}
              barSize={12}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                axisLine={{ stroke: "#9CA3AF" }}
                tickLine={{ stroke: "#9CA3AF" }}
                tick={{ fill: "#4B5563", fontSize: 12 }}
              >
                <Label 
                  value="Day of Month" 
                  position="insideBottom" 
                  offset={-15} 
                  style={{ textAnchor: 'middle', fontSize: 12, fill: "#4B5563" }}
                />
              </XAxis>
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke={COLORS.revenue}
                axisLine={{ stroke: "#9CA3AF" }}
                tickLine={{ stroke: "#9CA3AF" }}
                tick={{ fill: "#4B5563", fontSize: 12 }}
              >
                <Label 
                  value="Revenue (PKR)" 
                  angle={-90} 
                  position="insideLeft" 
                  style={{ textAnchor: 'middle', fontSize: 12, fill: "#4B5563" }}
                />
              </YAxis>
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke={COLORS.bookings}
                axisLine={{ stroke: "#9CA3AF" }}
                tickLine={{ stroke: "#9CA3AF" }}
                tick={{ fill: "#4B5563", fontSize: 12 }}
              >
                <Label 
                  value="Count" 
                  angle={90} 
                  position="insideRight" 
                  style={{ textAnchor: 'middle', fontSize: 12, fill: "#4B5563" }}
                />
              </YAxis>
              <Tooltip 
                formatter={tooltipFormatter} 
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.95)", 
                  borderRadius: "6px", 
                  borderColor: "#E5E7EB",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                cursor={{ fill: "rgba(229, 231, 235, 0.4)" }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                iconType="circle"
                iconSize={10}
              />
              <Bar 
                yAxisId="left" 
                dataKey="revenue" 
                name="Revenue" 
                fill={COLORS.revenue}
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="right" 
                dataKey="bookings" 
                name="Bookings" 
                fill={COLORS.bookings}
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="right" 
                dataKey="hours" 
                name="Hours" 
                fill={COLORS.hours}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Distribution Donut Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Booking Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <Pie
                data={donutChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                innerRadius={70}
                paddingAngle={2}
                fill="#8884d8"
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                animationBegin={0}
                animationDuration={1000}
              >
                {donutChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? COLORS.withLights : COLORS.withoutLights} 
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                ))}
                <Label
                  position="center"
                  value={`Total: ${reportData.totalBookings}`}
                  style={{ fontSize: '16px', fill: '#374151', fontWeight: 'bold' }}
                />
              </Pie>
              <Tooltip 
                formatter={tooltipFormatter} 
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.95)", 
                  borderRadius: "6px", 
                  borderColor: "#E5E7EB",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: 20 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportCharts;