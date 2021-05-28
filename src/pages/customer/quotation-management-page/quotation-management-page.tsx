import React, { useState } from 'react'

import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table-page'
import { urlKey } from '../../../services/api/api-urls'
import QuotationManagementColumnModel from './quotation-management-column-model'
import QuotationManagementEditDialog from './quotation-management-edit-dialog/quotation-management-edit-dialog'
import CommonDialog from '../../../components/common/common-dialog'
import pdfGenerate from "../../ticket/ticket-list/pdfGenerate";
import {log} from "util";

const QuotationManagementPage = (props: {customerId: any}) => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false) // Quotation Dialog
  const [quotationData, setQuotationData] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [isNewQuotation, setIsNewQuotation] = useState(false)

  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    if (isModified) {
      setTriggerResetData(!triggerResetData)
    }
  }

  const quotationManagementEditDialog = <QuotationManagementEditDialog isNewQuotation={isNewQuotation} onDialogClose={onDialogClose} quotationData={quotationData} />

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Edit',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setQuotationData(rowData)
        setDialogTitle('Quotation Edit')
        setIsNewQuotation(false)
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: ' Generate PDF',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        console.log(rowData,'111')
        const obj = {
          customerName: rowData.customer.company,
          email: rowData.customer.email,
          // address: rowData.customer.address2 + ' ' + rowData.customer.address1,
          address: rowData.customer.address2,
          phone: rowData.customer.phone,
          validDate: rowData.expDate,
          quoteDate: rowData.effDate,
          quotationNo: rowData.quotationNo,
          tableContent: rowData.quotationItem.map((res:any)=> {
            if(res.productId === null) {
              res.baseProduct.price = res.price
              res.baseProduct.description = null
              return res.baseProduct
            }
            res.product.price = res.price
            return res.product
          }),
          options: rowData.quotationOption.map((res:any)=> {
            if(res.customizeOptionNotes === null) return res.quotationOptionItem.quotationOptionItemName

            return res.customizeOptionNotes
          })
        }
        // console.log(obj)
        pdfGenerate(obj)
      }
    },
    {
      icon: '',
      tooltip: 'Add new quotation',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setQuotationData({})
        setDialogTitle('New Quotation')
        setIsNewQuotation(true)
      }
    }
  ]

  const getRenderData = (data: any) => {
    const renderData: any = []
    data.map((row: any) => {
      if ((props.customerId && (props.customerId === row.customerId)) || !props.customerId) {
        renderData.push({
          ...row,
          effDate1: row.effDate,
          expDate1: row.expDate,
          effDate: row.effDate && (new Date(row.effDate + '.000Z')).toDateString(),
          expDate: row.expDate && (new Date(row.expDate + '.000Z')).toDateString(),
        })
      }
    })
    return renderData
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.Quotation,
    title: 'Quotation Management',
    column: QuotationManagementColumnModel(),
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: (dataDetail: any) => {
      dataDetail.draft = parseInt(dataDetail.draft, 10)
      return dataDetail
    },
    triggerResetData: triggerResetData,
    actionButtons: actionButtons,
    isNotAddable: true,
    isNotEditable: true,
    isShowSpinnerOnInit: isShowSpinner
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={quotationManagementEditDialog} />
    </div>
  )
}

export default QuotationManagementPage
