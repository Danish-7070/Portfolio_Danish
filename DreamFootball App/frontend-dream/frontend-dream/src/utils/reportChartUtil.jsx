/**
 * Utility functions for generating charts in financial reports
 */

/**
 * Format daily data for bar charts
 * @param {Array} dailyData - Daily financial data
 * @returns {Array} Formatted data for charts
 */
export const getBarChartData = (dailyData) => {
  if (!dailyData || dailyData.length === 0) return [];
  
  // Sort by date to ensure chronological order
  const sortedData = [...dailyData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return sortedData.map(item => ({
    date: new Date(item.date).getDate(),
    dateLabel: new Date(item.date).toLocaleDateString('en-US', { day: 'numeric' }),
    revenue: item.revenue,
    bookings: item.bookings,
    hours: item.hours
  }));
};

/**
 * Format data for donut/pie chart showing booking distribution
 * @param {Object} reportData - The complete report data
 * @returns {Array} Formatted data for donut chart
 */
export const getDonutChartData = (reportData) => {
  if (!reportData) return [];
  
  return [
    {
      name: 'With Lights',
      value: reportData.bookingsWithLights || 0,
      fill: '#8B5CF6' // Purple
    },
    {
      name: 'Without Lights',
      value: reportData.bookingsWithoutLights || 0,
      fill: '#60A5FA' // Blue
    }
  ];
};

/**
 * Create custom tooltip formatter for charts
 * @returns {Function} Tooltip formatter function
 */
export const createTooltipFormatter = () => {
  return (value, name) => {
    if (value === undefined || value === null) return ['-', name];
    
    switch(name) {
      case 'revenue':
        return [`PKR ${value.toLocaleString()}/-`, 'Revenue'];
      case 'bookings':
        return [`${value} bookings`, 'Bookings'];
      case 'hours':
        return [`${value} hrs`, 'Hours'];
      case 'With Lights':
      case 'Without Lights':
        return [`${value} bookings`, name];
      default:
        return [value, name];
    }
  };
};

/**
 * Custom render function for labels in pie/donut charts
 * @param {Object} props - Chart props
 * @returns {JSX.Element|null} Rendered label
 */
export const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
  if (!value || value === 0) return null;
  
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.75;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  const percentValue = (percent * 100).toFixed(0);
  // Only show percentage for significant portions (avoid crowding)
  if (percentValue < 5) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${percentValue}%`}
    </text>
  );
};