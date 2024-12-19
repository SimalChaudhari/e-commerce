/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable new-cap */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fNumber } from 'src/utils/format-number';

// Function to generate PDF
export const generatePDF = (filteredData, party) => {
  // Create a new instance of jsPDF
  const doc = new jsPDF();

  // Set the main title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 87, 34); // Orange color similar to your reference
  doc.text(`Ledger Statement of ${party}`, 15, 20);

  // Get current date in "dd/mm/yyyy" format
  // const currentDate = new Date();
  // const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
  // doc.text(formattedDate, 170, 20);

  // Table header and data (Updated to match filteredData)
  const headers = [['Voucher No', 'Voucher Type', 'Ledger', 'Date', 'Credit Amount', 'Debit Amount']];
  const data = filteredData.map((item) => [
    item.voucherNo,
    item.voucherType,
    item.ledger,
    item.date,
    `Rs: ${fNumber(item.creditAmount)}`,
    `Rs: ${fNumber(item.debitAmount)}`,
  ]);

  // Adding the transaction details table
  doc.autoTable({
    head: headers,
    body: data,
    startY: 40, // Adjusted start position for the table
    theme: 'grid', // Optional: styling for better visuals
    headStyles: {
      fillColor: [255, 87, 34], // Orange header
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 30 }, // Voucher No alignment and width (Center aligned)
      1: { halign: 'center', cellWidth: 30 }, // Voucher Type alignment and width (Center aligned)
      2: { halign: 'center', cellWidth: 40 }, // Ledger alignment and width (Center aligned)
      3: { halign: 'center', cellWidth: 30 }, // Date alignment and width (Center aligned)
      4: { halign: 'right', cellWidth: 30 }, // Credit Amount alignment and width (Right aligned)
      5: { halign: 'right', cellWidth: 30 }, // Debit Amount alignment and width (Right aligned)
    },
    didParseCell({ section, column, cell }) {
      if (section === 'head') {
        // Set alignment for each header cell based on column index
        if (column.index === 0 || column.index === 1 || column.index === 2 || column.index === 3) {
          cell.styles.halign = 'center'; // Center aligned for columns 0, 1, 2, and 3
        } else if (column.index === 4 || column.index === 5) {
          cell.styles.halign = 'right'; // Right aligned for columns 4 and 5
        }
      }
    },
  });

  // Calculate total credit and debit amounts
  const totalCredit = filteredData.reduce((total, item) => total + item.creditAmount, 0);
  const totalDebit = filteredData.reduce((total, item) => total + item.debitAmount, 0);
  const netAmount = totalCredit - totalDebit;

  // Add the total amounts below the table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 87, 34); // Orange for total section
  doc.text(`Total Credit Rs: ${fNumber(totalCredit)}`, 15, doc.previousAutoTable.finalY + 10);
  doc.text(`Total Debit Rs: ${fNumber(totalDebit)}`, 15, doc.previousAutoTable.finalY + 20);
  doc.text(`Net Amount Rs: ${fNumber(netAmount)}`, 15, doc.previousAutoTable.finalY + 30);

  // Save the generated PDF
  doc.save('purchase_order.pdf');
};



// Function to generate PDF and trigger print
export const generatePrint = (filteredData, party) => {

  const doc = new jsPDF();

  // Set the main title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 87, 34); // Orange color similar to your reference
  doc.text(`Ledger Statement of ${party}`, 15, 20);

  // Get current date in "dd/mm/yyyy" format
  // const currentDate = new Date();
  // const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
  // doc.text(formattedDate, 170, 20);

  // Table header and data (Updated to match filteredData)
  const headers = [['Voucher No', 'Voucher Type', 'Ledger', 'Date', 'Credit Amount', 'Debit Amount']];
  const data = filteredData.map((item) => [
    item.voucherNo,
    item.voucherType,
    item.ledger,
    item.date,
    `Rs: ${fNumber(item.creditAmount)}`,
    `Rs: ${fNumber(item.debitAmount)}`,
  ]);

  // Adding the transaction details table with page overflow handling
  doc.autoTable({
    head: headers,
    body: data,
    startY: 40, // Adjusted start position for the table
    theme: 'grid', // Optional: styling for better visuals
    headStyles: {
      fillColor: [255, 87, 34], // Orange header
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 30 }, // Voucher No alignment and width (Center aligned)
      1: { halign: 'center', cellWidth: 30 }, // Voucher Type alignment and width (Center aligned)
      2: { halign: 'center', cellWidth: 40 }, // Ledger alignment and width (Center aligned)
      3: { halign: 'center', cellWidth: 30 }, // Date alignment and width (Center aligned)
      4: { halign: 'right', cellWidth: 30 }, // Credit Amount alignment and width (Right aligned)
      5: { halign: 'right', cellWidth: 30 }, // Debit Amount alignment and width (Right aligned)
    },
    didParseCell({ section, column, cell }) {
      if (section === 'head') {
        // Set alignment for each header cell based on column index
        if (column.index === 0 || column.index === 1 || column.index === 2 || column.index === 3) {
          cell.styles.halign = 'center'; // Center aligned for columns 0, 1, 2, and 3
        } else if (column.index === 4 || column.index === 5) {
          cell.styles.halign = 'right'; // Right aligned for columns 4 and 5
        }
      }
    },
    margin: { top: 20, left: 15, bottom: 20 }, // Add margins to prevent overflow
    // Optional: Add page break when necessary
    pageBreak: 'auto',
  });

  // Calculate total credit and debit amounts
  const totalCredit = filteredData.reduce((total, item) => total + item.creditAmount, 0);
  const totalDebit = filteredData.reduce((total, item) => total + item.debitAmount, 0);
  const netAmount = totalCredit - totalDebit;

  // Add the total amounts below the table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 87, 34); // Orange for total section
  doc.text(`Total Credit Rs: ${fNumber(totalCredit)}`, 15, doc.previousAutoTable.finalY + 10);
  doc.text(`Total Debit Rs: ${fNumber(totalDebit)}`, 15, doc.previousAutoTable.finalY + 20);
  doc.text(`Net Amount Rs: ${fNumber(netAmount)}`, 15, doc.previousAutoTable.finalY + 30);

  // Trigger the print dialog
  doc.autoPrint();

  // Open the print dialog directly after generating the PDF
  window.open(doc.output('bloburl'), '_blank');
};