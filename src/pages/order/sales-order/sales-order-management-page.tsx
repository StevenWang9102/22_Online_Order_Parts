import React, { useState } from 'react'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table-page'
import { urlKey } from '../../../services/api/api-urls'
import SalesOrderManagementColumnModel from './sales-order-management-column-model'
import SalesOrderProductManagementDialog from './sales-order-product-management-dialog/sales-order-product-management-dialog'
import CommonDialog from '../../../components/common/common-dialog'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import { toNoSpaceString } from '../../../services/helpers'

const SalesOrderManagementPage = (props: {customerId: any}) => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false)
  const [orderData, setOrderData] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [isNewOrder, setIsNewOrder] = useState(false)

  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    if (isModified) {
      setTriggerResetData(!triggerResetData)
    }
  }

  const salesOrderProductManagementDialog = <SalesOrderProductManagementDialog isNewOrder={isNewOrder} onDialogClose={onDialogClose} orderData={orderData} />

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
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Add new order',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setOrderData({})
        setDialogTitle('New Sales Order')
        setIsNewOrder(true)
      }
    }
  ]

  const getRenderData = (data: any) => {
    const renderData: any = []
    data.map((row: any) => {
      if ((props.customerId && (props.customerId === row.customerId)) || !props.customerId) {
        renderData.push({
          ...row,
          cityId: row.deliveryCityId,
          city: row.deliveryCity,
          items: getItemsStr(row),
          orderDate1: row.orderDate,
          requiredDate1: row.requiredDate,
          deliveryDate: row.deliveryDate && (new Date(row.deliveryDate + '.000Z')).toDateString(),
          orderDate: row.orderDate && (new Date(row.orderDate + '.000Z')).toDateString(),
          requiredDate: row.requiredDate && (new Date(row.requiredDate + '.000Z')).toDateString()
        })
      }
    })
    return renderData
  }

  const getItemsStr = (row: any) => {
    let str: any = ''
    // row.orderProduct?.map((item: any) => str += (item.product?.productName + toNoSpaceString(item.product?.productName)))
    // row.orderOption?.map((item: any) => str += (item.option?.optionName + toNoSpaceString(item.option?.optionName)))
    
    row.orderProduct.forEach((item: any)=>{
      str += (item.product?.productName + toNoSpaceString(item.product?.productName))
    })

    row.orderOption.forEach((item: any)=>{
      str += (item.option?.optionName + toNoSpaceString(item.option?.optionName))
    })
    return str
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.SalesOrder,
    title: 'Sales Order Management',
    column: SalesOrderManagementColumnModel(),
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: async (dataDetail: any) => {
      if (dataDetail.orderStatusId >= 10) {
        const result = await SweetAlertService.confirmMessage('This order is in production or dispatch. Sure to delete?')
        if (!result) {
          return null
        }
      }
      dataDetail.paid = parseInt(dataDetail.paid, 10)
      dataDetail.deliveryCityId = dataDetail.cityId
      return dataDetail
    },
    triggerResetData: triggerResetData,
    actionButtons: actionButtons,
    isNotEditable: true,
    isNotAddable: true,
    isShowSpinnerOnInit: isShowSpinner
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={salesOrderProductManagementDialog} />
    </div>
  )
}

export default SalesOrderManagementPage
