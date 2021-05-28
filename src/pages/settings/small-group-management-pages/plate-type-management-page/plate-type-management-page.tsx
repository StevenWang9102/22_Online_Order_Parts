import React from 'react'
import CommonTablePage from '../../../../components/common/common-table-page'
import PlateTypeManagementColumnModel from './plate-type-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const PlateTypeManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.PlateType}
      title="Plate Type Management"
      column={PlateTypeManagementColumnModel.PlateTypeManagementColumn}
    />
  )
}

export default PlateTypeManagementPage
