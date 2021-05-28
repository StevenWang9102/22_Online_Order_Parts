import React from 'react'
import BaseProductManagementColumnModel from './base-product-management-column-model'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table-page'
import { urlKey } from '../../../services/api/api-urls'

const BaseProduct: any = () => {
  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.BaseProduct,
    title: 'Base Product Management',
    column: BaseProductManagementColumnModel(),
  }

  return (
    <>
      <CommonTablePage
        {...commonTablePageProps}
        mappingUpdateData={ (dataDetail: any) => ({
          ...dataDetail,
          manufactured: parseInt(dataDetail.manufactured, 10),
        }) }
      />
    </>
  )
}

export default BaseProduct

