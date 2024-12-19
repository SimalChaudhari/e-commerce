import { fCurrency } from 'src/utils/format-number';
import * as XLSX from 'xlsx';

/**
 * Export data to an Excel file.
 *
 * @param {Array} data - The data to export.
 * @param {Object} filters - The filters containing startDate and endDate.
 * @param {Function} fIsBetween - Function to check if a date is between two dates.
 */
export const exportToExcel = (data, filters, fIsBetween) => {
    if (!data || data.length === 0) {
        console.error('No data available for export.');
        return;
    }

    const { startDate, endDate } = filters.state;

    // Filter data based on the date range
    const filteredData = startDate && endDate
        ? data.filter((item) => fIsBetween(item.createdAt, startDate, endDate))
        : data;

    if (filteredData.length === 0) {
        console.warn('No data found for the selected date range.');
        return;
    }

    // Flatten and structure data for export
    const exportData = filteredData.map((item) => ({
        OrderNo: item.orderNo,
        ProductDetails: item.orderItems
            .map((orderItem) => {
                const product = orderItem.product || {};
                return `${product.itemName || 'N/A'} (Qty: ${orderItem.quantity}, Price: ${fCurrency(product.sellingPrice) || 'N/A'})`;
            })
            .join('; '),
        UserName: item.user?.name || 'N/A',
        Address: `${item.user?.address || 'N/A'}, ${item.user?.state || ''}, ${item.user?.country || ''} - ${item.user?.pincode || ''}`,
        TotalQuantity: item.totalQuantity,
        Discount: item.discount,
        FinalAmount: fCurrency(item.finalAmount),
        DeliveryType: item.delivery,
        OrderDate: item.createdAt,
        GSTNo: item.user?.gstNo || 'N/A',
        ContactPerson: item.user?.contactPerson || 'N/A',
        Status: item.status,

    }));

    // Convert structured data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Orders');

    // Generate a binary string and trigger download
    XLSX.writeFile(workbook, 'filtered_orders_data.xlsx');
};
