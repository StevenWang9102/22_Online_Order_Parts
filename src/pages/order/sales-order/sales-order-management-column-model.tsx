import React from 'react'
import { urlKey } from '../../../services/api/api-urls'
import { getColModelItem, getRandomKey } from '../../../services/helpers'

export const colKey: any = {
  customerId: urlKey.Customer,
  employeeId: urlKey.Employee,
  totalPrice: 'totalPrice',
  deliveryName: 'deliveryName',
  deliveryAddress: 'deliveryAddress',
  postalCode: 'postalCode',
  comments: 'comments',
  requiredDate: 'requiredDate',
  orderDate: 'orderDate',
  deliveryDate: 'deliveryDate',
  deliveryAsap: 'deliveryAsap',
  paid: 'paid',
  deliveryCityId: urlKey.City,
  orderStatusId: urlKey.OrderStatus,
  deliveryMethodId: urlKey.DeliveryMethod,
  orderNo: 'orderNo',
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.customerId, label: 'Customer', otherOptions: {required: true, type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['company', 'customerCode']}},
    {key: colKey.employeeId, label: 'Sales', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['firstName', 'lastName']}},
    {key: colKey.totalPrice, label: 'Price', otherOptions: {type: 'inputNumber'}},
    {key: colKey.deliveryName, label: 'Delivery Name'},
    {key: colKey.deliveryDate, label: 'Delivery Date'},
    {key: colKey.deliveryAddress, label: 'Delivery Address'},
    {key: colKey.postalCode, label: 'Postal Code'},
    {key: colKey.orderNo, label: 'Order No', otherOptions: {disabled: true}},
    {key: colKey.comments, label: 'Comments', otherOptions: {type: 'inputTextArea'}},
    {key: colKey.deliveryCityId, label: 'Delivery City', otherOptions: {type: 'select'}},
    {key: colKey.orderStatusId, label: 'Status', otherOptions: {type: 'select'}},
    {key: colKey.deliveryMethodId, label: 'Delivery Method', otherOptions: {type: 'select'}}
  ]
}

const colInfos: any = {
  basicInfo: {
    title: 'Basic Info',
    field: 'basicInfo',
    keywords: [colKey.customerId, colKey.employeeId, colKey.orderNo, colKey.comments]
  },
  deliveryInfo: {
    title: 'Delivery Info',
    field: 'deliveryInfo',
    keywords: [colKey.deliveryName, colKey.deliveryCityId, colKey.deliveryAddress, colKey.postalCode, colKey.deliveryMethodId, colKey.deliveryDate]
  },
  items: {
    title: 'Items',
    field: 'items',
  },
  stage: {
    title: 'Stage',
    field: 'stage',
    keywords: [colKey.orderStatusId]
  }
}

export const renderOrderProduct = (rowData: any, isAwaitingDispatchPage?: boolean) => {
  return (rowData.orderProduct?.length && (
    <div>
      {
        rowData.orderProduct.map((row: any) => (
          <div key={getRandomKey()}>
            {
              row.productId ? (
                <span>
                  <b>Product:</b>&nbsp;{row.product.productName}&nbsp;&nbsp;
                </span>
              ) : null
            }
            <span>
              <b>Qty:</b>&nbsp;{row.quantity}&nbsp;&nbsp;
            </span>
            <span>
              <b>Price:</b>&nbsp;{row.price}&nbsp;&nbsp;
            </span>
            {
              isAwaitingDispatchPage ? (
                <span>
                  <b>StockQty:</b>&nbsp;{row.stockQuantity}
                  <span style={{color: '#7e0505'}}>
                    &nbsp;(
                    <b>Delivered:</b>&nbsp;{row.delivered ? 'Yes' : 'No'}&nbsp;
                    <b>Qty:</b>&nbsp;{row.deliveredQuantity})
                  </span>
                </span>
              ) : null
            }
          </div>
        ))
      }
      {
        rowData.orderOption?.map((row: any) => (
          <div key={getRandomKey()}>
            {
              row.optionId ? (
                <span>
                  <b>Option:</b>&nbsp;{row.option?.optionName}&nbsp;&nbsp;
                </span>
              ) : null
            }
            <span>
              <b>Qty:</b>&nbsp;{row.quantity}&nbsp;&nbsp;
            </span>
            <span>
              <b>Price:</b>&nbsp;{row.price}&nbsp;&nbsp;
            </span>
          </div>
        )) || null
      }
      <div>-----</div>
      <div>
        <b>Gst:</b>&nbsp;${rowData.priceInclgst}
      </div>
      <div>
        <b>Total Price:</b>&nbsp;${rowData.totalPrice}
      </div>
    </div>
  )) || null
}

const SalesOrderManagementColumnModel = () => {
  return [
    getColModelItem(colInfos.basicInfo, keyInfosArray),
    getColModelItem(colInfos.deliveryInfo, keyInfosArray),
    {
      title: colInfos.items.title,
      field: colInfos.items.field,
      sorting: false,
      filtering: true,
      editable: 'never',
      render: (rowData:any) => renderOrderProduct(rowData),
    },
    {
      title: 'Required Date',
      field: 'requiredDate1',
      render: (rowData: any) => rowData.requiredDate
    },
    {
      title: 'Order Date',
      field: 'orderDate1',
      render: (rowData: any) => rowData.orderDate
    },
    {
      title: 'Paid',
      field: colKey.paid,
      initialEditValue: 0,
      type: 'numeric',
      lookup: {0: 'No', 1: 'Yes'}
    },
    {
      ...getColModelItem(colInfos.stage, keyInfosArray),
      render: (rowData: any) => rowData[colKey.orderStatusId]?.[colKey.orderStatusId + 'Name']
    },
  ]
}

export default SalesOrderManagementColumnModel
