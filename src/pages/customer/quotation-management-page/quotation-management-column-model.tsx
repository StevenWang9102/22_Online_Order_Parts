import React from 'react'
import { urlKey } from '../../../services/api/api-urls'
import { getColModelItem, getItemsObj, getRandomKey, renderFn } from '../../../services/helpers'

export const colKey: any = {
  draft: 'draft',
  quotationNo: 'quotationNo',
  customerId: urlKey.Customer,
  effDate: 'effDate',
  expDate: 'expDate',
  employeeId: urlKey.Employee,
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.customerId, label: 'Customer', otherOptions: {required: true, type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['company', 'customerCode']}},
    {key: colKey.quotationNo, label: 'Quote Number'},
    {key: colKey.employeeId, label: 'Sales', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['firstName', 'lastName']}},
  ]
}

const colInfos: any = {
  basicInfo: {
    title: 'Basic Info',
    field: 'basicInfo',
    keywords: [colKey.customerId, colKey.employeeId]
  },
  items: {
    title: 'Items Info',
    field: 'items',
  },
  notes: {
    title: 'Notes',
    field: 'notes',
  },
}

const QuotationManagementColumnModel = () => {
  return [
    {
      ...getColModelItem(colInfos.basicInfo, keyInfosArray),
      render: (rowData: any) => renderFn(getItemsObj(keyInfosArray(), rowData), [...colInfos.basicInfo.keywords, colKey.quotationNo]),
    },
    {
      title: 'Quote Date',
      field: 'effDate1',
      render: (rowData: any) => rowData.effDate,
    },
    {
      title: 'Valid Date',
      field: 'expDate1',
      render: (rowData: any) => rowData.expDate,
    },
    {
      title: colInfos.items.title,
      field: colInfos.items.field,
      filtering: false,
      editable: 'never',
      render: (rowData:any) => (
        <div>
          {
            rowData.quotationItem.map((row: any) => (
              <div key={getRandomKey()}>
                {
                  row.baseProductId ? (
                    <span>
                      <b>BaseProduct:</b>&nbsp;{row.baseProduct.baseProductName}&nbsp;&nbsp;
                    </span>
                  ) : null
                }
                {
                  row.productId ? (
                    <span>
                      <b>Product:</b>&nbsp;{row.product.productName}&nbsp;&nbsp;
                    </span>
                  ) : null
                }
                <span>
                  <b>Price($):</b>&nbsp;{row.price}
                </span>
              </div>
            ))
          }
        </div>
      ),
    },
    {
      title: colInfos.notes.title,
      field: colInfos.notes.field,
      filtering: false,
      editable: 'never',
      render: (rowData:any) => (
        <div>
          {
            rowData.quotationOption.map((row: any, index: number) => {

              return (
                <div key={getRandomKey()}>
                  {

                    row[urlKey.QuotationOptionItem + 'Id'] ? (
                      <span>
                        <b>#</b>&nbsp;{row[urlKey.QuotationOptionItem]?.[urlKey.QuotationOptionItem + 'Name']}
                      </span>
                    ) : (
                      <span>
                        <b>#</b>&nbsp;{row.customizeOptionNotes}
                      </span>
                    )
                  }
                </div>

              )
            })
          }
        </div>
      ),
    },
    {
      title: 'Draft',
      field: colKey.draft,
      defaultFilter: ['0'],
      lookup: {0: 'No', 1: 'Yes'}
    }
  ]
}

export default QuotationManagementColumnModel
