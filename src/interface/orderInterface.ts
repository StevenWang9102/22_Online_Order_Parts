export interface IOrderProduct {
  "orderId": string,
  "productId": number,
  "quantity": number,
  "unitPrice": number,
  "price": number,
  "marginOfError": number,
}


export interface IOnlineOrderBody {
  "customerId": number,
  "totalPrice": number,
  "employeeId": number,
  "priceInclgst": number,
  "requiredDate": any,
  "deliveryName": string,
  "deliveryAddress": string,
  "postalCode": string,
  "orderDate": any,
  "comments": string,
  "deliveryAsap": number,
  "orderStatusId": number,
  "deliveryCityId": number,
  "deliveryMethodId": number,
  "orderProduct": Array<IOrderProduct>,
  "orderOption": [
    {
      "optionId": number,
      "quantity": number,
      "unitPrice": number,
      "price": number,
    }
  ]
}

export interface IUpdateOrderBody {
  "orderId": number | undefined, 
  "customerId": number,
  "totalPrice": number,
  "employeeId": number,
  "priceInclgst": number,
  "paid": number,
  "requiredDate": any,
  "deliveryName": string,
  "deliveryAddress": string,
  "postalCode": string,
  "orderDate": any,
  "comments": string,
  "deliveryAsap": number,
  "orderStatusId": number,
  "deliveryCityId": number,
  "deliveryMethodId": number,
  "orderSourceId": number,
  "orderProduct": Array<IOrderProduct>,
  "orderOption": [
    {
      "optionId": number,
      "quantity": number,
      "unitPrice": number,
      "price": number,
    }
  ]
}