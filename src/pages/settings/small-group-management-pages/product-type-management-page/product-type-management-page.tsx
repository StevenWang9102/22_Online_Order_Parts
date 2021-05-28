import React from 'react'
import CommonTablePage from '../../../../components/common/common-table-page'
import ProductTypeManagementColumnModel from './product-type-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const ProductTypeManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.ProductType}
      title="Product Type Management"
      column={ProductTypeManagementColumnModel.ProductTypeManagementColumn}
    />
  )
}

export default ProductTypeManagementPage
