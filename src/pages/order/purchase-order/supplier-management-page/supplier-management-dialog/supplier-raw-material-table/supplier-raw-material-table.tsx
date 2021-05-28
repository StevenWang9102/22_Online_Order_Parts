import React, { useState } from 'react'
import SupplierRawMaterialColumnModel from './supplier-raw-material-column-model'
import CommonTablePage from '../../../../../../components/common/common-table-page'
import { urlType } from '../../../../../../services/api/api-urls'
import { ApiRequest } from '../../../../../../services/api/api'
import { getRandomKey } from '../../../../../../services/helpers'

const SupplierRawMaterialTable = (props: {supplierId: any}): any => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)

  const tableProps = () => ({
    urlInfoKey: '',
    title: "Supplier Raw Material Management",
    column: SupplierRawMaterialColumnModel(),
    getAllUrl: 'SupplierRawMaterial/GetRawMaterialBySupplierId?supplierId=' + props.supplierId,
    isNotEditable: true,
    triggerResetData: triggerResetData,
    mappingUpdateData: async (dataDetail: any, type: any) => {
      if (type === urlType.Delete) {
        await ApiRequest({
          url: 'SupplierRawMaterial/DeleteSupplierRawMaterial',
          method: 'delete',
          data: {
            suplierId: props.supplierId,
            rawMaterialId: dataDetail.rawMaterialId
          }
        }).then(_ => {
          setTriggerResetData(getRandomKey())
        })
      }
      if (type === urlType.Create) {
        await ApiRequest({
          url: 'SupplierRawMaterial/AddSupplierRawMaterial',
          method: 'post',
          data: {
            suplierId: props.supplierId,
            rawMaterialId: dataDetail.rawMaterialId
          }
        }).then(_ => {
          setTriggerResetData(getRandomKey())
        })
      }
      return 'resolve'
    },
  })

  return (
    <CommonTablePage {...tableProps()} />
  )
}

export default SupplierRawMaterialTable
