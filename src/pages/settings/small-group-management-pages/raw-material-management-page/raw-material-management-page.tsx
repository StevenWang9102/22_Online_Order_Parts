import React from 'react'
import CommonTablePage from '../../../../components/common/common-table-page'
import RawMaterialManagementColumnModel from './raw-material-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const RawMaterialManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.RawMaterial}
      title="Raw Material Management"
      column={RawMaterialManagementColumnModel.RawMaterialManagementColumn}
    />
  )
}

export default RawMaterialManagementPage
