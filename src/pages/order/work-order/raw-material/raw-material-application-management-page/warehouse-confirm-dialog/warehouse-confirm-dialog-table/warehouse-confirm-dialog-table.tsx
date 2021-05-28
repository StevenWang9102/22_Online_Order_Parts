import React, { useEffect } from 'react'
import WarehouseConfirmDialogTableColumnModel from './warehouse-confirm-dialog-table-column-model'
import CommonTablePage from '../../../../../../../components/common/common-table-page'
import { urlKey } from '../../../../../../../services/api/api-urls'

const WarehouseConfirmDialogTable = (props: {applicationId: any, rawMaterialId: any, getRenderData: any}): any => {
  useEffect(() => {
    console.log(props.applicationId)
  }, [props.applicationId])

  return (
    <CommonTablePage
      urlInfoKey={urlKey.ApplicationDetails}
      title="Confirm detail table"
      mappingRenderData={(data: any) => {
        console.log(data)
        console.log(props.applicationId)
        const renderData = data.filter((row: any) => row.applicationId === props.applicationId).map((row: any) => ({...row, boxCode: row.rawMaterialBox?.boxCode}))
        console.log(renderData)
        props.getRenderData(renderData)
        return renderData
      }}
      mappingUpdateData={(dataDetail: any) => {
        console.log(dataDetail)
        console.log(({...dataDetail, applicationId: props.applicationId}))
        return ({...dataDetail, applicationId: props.applicationId})
      }}
      isNotEditable={true}
      column={WarehouseConfirmDialogTableColumnModel({rawMaterialId: props.rawMaterialId})}
    />
  )
}

export default WarehouseConfirmDialogTable
