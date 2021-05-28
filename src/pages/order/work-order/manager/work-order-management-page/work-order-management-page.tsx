import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../../components/common/common-table-page'
import React, { useState } from 'react'
import WorkOrderManagementColumnModel from './work-order-management-column-model'
import { urlKey } from '../../../../../services/api/api-urls'
import WorkOrderAddDialog from './work-order-add-dialog/work-order-add-dialog'
import CommonDialog from '../../../../../components/common/common-dialog'
import { ApiRequest } from '../../../../../services/api/api'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import { toNoSpaceString } from '../../../../../services/helpers'

const WorkOrderManagementPage = () => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState<string>()

  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    if (isModified) {
      setTriggerResetData(!triggerResetData)
    }
  }

  const updateApproveStatus = async (rowData: any) => {
    const result = await SweetAlertService.inputConfirm({type:'textarea', title:'WorkOrder Approve', placeholder:'Comment'})
    if (result !== null) {
      if (!result) {
        await SweetAlertService.errorMessage('Please type in comment before submitting')
        return
      } else {
        ApiRequest({
          url: 'WorkOrder/ApproveWorkOrder?id=' + rowData.workOrderId + '&approvedComment=' + result,
          method: 'put'
        }).then(_ => {
          setTriggerResetData(!triggerResetData)
        })
      }
    }
  }

  const updateQuantity = async (rowData: any) => {
    const result = await SweetAlertService.inputConfirm({type:'number', title:'Update Quantity', placeholder:'qty'})
    if (result !== null) {
      if (!result) {
        await SweetAlertService.errorMessage('Please type in quantity before submitting')
        return
      } else {
        console.log(result)
        ApiRequest({
          url: 'WorkOrder/UpdateWorkOrderQuantity?id=' + rowData.workOrderId + '&quantity=' + parseInt(result),
          method: 'put'
        }).then(_ => {
          setTriggerResetData(!triggerResetData)
        })
      }
    }
  }

  const updateUrgent = async (rowData: any) => {
    ApiRequest({
      url: 'WorkOrder/WorkOrderUrgent?id=' + rowData.workOrderId + '&urgent=' + !rowData.urgent,
      method: 'put'
    }).then(_ => {
      setTriggerResetData(!triggerResetData)
    })
  }

  const workOrderProductManagementDialog = <WorkOrderAddDialog onDialogClose={onDialogClose} />

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'New WorkOrder',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setDialogTitle('New WorkOrder')
      }
    }
  ]

  const getRenderData = (data: any) => {
    // console.log(data)
    const renderData: any = []
    data.map((row: any) => {
      if (row.workOrderStatusId !== 0) {
        renderData.push({
          ...row,
          urgent: row.urgent ? 1 : 0,
          productFilter: row.product?.productName + toNoSpaceString(row.product?.productName) + ' ' + row.product?.description,
          createdEmployeeName: (row.createdEmployee?.firstName || '') + ' ' + (row.createdEmployee?.lastName || ''),
          createdAt1: row.createdAt,
          requiredDate1: row.requiredDate,
          createdAt: row.createdAt && (new Date(row.createdAt + '.000Z')).toLocaleString(),
          requiredDate: row.requiredDate && (new Date(row.requiredDate + '.000Z')).toLocaleDateString(),
          workOrderNo: row.workOrderNo && parseInt(row.workOrderNo)
        })
      }
    })
    // console.log(renderData)
    return renderData
  }

  const getUpdateData = (dataDetail: any) => {
    if ([10, 0].includes(dataDetail.workOrderStatusId)) {
      SweetAlertService.errorMessage('This order is cancelled or completed, so not deletable.')
      return ''
    }
    return dataDetail
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.WorkOrder,
    title: 'Work Order Management',
    column: WorkOrderManagementColumnModel({
      updateApproveStatus: updateApproveStatus,
      updateQuantity: updateQuantity,
      updateUrgent: updateUrgent,
    }),
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: (dataDetail: any) => getUpdateData(dataDetail),
    triggerResetData: triggerResetData,
    actionButtons: actionButtons,
    isNotEditable: true,
    isNotAddable: true,
    isShowSpinnerOnInit: isShowSpinner
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={workOrderProductManagementDialog} />
    </div>
  )
}

export default WorkOrderManagementPage
