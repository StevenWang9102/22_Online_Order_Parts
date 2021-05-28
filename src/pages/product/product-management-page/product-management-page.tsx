import React from 'react'
import CommonTablePage from '../../../components/common/common-table-page'
import { urlKey } from '../../../services/api/api-urls'
import ProductManagementColumnModel from './product-management-column-model'
import { toNoSpaceString } from '../../../services/helpers'

const ProductManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={ urlKey.Product }
      title="Product Management"
      column={ ProductManagementColumnModel() }
      mappingRenderData={(data: any) => data.map((row: any) => ({
        ...row,
        productInfo: (
          row.productName +
          row.customer?.company +
          row.customer?.customerCode +
          row.baseProduct?.baseProductName +
          toNoSpaceString(
            row.productName +
            row.customer?.company +
            row.customer?.customerCode +
            row.baseProduct?.baseProductName
          )
        )
      }))}
      mappingUpdateData={ (dataDetail: any) => ({
        ...dataDetail,
        plain: dataDetail.baseProductId ? 0 : 1,
        logoType: dataDetail.logoUrl ? 1 : 0
      }) }
    />
  )
}

export default ProductManagementPage
