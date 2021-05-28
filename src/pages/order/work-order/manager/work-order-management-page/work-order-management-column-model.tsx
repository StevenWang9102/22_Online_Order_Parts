import React from 'react'
import { getRandomKey } from '../../../../../services/helpers'
import { Button } from 'antd'
import ItipsForProduct from '../../../../../components/common/i-tips/product'

const WorkOrderManagementColumnModel = (props: any) => {
  return [
    {
      title: 'Order No',
      field: 'workOrderNo',
      // defaultSort: 'asc'
    },
    {
      title: 'Product',
      field: 'productFilter',
      sorting: false,
      render: (rowData: any) => rowData.product ? (
        <div>
          <div><b>Product&nbsp;Name:&nbsp;</b><ItipsForProduct id={rowData.productId} label={rowData.product.productName} /></div>
          <div><b>Min&nbsp;Order&nbsp;Quantity:&nbsp;</b>{rowData.product.minOrderQuantity}</div>
          <div><b>ProductMsl:&nbsp;</b>{rowData.product.productMsl}</div>
          <div><b>SemiMsl:&nbsp;</b>{rowData.product.semiMsl}</div>
          <div><b>Description:&nbsp;</b>{rowData.product.description}</div>
        </div>
      ) : null
    },
    {
      title: 'Qty',
      field: 'quantity',
      render: (rowData: any) => {
        return (
          <div>
            {rowData.quantity}
            {
              ![10, 0].includes(rowData.workOrderStatusId) ? (
                <div key={getRandomKey()}>
                  <Button
                    onClick={() => {
                      props.updateQuantity(rowData)
                    }}
                  >Edit quantity</Button>
                </div>
              ) : null
            }
          </div>
        )
      }
    },
    {
      title: 'Order Type',
      field: 'orderType',
      sorting: false,
      lookup: { 1: 'Normal order', 2: 'Raw to semi', 3: 'Semi to products' },
      customFilterAndSearch: (term: any, rowData: any) => term && term.length ? term.includes(rowData.orderTypeId?.toString()) : true,
      render: (rowData: any) => rowData.orderType?.orderTypeName
    },
    {
      title: 'Source',
      field: 'workOrderSource',
      sorting: false,
      lookup: { 1: 'Sales Order', 2: 'Manual', 3: 'Inventory', 4: 'Redo', 5: 'Makeup' },
      customFilterAndSearch: (term: any, rowData: any) => term && term.length ? term.includes(rowData.workOrderSourceId?.toString()) : true,
      render: (rowData: any) => rowData.workOrderSource?.workOrderSourceName
    },
    {
      title: 'Created By',
      field: 'createdEmployeeName',
    },
    {
      title: 'Status',
      field: 'workOrderStatus',
      sorting: false,
      defaultFilter: ['-1', '1', '2'],
      lookup: { '-1': 'New', 1: 'Appr', 2: 'Prog', 10: 'Comp', 0: 'Canc' },
      customFilterAndSearch: (term: any, rowData: any) => term && term.length ? term.includes(rowData.workOrderStatusId?.toString()) : true,
      render: (rowData: any) => {
        const name = rowData.workOrderStatus?.workOrderStatusName
        return (
          <div>
            {name}
            {
              rowData.workOrderStatusId === -1 ? (
                <div key={getRandomKey()}>
                  <Button
                    type="primary"
                    onClick={() => {
                      props.updateApproveStatus(rowData)
                    }}
                  >Approve</Button>
                </div>
              ) : null
            }
          </div>
        )
      }
    },
    {
      title: 'Created At',
      field: 'createdAt1',
      render: (rowData: any) => rowData.createdAt,
    },
    {
      title: 'REQ Date',
      field: 'requiredDate1',
      render: (rowData: any) => rowData.requiredDate,
    },
    {
      title: 'Urgent',
      field: 'urgent',
      initialEditValue: 0,
      align: 'left',
      sorting: false,
      type: 'numeric',
      lookup: {0: 'No', 1: 'Yes'},
      render: (rowData: any) => {
        return (
          <div>
            {rowData.urgent ? 'Yes' : 'No'}
            {
              ![10, 0].includes(rowData.workOrderStatusId) ? (
                <div key={getRandomKey()}>
                  <Button
                    onClick={() => {
                      props.updateUrgent(rowData)
                    }}
                  >change</Button>
                </div>
              ) : null
            }
          </div>
        )
      }
    },
    {
      title: 'Comments',
      field: 'comments',
    },
  ]
}

export default WorkOrderManagementColumnModel
