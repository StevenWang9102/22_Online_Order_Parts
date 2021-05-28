import React, {useEffect, useState} from 'react'
import {ApiRequest} from '../../../../../../services/api/api'
import { Button, Checkbox, Form, InputNumber, Modal, Switch } from 'antd'
import {commonFormSelect, getSelectOptions} from '../../../../../../components/common/common-form/common-form-select'
import CommonForm, {ItemElementPropsInterface} from '../../../../../../components/common/common-form/common-form'
import {urlKey} from '../../../../../../services/api/api-urls'
import { checkMachineUserName } from '../../suborder-list/suborder-modal/suborder-common-modal/suborder-common-modal'
import { CommonCheckboxTree } from '../../../../../../components/common/common-checkbox-tree'
import SweetAlertService from '../../../../../../services/lib/utils/sweet-alert-service'

export const PackagingAssignPlateModal = (props: {visible: any, onOk: any, onCancel: any, data: any, machine: any}) => {
  let isDataAvailable = false
  let defaultQty: any = null
  const [initFormValues, setInitFormValues] = useState<any>()
  const [formRef, setFormRef] = useState<any>()
  const [boxOptions, setBoxOptions] = useState([])
  const [plateOptions, setPlateOptions] = useState([])
  const [postRequestBoxIdArrs, setPostRequestBoxIdArrs] = useState<any>([])
  const [putRequestBoxIdArrs, setPutRequestBoxIdArrs] = useState<any>([])
  const [barcodeOptions, setBarcodeOptions] = useState([])
  const [barcodeOptionsList, setBarcodeOptionsList] = useState([])
  const [barcodeCheckbox, setBarcodeCheckbox] = useState<any>([])
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)
  const {visible, onOk, onCancel, data, machine} = props
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    checkMachineUserName(visible, machine, setIsVisible, onCancel)
  }, [props.visible])

  useEffect(() => {
    if (data?.suborderId && !isDataAvailable) {
      isDataAvailable = true
      ApiRequest({
        url: 'PackagingType/GetPackagingTypeById?id=' + data.workOrder?.product?.packagingTypeId,
        method: 'get',
        isShowSpinner: true
      }).then(resType => {
        defaultQty = resType.data.data.quantity
        ApiRequest({
          url: 'Plate/GetAvailablePlate?package=1',
          method: 'get',
          isShowSpinner: true
        }).then(resPlate => {
          setPlateOptions(resPlate.data.data)
          ApiRequest({
            url: 'PlateBox/GetAllPlateBox?suborderId=' + data.suborderId,
            method: 'get',
            isShowSpinner: true
          }).then(resPlateBox => {
            const plateBoxData = resPlateBox.data.data || []
            console.log(plateBoxData)
            getSelectOptions('', 'Box/GetAllBox?suborderId=' + data.suborderId).then(res => {
              res.sort((a: any, b: any) => a.sequence - b.sequence)
              const barCodeArr: any = []
              const barcodeOptionsData = res.map((row: any) => {
                barCodeArr.push(row.barCode)
                return {
                  value: row.barCode,
                  label: row.barCode
                }
              })
              setBarcodeOptionsList(barCodeArr)
              setBarcodeOptions(barcodeOptionsData)
              const formValues: any = []
              const postBoxIds: any = []
              const putBoxIds: any = []
              res.map((row: any) => {
                const filteredValue = plateBoxData.filter((plateBoxItem: any) => plateBoxItem.boxId === row.boxId)[0]
                formValues.push({
                  boxId: row.boxId,
                  barCode: row.barCode,
                  quantity: filteredValue?.plateId ? filteredValue?.box?.quantity : defaultQty,
                  plateId: filteredValue?.plateId || null
                })
                if (filteredValue?.plateId) {
                  putBoxIds.push(row.boxId)
                } else {
                  postBoxIds.push(row.boxId)
                }
              })
              console.log(postBoxIds)
              console.log(putBoxIds)
              console.log(formValues)
              setPostRequestBoxIdArrs(postBoxIds)
              setPutRequestBoxIdArrs(putBoxIds)
              setInitFormValues({
                plateBox: formValues
              })
              setBoxOptions(res)
            })
          })
        })
      })
    }
  }, [data])

  const onSubmit = async () => {
    if (!formRef) {
      onCancel()
      return
    }
    const postRequestData: any = []
    const putRequestData: any = []
    const deleteRequestDataIds: any = []
    formRef.submit()
    const formValues = await formRef.validateFields()
    // if (plateBox.filter((row: any) => !row.plateId).length) {
    //   SweetAlertService.errorMessage('Please ')
    // }
    if (formValues) {
      const plateBox = formValues.plateBox || []
      if (plateBox.filter((row: any) => !row.plateId && !row.isDelete).length) {
        SweetAlertService.errorMessage('Please assign all plates or delete empty box.')
        return
      }
      plateBox.map((row: any) => {
        if (row.isDelete) {
          deleteRequestDataIds.push(row.boxId)
        } else {
          if (postRequestBoxIdArrs.includes(row.boxId)) {
            postRequestData.push(row)
          } else {
            putRequestData.push(row)
          }
        }
      })
      console.log(postRequestData)
      console.log(putRequestData)
      console.log(deleteRequestDataIds)
      ApiRequest({
        url: 'PlateBox/AddAndUpdatePlateBoxAndBoxQuantity',
        method: 'put',
        data: {
          addList: postRequestData,
          updateList: putRequestData,
          deleteBoxIdList: deleteRequestDataIds
        }
      }).then(_ => {
        onOk()
      })
    }
  }

  const formItems: ItemElementPropsInterface[] | any = [
    [
      {name: ['plateBox', 'boxId'], isNotEditable: true, label: '箱子条形码/Box Barcode', inputElement: commonFormSelect(urlKey.Box, boxOptions, ['barCode'], true)},
      {name: ['plateBox', 'quantity'], label: '数量/Quantity', rules: [{type: 'number', min: 0}], inputElement: <InputNumber />},
      {name: ['plateBox', 'plateId'], isNotEditable: true, label: '托盘/Plate', inputElement: commonFormSelect(urlKey.Plate, plateOptions, ['plateCode'], false)},
      {name: ['poDetail', 'isDelete'], label: '删除/Delete', inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},
    ]
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => null

  const onChangeBarcodeCheckbox = (list: any) => {
    setBarcodeCheckbox(list)
    setIndeterminate(!!list.length && list.length < barcodeOptionsList.length)
    setCheckAll(list.length === barcodeOptionsList.length)
  }

  const onCheckAllChange = (e: any) => {
    setBarcodeCheckbox(e.target.checked ? barcodeOptionsList : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  const onFormBlur = (form: any) => {
    setFormRef(form)
  }

  return (
    <Modal destroyOnClose={true} title="打包分配托盘/Packaging Assign Plate" visible={isVisible} onCancel={onCancel} width={1000}
      footer={false}
    >
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
        <Button
          onClick={onCancel}
          style={{marginRight: '2rem'}}
        >取消/Cancel</Button>
        <Button
          onClick={onSubmit}
          type="primary"
        >提交/Submit</Button>
      </div>
      <CommonCheckboxTree
        data={barcodeOptionsList}
        onChange={(list: any) => {setBarcodeCheckbox(list)}}
      />
      <Form onValuesChange={(changedValues, values) => {
        if (!formRef) {
          return
        }
        const plateBox = formRef.getFieldsValue()?.plateBox || []
        const newPlateBox = plateBox.map((row: any) => barcodeCheckbox?.includes(row.barCode) ? ({
          ...row,
          plateId: changedValues.plate
        }) : row)
        formRef.setFieldsValue({
          plateBox: newPlateBox
        })
      }}>
        <Form.Item style={{width: '50%'}} name="plate" label="批量分配托盘/Batch change plate">
          {commonFormSelect(urlKey.Plate, plateOptions, ['plateCode'], false)}
        </Form.Item>
      </Form>
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
        <Button
          onClick={onCancel}
          style={{marginRight: '2rem'}}
        >取消/Cancel</Button>
        <Button
          onClick={onSubmit}
          type="primary"
        >提交/Submit</Button>
      </div>
    </Modal>
  )
}
