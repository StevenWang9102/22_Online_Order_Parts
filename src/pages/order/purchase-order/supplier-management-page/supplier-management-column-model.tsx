import React from 'react'

export const SupplierManagementColumnModel = (): any => {
  return [
    {
      title: 'Supplier Name',
      field: 'suplierName'
    },
    {
      title: 'With Qualification',
      field: 'suplierType',
      editable: 'never',
      lookup: {0: 'No', 1: 'Yes'}
    },
    {
      title: 'Qualification',
      field: 'qualification',
      editable: 'never',
      filtering: false,
      render: (rowData: any) => {
        return (
          <ul>
            {
              rowData.qualification?.map((row: any, index: number) => {
                return (
                  <li key={index.toString()}>
                    {row.qualificationName + ' - '}
                    <span style={row.isExpiredAlert ? {color: 'red', fontWeight: 'bold'} : {}}>{row.expDate}</span>
                  </li>
                )
              })
            }
          </ul>
        )
      }
    }
  ]
}
