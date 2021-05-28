import React, { useState } from 'react'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../components/common/common-table-page'
import CommonDialog from '../../../../components/common/common-dialog'
import { urlKey } from '../../../../services/api/api-urls'
import { SupplierManagementColumnModel } from './supplier-management-column-model'
import SupplierManagementDialog from './supplier-management-dialog/supplier-management-dialog'
import { getDiffDays } from '../../../../services/helpers'

export const SupplierManagementPage = () => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false)
  const [orderData, setOrderData] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [isRawMaterial, setIsRawMaterial] = useState(false)

  const onDialogClose = (isModified?: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    setTriggerResetData(!triggerResetData)
  }

  const supplierManagementDialog = <SupplierManagementDialog isRawMaterial={isRawMaterial} onDialogClose={onDialogClose} data={orderData} />

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Edit',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setOrderData(rowData)
        setDialogTitle('Supplier Edit')
        setIsRawMaterial(false)
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Raw Material Edit',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setOrderData(rowData)
        setDialogTitle('Supplier Raw Material Edit')
        setIsRawMaterial(true)
      }
    },
  ]

  const getRenderData = (data: any) => {
    const renderData: any = []
    data.map((row: any) => {
      if (row.active) {
        renderData.push({
          ...row,
          qualification: row.qualification.map((item: any) => ({
            ...item,
            expDate: item.expDate && (new Date(item.expDate + '.000Z')).toDateString(),
            isExpiredAlert: getDiffDays(item.expDate) <= 7
          }))
        })
      }
    })
    return renderData
  }

  const getUpdateData = (dataDetail: any) => {
    return {
      ...dataDetail,
      suplierType: dataDetail.qualification?.length ? 1 : 0
    }
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.Supplier,
    title: 'Supplier Management',
    column: SupplierManagementColumnModel(),
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: (dataDetail: any) => getUpdateData(dataDetail),
    triggerResetData: triggerResetData,
    actionButtons: actionButtons,
    isNotEditable: true,
    isShowSpinnerOnInit: isShowSpinner
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={supplierManagementDialog} />
    </div>
  )
}
