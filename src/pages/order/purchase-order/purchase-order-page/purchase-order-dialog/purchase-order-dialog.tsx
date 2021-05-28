import React, { useEffect, useState } from 'react'
import { urlKey, urlType } from '../../../../../services/api/api-urls'
import CommonForm, { ItemElementPropsInterface } from '../../../../../components/common/common-form/common-form'
import { Button, Divider, Input, InputNumber, Switch } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../../components/common/common-form/common-form-select'
import { ApiRequest } from '../../../../../services/api/api'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'

interface IPoDetail {
  rawMaterialId?: any
  quantity?: any
  price?: any
  comments?: any
}

interface IFormValues {
  poId?: any
  price?: number
  createdEmployeeId?: any
  suplierId?: any
  poNo?: any
  poDetail?: IPoDetail[]
}

const PurchaseOrderDialog = (props: { orderData: any, onDialogClose: any, isNewOrder: boolean }) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()
  const [subtotal, setSubtotal] = useState(0)

  // store selection options from apis request
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [supplierOptions, setSupplierOptions] = useState([])
  const [rawMaterialOptions, setRawMaterialOptions] = useState([])

  useEffect(() => {
    console.log(props.orderData)
    setInitFormValues(props.orderData)
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))
    getSelectOptions(urlKey.Supplier).then(res => setSupplierOptions(res))
    if (props.orderData.suplierId) {
      getRawMaterialOptions(props.orderData.suplierId)
    }
  }, [props.orderData])

  const getRawMaterialOptions = (id: any) => {
    getSelectOptions(urlKey.RawMaterial, 'SupplierRawMaterial/GetRawMaterialBySupplierId?supplierId=' + id).then(res => setRawMaterialOptions(res))
  }

  const isFormDisabled = props.orderData.poId && !(props.orderData.poStatusId && props.orderData.poStatusId === 1)

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'poNo', label: 'PO Number', rules: [{required: true}], inputElement: <Input readOnly={isFormDisabled} />},
    {name: 'createdEmployeeId', label: 'CreatedBy', inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], isFormDisabled)},
    {name: 'suplierId', label: 'Supplier', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Supplier, supplierOptions, [], isFormDisabled)},
    [
      {name: ['poDetail', 'rawMaterialId'], label: 'Raw Material', rules: [{required: true}], inputElement: commonFormSelect(urlKey.RawMaterial, rawMaterialOptions, [], isFormDisabled)},
      {name: ['poDetail', 'quantity'], label: 'Quantity', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber readOnly={isFormDisabled} />},
      {name: ['poDetail', 'price'], label: 'Price', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber readOnly={isFormDisabled} />},
      {name: ['poDetail', 'comments'], label: 'Comment', inputElement: <Input.TextArea readOnly={isFormDisabled} showCount={true} maxLength={150} autoSize={ true } />},
      {name: ['poDetail', 'completed'], label: 'Completed', inputElement: <Switch disabled={!(props.orderData?.poStatusId && props.orderData?.poStatusId === 2)} />, otherProps: {valuePropName: 'checked'}},
    ]
  ]

  const onFormChange = async (changedValues: any, newValues: any, form: any) => {
    // setSubtotal(getSubtotal(form))
    console.log(changedValues)
    console.log(newValues)
    if (changedValues.suplierId) {
      getRawMaterialOptions(changedValues.suplierId)
      return
    }
    if (changedValues.poDetail) {
      const poDetailIndex: any = changedValues.poDetail.length - 1
      const selectedPoDetail = newValues.poDetail[poDetailIndex]
      if (!changedValues.poDetail[poDetailIndex] || !selectedPoDetail.poDetailId) {
        return
      }
      if (!selectedPoDetail.completed) {
        // form.setFieldsValue(setPoDetailComplete(newValues, poDetailIndex, true))
        return
      }
      const result = await SweetAlertService.confirmMessage()
      if (result) {
        ApiRequest({
          url: 'PurchaseOrder/CompletePoDetail?poDetailId=' + selectedPoDetail.poDetailId,
          method: 'put',
          isShowSpinner: false
        }).then(_ => null)
      } else {
        form.setFieldsValue(setPoDetailComplete(newValues, poDetailIndex, false))
      }
    }
  }

  const setPoDetailComplete = (formNewValue: any, poDetailIndex: any, completed: boolean) => {
    return {
      ...formNewValue,
      poDetail: formNewValue.poDetail.map((row: any, index: number) => {
        if (index === poDetailIndex) {
          return {...row, completed: completed}
        } else {
          return row
        }
      })
    }
  }

  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
    setSubtotal(getSubtotal(form))
    // console.log(subtotal)
  }

  const onConfirm = async () => {
    const orderStatus = props.orderData?.poStatusId
    if (orderStatus && orderStatus !== 1) {
      // SweetAlertService.errorMessage('This order is approved, completed or cancelled, so not Editable')
      props.onDialogClose(true)
      return
    }
    const subtotalCurrent = getSubtotal(formRef)
    setSubtotal(subtotalCurrent)
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    if (formValues) {
      // console.log(formValues)
      const requestValues = {
        ...formValues,
        poId: props.orderData?.poId,
        price: subtotalCurrent
      }
      console.log(requestValues)
      const result = await ApiRequest({
        urlInfoKey: urlKey.PurchaseOrder,
        type: props.isNewOrder ? urlType.Create : urlType.Update,
        data: requestValues
      })
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }

  const getSubtotal = (form: any) => form.getFieldsValue().poDetail?.reduce((a: number, c: IPoDetail) => a + c?.price, 0) || 0

  const poDetailPriceInfos = () => {
    return (
      <div style={{display: 'flex', justifyContent: 'flex-end', margin: '2rem auto', fontSize: '1rem'}}>
        <div style={{width: '14rem', textAlign: 'right'}}>
          <Divider />
          <div>Total: ${subtotal.toFixed(2)}</div>
        </div>
      </div>
    )
  }

  const getModalFooter = () => {
    return (
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button
          onClick={() => {
            props.onDialogClose(false)
          }}
          style={{marginRight: '2rem'}}
        >Cancel</Button>
        <Button
          disabled={!formRef}
          onClick={onConfirm}
          type="primary"
        >Confirm</Button>
      </div>
    )
  }

  return (
    <div style={ {width: '97%', margin: '0 auto 1rem'} }>
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
      {poDetailPriceInfos()}
      {getModalFooter()}
    </div>
  )
}

export default PurchaseOrderDialog
