import React from 'react'
import CommonTablePage from '../../../../components/common/common-table-page'
import CustomerGroup1ManagementColumnModel from './customer-group1-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const CustomerGroup1ManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.CustomerGroup1}
      title="Customer Group 1 Management"
      column={CustomerGroup1ManagementColumnModel.CustomerGroup1ManagementColumn}
    />
  )
}

export default CustomerGroup1ManagementPage
