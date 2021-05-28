import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../../components/common/common-table-page'
import React, { useState } from 'react'
import StockMonitorColumnModel from './stock-monitor-column-model'
import { urlKey, urlType } from '../../../../../services/api/api-urls'
import { ApiRequest } from '../../../../../services/api/api'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import moment from 'moment'

const StockMonitorPage = () => {
  const [triggerResetData, setTriggerResetData] = useState(false)

  const updateQuantity = async (rowData: any, isSemi: boolean) => {
    const defaultQty = isSemi ? rowData.suggestedSemiQuantity : rowData.suggestedQuantity
    const result = await SweetAlertService.inputConfirm({type:'number', title:'New WorkOrder', placeholder:'qty', defaultValue: defaultQty})
    console.log(result)
    if (result !== null) {
      let qty = result || defaultQty
      qty = parseInt(qty)
      if (qty <= 0) {
        await SweetAlertService.errorMessage('Please input a valid qty')
        return
      }
      const confirmResult = await SweetAlertService.confirmMessage('A new work order with ' + qty + ' qty will be created.')
      if (confirmResult) {
        ApiRequest({
          urlInfoKey: urlKey.WorkOrder,
          type: urlType.Create,
          data: {
            orderTypeId: isSemi ? 2 : 1,
            productId: rowData.productId,
            quantity: qty,
            requiredDate: moment().add(2, 'weeks'),
            urgent: 0,
            workOrderSourceId: 3,
            workOrderStatusId: 1,
          }
        }).then(_ => {
          setTriggerResetData(!triggerResetData)
        })
      }
    }
  }

  const getRenderData = (data: any) => {
    console.log(data)
    const renderData: any = []
    data.map((row: any) => {
      renderData.push({
        ...row,
        low: row.low ? 1 : 0,
        suggestedQuantity: row.productInventoryInfo?.suggestedQuantity,
        suggestedSemiQuantity: row.semiProductInventoryInfo?.suggestedSemiQuantity,
      })
    })
    console.log(renderData)
    return renderData
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.StockMonitor,
    title: 'Stock Monitor',
    column: StockMonitorColumnModel({
      updateQuantity: updateQuantity,
    }),
    mappingRenderData: (data: any) => getRenderData(data),
    triggerResetData: triggerResetData,
    isNotEditable: true,
    isNotDeletable: true,
    isNotAddable: true,
    isShowSpinnerOnInit: true
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
    </div>
  )
}

export default StockMonitorPage
