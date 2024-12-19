import { fCurrency } from "src/utils/format-number";

export const generatePrintableContent = (data) => `
  <html>
    <head>
      <title>Orders</title>
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order No</th> 
            <th>User Name</th>
            <th>Address</th>
            <th>Product Details</th>
            <th>Total Quantity</th>
            <th>Discount</th>
            <th>Final Amount</th>
            <th>Delivery Type</th>
            <th>Order Date</th>
             <th>Status</th>
           
           
          </tr>
        </thead>
        <tbody>
          ${data
    .map(
      (item) => `
              <tr>
                <td>${item.orderNo}</td>
                 <td>${item.user?.name || 'N/A'}</td>
                
                <td>${item.user?.address || 'N/A'}, ${item.user?.state || ''}, ${item.user?.country || ''} - ${item.user?.pincode || ''}</td>
                <td>
                  <ul>
                    ${item.orderItems
          .map(
            (orderItem) => `
                          <li>
                            ${orderItem.product?.itemName || 'N/A'} - 
                            Qty: ${orderItem.quantity}, 
                            Price: ${fCurrency(orderItem.product?.sellingPrice) || 'N/A'}
                          </li>
                        `
          )
          .join('')}
                  </ul>
                </td>
                <td>${item.totalQuantity}</td>
                <td>${item.discount}</td>
                <td>${fCurrency(item.finalAmount)}</td>
                <td>${item.delivery}</td>
                <td>${new Date(item.createdAt).toLocaleString()}</td>
                <td>${item.status}</td>
               
              </tr>
            `
    )
    .join('')}
        </tbody>
      </table>
    </body>
  </html>
`;
