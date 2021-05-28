import React, { useState } from 'react'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../components/common/common-table-page'
import CommonDialog from '../../../../components/common/common-dialog'
import { urlKey } from '../../../../services/api/api-urls'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import { PurchaseOrderColumnModel } from './purchase-order-column-model'
import PurchaseOrderDialog from './purchase-order-dialog/purchase-order-dialog'
import { ApiRequest } from '../../../../services/api/api'

export const PurchaseOrderPage = () => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false)
  const [orderData, setOrderData] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [isNewOrder, setIsNewOrder] = useState(false)

  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    setTriggerResetData(!triggerResetData)
  }

  const purchaseOrderDialog = <PurchaseOrderDialog isNewOrder={isNewOrder} onDialogClose={onDialogClose} orderData={orderData} />

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Edit',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setOrderData(rowData)
        setDialogTitle('Order Edit')
        setIsNewOrder(false)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Approve',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        if (rowData.poStatusId !== 1) {
          SweetAlertService.errorMessage('This order\'s status is not awaiting approved.')
          return
        }
        const result = await SweetAlertService.confirmMessage()
        if (result) {
          ApiRequest({
            url: 'PurchaseOrder/ApprovePurchaseOrder?id=' + rowData.poId,
            method: 'put'
          }).then(_ => {
            setTriggerResetData(!triggerResetData)
          })
        }
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Add new order',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setOrderData({})
        setDialogTitle('New Purchase Order')
        setIsNewOrder(true)
      }
    }
  ]

  const getRenderData = (data: any) => {
    const renderData: any = []
    data.map((row: any) => {
      renderData.push({
        ...row,
        supplierName: row.suplier?.suplierName,
        createdEmployeeName: (row.createdEmployee?.firstName || '') + ' ' + (row.createdEmployee?.lastName || '')
      })
    })
    return renderData
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.PurchaseOrder,
    title: 'Purchase Order Management',
    column: PurchaseOrderColumnModel(),
    mappingRenderData: (data: any) => getRenderData(data),
    triggerResetData: triggerResetData,
    actionButtons: actionButtons,
    isNotEditable: true,
    isNotAddable: true,
    isShowSpinnerOnInit: isShowSpinner
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={purchaseOrderDialog} />
    </div>
  )
}
