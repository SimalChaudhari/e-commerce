import { fIsBetween } from "src/utils/format-time";

export function applyFilter({ inputData, comparator, filters, dateError, userRole })  {
      const { status, name, startDate, endDate } = filters;
      
        const stabilizedThis = inputData.map((el, index) => [el, index]);
      
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
      
        inputData = stabilizedThis.map((el) => el[0]);
      
        if (name) {
          inputData = inputData.filter((order) =>
            userRole === "Admin"
              ? order.user.name.toLowerCase().includes(name.toLowerCase()) ||
              order.user.email.toLowerCase().includes(name.toLowerCase()) ||
              order.user.mobile.toLowerCase().includes(name.toLowerCase()) ||
              order.totalPrice.toString().includes(name.toLowerCase()) ||
              order.totalQuantity.toString().includes(name.toLowerCase()) ||
              order.finalAmount.toString().includes(name.toLowerCase()) || 
              order.discount.toString().includes(name.toLowerCase())
              : order.totalPrice.toString().includes(name.toLowerCase()) ||
              order.totalQuantity.toString().includes(name.toLowerCase())
          );
        }
      
        if (status !== 'all') {
          inputData = inputData.filter((order) => order.status === status);
        }
      
        if (!dateError && startDate && endDate) {
          inputData = inputData.filter((order) =>
            fIsBetween(order.createdAt, startDate, endDate)
          );
        }
      
        return inputData;
      }


