/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable new-cap */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fNumber } from 'src/utils/format-number';

// Function to generate PDF
export const generatePDF = (filteredData, party) => {
  const doc = new jsPDF({
    orientation: 'landscape', // Use landscape mode for better table fit
    unit: 'mm',
    format: 'a4',
  });

  // Set the main title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 87, 34); // Orange color
  doc.text(`Ledger Statement of ${party}`, 15, 20);

  // Table headers and data
  const headers = [
    ['Tally Invoice No', 'Tally Order ID', 'Bill Date', 'Opening Balance', 'Closing Balance', 'Credit Period'],
  ];

  const data = filteredData.map((item) => [
    item.tallyInvNo || 'N/A',
    item.tallyOrdId || 'N/A',
    item.billDate || 'N/A',
    `Rs: ${fNumber(item.openingBalance || 0)}`,
    `Rs: ${fNumber(item.closingBalance || 0)}`,
    item.creditPeriod || 'N/A',
  ]);

  // Add table with auto page breaks and proper styling
  doc.autoTable({
    head: headers,
    body: data,
    startY: 40,
    theme: 'grid',
    margin: { top: 40 },
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 3,
      overflow: 'linebreak', // Allow text wrapping
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 45 }, // Tally Invoice No
      1: { halign: 'center', cellWidth: 45 }, // Tally Order ID
      2: { halign: 'center', cellWidth: 35 }, // Bill Date
      3: { halign: 'right', cellWidth: 50 },  // Opening Balance
      4: { halign: 'right', cellWidth: 50 },  // Closing Balance
      5: { halign: 'center', cellWidth: 35 }, // Credit Period
    },
    headStyles: {
      fillColor: [255, 87, 34], // Orange header background
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray alternate row
    didDrawPage: () => {
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(`Page ${pageCount}`, 285, 200, { align: 'right' });
    },
    pageBreak: 'auto', // Automatically insert page breaks
  });

  // Save the generated PDF
  doc.save(`ledger_statement_${party}.pdf`);
};
