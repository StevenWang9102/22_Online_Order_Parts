import { getColModelItem } from '../../../services/helpers'
import { urlKey } from '../../../services/api/api-urls'

export const colKey: any = {
  productName: 'productName',
  baseProductId: urlKey.BaseProduct,
  plain: 'plain',
  logoType: 'logoType',
  logoUrl: 'logoUrl',
  description: 'description',
  customerId: urlKey.Customer,
  plateTypeId: urlKey.PlateType,
  packagingTypeId: urlKey.PackagingType,
  marginOfError: 'marginOfError',
  minOrderQuantity: 'minOrderQuantity',
  productImage: 'images',
  productMsl: 'productMsl',
  semiMsl: 'semiMsl',
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.productName, label: 'Product Name', otherOptions: {required: true}},
    {key: colKey.customerId, label: 'Customer', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['company', 'customerCode']}},
    {key: colKey.baseProductId, label: 'Base Product', otherOptions: {type: 'select'}},
    {key: colKey.description, label: 'Description', otherOptions: {type: 'inputTextArea'}},
    {key: colKey.plateTypeId, label: 'Pallet Type', otherOptions: {type: 'select', required: true}},
    {key: colKey.packagingTypeId, label: 'Packaging Type', otherOptions: {type: 'select', required: true}},
    {key: colKey.marginOfError, label: 'Default Margin of Error', otherOptions: {type: 'inputNumber', required: true}},
    {key: colKey.minOrderQuantity, label: 'Minimum Quantity for Order', otherOptions: {type: 'inputNumber', required: true}},
    {key: colKey.productMsl, label: 'ProductMsl', otherOptions: {type: 'inputNumber', required: true}},
    {key: colKey.semiMsl, label: 'SemiMsl', otherOptions: {type: 'inputNumber', required: true}},
    {key: colKey.productImage, label: 'Product Image', otherOptions: {type: 'image'}},
    {key: colKey.logoUrl, label: 'Logo File', otherOptions: {type: 'image'}},
  ]
}

const colInfos: any = {
  productInfo: {
    title: 'Product Info',
    field: 'productInfo',
    keywords: [
      colKey.productName,
      colKey.customerId,
      colKey.baseProductId,
    ]
  },
  properties: {
    title: 'Properties',
    field: 'properties',
    keywords: [
      colKey.plateTypeId,
      colKey.packagingTypeId,
      colKey.description,
    ]
  },
  quantityInfo: {
    title: 'Quantity Info',
    field: 'quantityInfo',
    keywords: [
      colKey.marginOfError,
      colKey.minOrderQuantity,
      colKey.productMsl,
      colKey.semiMsl,
    ]
  },
  productImage: {
    title: 'Product Image',
    field: 'images',
    keywords: [
      colKey.productImage
    ]
  },
  logoUrl: {
    title: 'Logo File',
    field: 'logoUrl',
    keywords: [
      colKey.logoUrl
    ]
  }
}

const ProductManagementColumnModel = (): any => {
  let modelArr: any = [
    colInfos.properties,
    colInfos.quantityInfo,
    colInfos.productImage
  ]

  modelArr = modelArr.map((row: any) => getColModelItem(row, keyInfosArray))
  const productInfoColumn = getColModelItem(colInfos.productInfo, keyInfosArray)
  delete productInfoColumn.customFilterAndSearch
  modelArr.unshift(productInfoColumn)
  modelArr.push({
    title: 'Logo Type',
    field: colKey.logoType,
    editable: 'never',
    initialEditValue: 0,
    type: 'numeric',
    lookup: {0: 'No', 1: 'Yes'}
  })
  modelArr.push(getColModelItem(colInfos.logoUrl, keyInfosArray))
  modelArr.push({
    title: 'Plain Product',
    field: colKey.plain,
    initialEditValue: 0,
    type: 'numeric',
    lookup: {0: 'No', 1: 'Yes'}
  })

  return modelArr
}

export default ProductManagementColumnModel
