import { urlKey } from '../../../services/api/api-urls'
import { getColModelItem } from '../../../services/helpers'

export const colKey: any = {
  baseProductName: 'baseProductName',
  amountPerSheet: 'amountPerSheet',
  productType: urlKey.ProductType,
  rawMaterial: urlKey.RawMaterial,
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.baseProductName, label: 'Base Product Name', otherOptions: {required: true}},
    {key: colKey.productType, label: 'Product Type', otherOptions: {type: 'select', required: true }},
    {key: colKey.amountPerSheet, label: 'Amount Per Sheet', otherOptions: {required: true, type: 'inputNumber'}},
    {key: colKey.rawMaterial, label: 'Raw Material', otherOptions: {type: 'select', required: true, isOverrideSelectionOptions: true, valueJoinArray: ['rawMaterialName', 'rawMaterialCode']}},
  ]
}

const colInfos: any = {
  baseProduct: {
    title: 'Base Product Name',
    field: 'baseProduct',
    keywords: [colKey.baseProductName]
  },
  productType: {
    title: 'Product Type',
    field: 'productType',
    keywords: [colKey.productType]
  },
  amountPerSheet: {
    title: 'Amount Per Sheet',
    field: 'amountPerSheet',
    keywords: [colKey.amountPerSheet]
  },
  rawMaterial: {
    title: 'Raw Material',
    field: 'rawMaterial',
    keywords: [colKey.rawMaterial]
  },
}

const BaseProductManagementColumnModel = () => {
  return [
    {
      ...getColModelItem(colInfos.baseProduct, keyInfosArray),
      render: (rowData:any) => rowData.baseProductName,
    },
    {
      ...getColModelItem(colInfos.productType, keyInfosArray),
      render: (rowData:any) => rowData.productType.productTypeName,
    },
    {
      ...getColModelItem(colInfos.amountPerSheet, keyInfosArray),
      sorting: true,
      render: (rowData:any) => rowData.amountPerSheet,
    },
    {
      ...getColModelItem(colInfos.rawMaterial, keyInfosArray),
      render: (rowData:any) => `${rowData.rawMaterial?.rawMaterialName}(Code: ${rowData.rawMaterial?.rawMaterialCode})`,
    },
    {
      title: 'Manufactured',
      field: 'manufactured',
      initialEditValue: 0,
      editable: 'onAdd',
      type: 'numeric',
      lookup: {0: 'No', 1: 'Yes'}
    }
  ]
}

export default BaseProductManagementColumnModel
