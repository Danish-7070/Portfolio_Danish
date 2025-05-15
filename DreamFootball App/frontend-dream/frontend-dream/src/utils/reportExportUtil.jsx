/**
 * Export financial report data to CSV or PDF files
 */

/**
 * Export financial report data to CSV file
 * @param {Object} reportData - Financial report data
 * @param {Object} metadata - Additional metadata (ground name, month name, year)
 */
export const exportToCSV = (reportData, metadata) => {
  if (!reportData) return;
  
  const { groundName, monthName, year, isMultipleGrounds, selectedGroundNames } = metadata;
  
  // Create CSV content with proper line breaks
  let csvRows = [];
  
  // Header section
  if (isMultipleGrounds) {
    csvRows.push(['Combined Financial Report']);
    csvRows.push(['Month', 'Year', 'Total Revenue', 'Total Bookings', 'Total Hours', 'With Lights', 'Without Lights']);
    csvRows.push([
      monthName,
      year,
      reportData.totalRevenue,
      reportData.totalBookings,
      reportData.totalHours,
      reportData.bookingsWithLights,
      reportData.bookingsWithoutLights
    ]);
    
    // Add list of included grounds
    csvRows.push([]);
    csvRows.push(['Included Grounds']);
    selectedGroundNames.forEach((name, index) => {
      csvRows.push([`${index + 1}. ${name}`]);
    });
  } else {
    // Single ground format
    csvRows.push(['Ground', 'Month', 'Year', 'Total Revenue', 'Total Bookings', 'Total Hours', 'With Lights', 'Without Lights']);
    csvRows.push([
      groundName,
      monthName,
      year,
      reportData.totalRevenue,
      reportData.totalBookings,
      reportData.totalHours,
      reportData.bookingsWithLights,
      reportData.bookingsWithoutLights
    ]);
  }
  
  // Add separator rows
  csvRows.push([]);
  csvRows.push([]);
  
  // Daily data section - if available
  if (reportData.dailyData && reportData.dailyData.length > 0) {
    csvRows.push(['Daily Breakdown']);
    csvRows.push(['Date', 'Bookings', 'Hours', 'Revenue']);
    
    // Add daily data rows
    reportData.dailyData.forEach(item => {
      csvRows.push([
        new Date(item.date).toLocaleDateString(),
        item.bookings,
        item.hours,
        item.revenue
      ]);
    });
  }
  
  // Convert each row to CSV string and join with newlines
  // Proper escaping of fields for CSV format
  const processRow = (row) => {
    return row.map(field => {
      // If field contains commas, quotes, or newlines, wrap in quotes
      if (field && (String(field).includes(',') || String(field).includes('"') || String(field).includes('\n'))) {
        return `"${String(field).replace(/"/g, '""')}"`;
      }
      return field;
    }).join(',');
  };
  
  const csvString = csvRows.map(processRow).join('\n');
  
  // Create and download the file
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  
  // Set filename based on whether it's a single or multiple ground report
  let filename = isMultipleGrounds
    ? `combined-financial-report-${monthName}-${year}.csv`
    : `financial-report-${groundName}-${monthName}-${year}.csv`;
    
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export financial report data to PDF file without using jspdf-autotable
 * @param {Object} reportData - Financial report data
 * @param {Object} metadata - Additional metadata (ground name, month name, year)
 */
export const exportToPDF = (reportData, metadata) => {
  if (!reportData) return;
  
  try {
    // Dynamically import jsPDF to ensure it's available
    import('jspdf').then(({ jsPDF }) => {
      const { groundName, monthName, year, isMultipleGrounds, selectedGroundNames } = metadata;
      
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Document settings
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const lineHeight = 7;
      let currentY = 0;
      
      // Add header with title
      doc.setFillColor(171, 255, 206);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // Title
      currentY = 15;
      doc.setFontSize(20);
      doc.setTextColor(39, 174, 96);
      
      if (isMultipleGrounds) {
        doc.text('Combined Financial Report', margin, currentY);
      } else {
        doc.text('Financial Report', margin, currentY);
      }
      
      // Subtitle with ground and period
      currentY = 25;
      doc.setFontSize(12);
      doc.setTextColor(70, 70, 70);
      
      if (isMultipleGrounds) {
        doc.text(`Multiple Grounds | ${monthName} ${year}`, margin, currentY);
      } else {
        doc.text(`${groundName} | ${monthName} ${year}`, margin, currentY);
      }
      
      // Add grounds list for multiple grounds report
      if (isMultipleGrounds && selectedGroundNames && selectedGroundNames.length > 0) {
        currentY = 45;
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text('Included Grounds:', margin, currentY);
        
        currentY += 5;
        doc.setFontSize(10);
        
        selectedGroundNames.forEach((name, index) => {
          if (currentY > pageHeight - 20) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.text(`${index + 1}. ${name}`, margin + 5, currentY);
          currentY += 5;
        });
        
        currentY += 5;
      } else {
        currentY = 50;
      }
      
      // Add summary section
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.text('Summary', margin, currentY);
      
      // Draw summary table manually
      currentY += 5;
      
      // Table dimensions
      const colWidth1 = 75;  // Metric column
      const colWidth2 = 55;  // Value column
      const tableWidth = colWidth1 + colWidth2;
      const rowHeight = 10;
      const cellPadding = 2;
      
      // Draw the table header
      doc.setFillColor(39, 174, 96);
      doc.rect(margin, currentY, tableWidth, rowHeight, 'F');
      
      doc.setFont(undefined, 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text('Metric', margin + cellPadding, currentY + rowHeight - cellPadding);
      doc.text('Value', margin + colWidth1 + cellPadding, currentY + rowHeight - cellPadding);
      
      // Format summary data
      const summaryData = [
        ['Total Revenue', `PKR ${reportData.totalRevenue.toLocaleString()}/-`],
        ['Total Bookings', reportData.totalBookings],
        ['Total Hours', reportData.totalHours],
        ['Bookings With Lights', reportData.bookingsWithLights],
        ['Bookings Without Lights', reportData.bookingsWithoutLights]
      ];
      
      // Draw summary rows
      doc.setFont(undefined, 'normal');
      currentY += rowHeight;
      
      summaryData.forEach((row, index) => {
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, currentY, tableWidth, rowHeight, 'F');
        }
        
        doc.setTextColor(60, 60, 60);
        doc.text(String(row[0]), margin + cellPadding, currentY + rowHeight - cellPadding);
        
        // Right align the values
        const valueText = String(row[1]);
        const valueWidth = doc.getTextWidth(valueText);
        const valueX = margin + colWidth1 + colWidth2 - cellPadding - valueWidth;
        doc.text(valueText, valueX, currentY + rowHeight - cellPadding);
        
        currentY += rowHeight;
      });
      
      // Add daily breakdown section if data is available
      if (reportData.dailyData && reportData.dailyData.length > 0) {
        currentY += 15;
        
        // Section title
        doc.setFontSize(14);
        doc.setTextColor(60, 60, 60);
        doc.text('Daily Breakdown', margin, currentY);
        
        currentY += 10;
        
        // Daily table dimensions
        const dailyColWidths = [35, 25, 25, 45];
        const dailyTableWidth = dailyColWidths.reduce((a, b) => a + b, 0);
        
        // Draw the daily table header
        doc.setFillColor(39, 174, 96);
        doc.rect(margin, currentY, dailyTableWidth, rowHeight, 'F');
        
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        
        let headerX = margin + cellPadding;
        doc.text('Date', headerX, currentY + rowHeight - cellPadding);
        headerX += dailyColWidths[0];
        
        doc.text('Bookings', headerX, currentY + rowHeight - cellPadding);
        headerX += dailyColWidths[1];
        
        doc.text('Hours', headerX, currentY + rowHeight - cellPadding);
        headerX += dailyColWidths[2];
        
        doc.text('Revenue', headerX, currentY + rowHeight - cellPadding);
        
        // Draw daily rows
        doc.setFont(undefined, 'normal');
        currentY += rowHeight;
        
        reportData.dailyData.forEach((item, index) => {
          // Check if we need a new page
          if (currentY > pageHeight - 30) {
            doc.addPage();
            currentY = 20;
          }
          
          // Alternate row colors
          if (index % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(margin, currentY, dailyTableWidth, rowHeight, 'F');
          }
          
          doc.setTextColor(60, 60, 60);
          
          let x = margin + cellPadding;
          
          // Date
          doc.text(new Date(item.date).toLocaleDateString(), x, currentY + rowHeight - cellPadding);
          x += dailyColWidths[0];
          
          // Bookings
          doc.text(String(item.bookings), x, currentY + rowHeight - cellPadding);
          x += dailyColWidths[1];
          
          // Hours
          doc.text(String(item.hours), x, currentY + rowHeight - cellPadding);
          x += dailyColWidths[2];
          
          // Revenue - right aligned
          const revenueText = `PKR ${item.revenue.toLocaleString()}/-`;
          const revenueWidth = doc.getTextWidth(revenueText);
          const revenueX = margin + dailyTableWidth - cellPadding - revenueWidth;
          doc.text(revenueText, revenueX, currentY + rowHeight - cellPadding);
          
          currentY += rowHeight;
        });
      }
      
      // Add footer to all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Add page number
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        
        // Add generation timestamp
        doc.text(
          `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 
          margin, 
          pageHeight - 10
        );
      }
      
      // Save PDF
      let filename = isMultipleGrounds
        ? `combined-financial-report-${monthName}-${year}.pdf`
        : `financial-report-${groundName}-${monthName}-${year}.pdf`;
        
      doc.save(filename);
    }).catch(error => {
      console.error('Error loading jsPDF:', error);
      // Fallback to browser print method if jsPDF fails
      fallbackToBrowserPrint(reportData, metadata);
    });
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    // Fallback to browser print method
    fallbackToBrowserPrint(reportData, metadata);
  }
};

/**
 * Browser print fallback for PDF generation
 * @param {Object} reportData - Financial report data
 * @param {Object} metadata - Additional metadata
 */
const fallbackToBrowserPrint = (reportData, metadata) => {
  const { groundName, monthName, year, isMultipleGrounds, selectedGroundNames } = metadata;
  
  let title = isMultipleGrounds
    ? `Combined Financial Report - ${monthName} ${year}`
    : `Financial Report - ${groundName} - ${monthName} ${year}`;
  
  let htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .header { background-color: rgba(39, 174, 96, 0.1); padding: 20px; margin-bottom: 30px; }
          .title { color: #27ae60; font-size: 24px; margin: 0; }
          .subtitle { color: #444; font-size: 16px; margin: 5px 0 0; }
          h2 { color: #444; font-size: 18px; margin: 30px 0 15px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background-color: #27ae60; color: white; text-align: left; padding: 10px; }
          td { padding: 10px; border-bottom: 1px solid #eee; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { font-size: 12px; color: #777; margin-top: 40px; text-align: center; }
          .grounds-list { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
          .grounds-list ul { margin: 10px 0 0 20px; padding: 0; }
          .grounds-list li { margin-bottom: 5px; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
            .header { background-color: rgba(39, 174, 96, 0.1) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            th { background-color: #27ae60 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            tr:nth-child(even) { background-color: #f9f9f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">${isMultipleGrounds ? 'Combined Financial Report' : 'Financial Report'}</h1>
          <p class="subtitle">${isMultipleGrounds ? 'Multiple Grounds' : groundName} | ${monthName} ${year}</p>
        </div>
        
        ${isMultipleGrounds && selectedGroundNames && selectedGroundNames.length > 0 ? `
          <div class="grounds-list">
            <h3 style="margin-top: 0;">Included Grounds:</h3>
            <ul>
              ${selectedGroundNames.map(name => `<li>${name}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        <h2>Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Revenue</td>
              <td>PKR ${reportData.totalRevenue.toLocaleString()}/-</td>
            </tr>
            <tr>
              <td>Total Bookings</td>
              <td>${reportData.totalBookings}</td>
            </tr>
            <tr>
              <td>Total Hours</td>
              <td>${reportData.totalHours}</td>
            </tr>
            <tr>
              <td>Bookings With Lights</td>
              <td>${reportData.bookingsWithLights}</td>
            </tr>
            <tr>
              <td>Bookings Without Lights</td>
              <td>${reportData.bookingsWithoutLights}</td>
            </tr>
          </tbody>
        </table>
        
        ${reportData.dailyData && reportData.dailyData.length > 0 ? `
          <h2>Daily Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Bookings</th>
                <th>Hours</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.dailyData.map(item => `
                <tr>
                  <td>${new Date(item.date).toLocaleDateString()}</td>
                  <td>${item.bookings}</td>
                  <td>${item.hours}</td>
                  <td>PKR ${item.revenue.toLocaleString()}/-</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
        
        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <p style="color: #27ae60; font-weight: bold;">Your PDF is ready!</p>
          <p>Use your browser's print function (Ctrl+P or Cmd+P) and select "Save as PDF".</p>
          <button onclick="window.print()" style="background: #27ae60; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 4px; cursor: pointer;">
            Print/Save as PDF
          </button>
        </div>
      </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Automatically trigger print after a short delay
  setTimeout(() => {
    printWindow.print();
  }, 500);
  
  // Alert the user about the fallback method
  alert('Using browser print dialog to generate PDF. Please select "Save as PDF" when the print dialog appears.');
};