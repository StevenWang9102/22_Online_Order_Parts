import React from 'react'

export const PurchaseOrderColumnModel = (): any => {
  return [
    {
      title: 'PO Number',
      field: 'poNo'
    },
    {
      title: 'Details',
      field: 'poDetail',
      filtering: false,
      render: (rowData: any) => {
        return (
          <ul>
            {rowData.poDetail?.map((row: any, index: number) => {
              return <li key={index.toString()}>{row.rawMaterial?.rawMaterialName + '-' + row.rawMaterial?.rawMaterialCode}<b style={{fontSize: '1rem'}}> * </b>{row.quantity}</li>
            })}
          </ul>
        )
      }
    },
    {
      title: 'Price',
      field: 'price',
      type: 'currency'
    },
    {
      title: 'Supplier',
      field: 'supplierName'
    },
    {
      title: 'Created By',
      field: 'createdEmployeeName'
    },
    {
      title: 'Status',
      field: 'poStatusId',
      defaultFilter: ['1', '2'],
      lookup: { 1: 'AwAppr', 2: 'Appr', 3: 'Comp', 0: 'Canc' },
    }
  ]
}
