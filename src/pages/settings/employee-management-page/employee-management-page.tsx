import React from 'react'
import EmployeeManagementColumnModel from './employee-management-column-model'
import CommonTablePage from '../../../components/common/common-table-page'
import { urlKey } from '../../../services/api/api-urls'

const EmployeeManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={ urlKey.Employee }
      title="Employee Management"
      column={ EmployeeManagementColumnModel() }
      mappingUpdateData={ (dataDetail: any) => {
        return {...dataDetail, isSales: parseInt(dataDetail.isSales, 10)}
      } }
    />
  )
}

export default EmployeeManagementPage
