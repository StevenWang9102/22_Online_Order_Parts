import { getColModelItem } from '../../../../../../services/helpers'
import { urlKey } from '../../../../../../services/api/api-urls'

export const colKey: any = {
  rawMaterialId: urlKey.RawMaterial,
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.rawMaterialId, label: '', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['rawMaterialName', 'rawMaterialCode']}},
  ]
}

const colInfos: any = {
  rawMaterialId: {
    title: 'Raw Material',
    field: 'rawMaterialName',
    keywords: [
      colKey.rawMaterialId,
    ]
  },
}

const SupplierRawMaterialColumnModel = (): any => {
  let modelArr: any = [
    colInfos.rawMaterialId
  ]

  modelArr = modelArr.map((row: any) => getColModelItem(row, keyInfosArray))

  return modelArr
}

export default SupplierRawMaterialColumnModel
