import React, { useEffect, useState } from 'react'
import { urlKey, urlType } from '../../../../../services/api/api-urls'
import CommonForm, { ItemElementPropsInterface } from '../../../../../components/common/common-form/common-form'
import { Button, Input, Switch } from 'antd'
import { ApiRequest } from '../../../../../services/api/api'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import SupplierQualificationManagementTable
  from './supplier-qualification-management-table/supplier-qualification-management-table'
import RawMaterialManagementPage
  from '../../../../settings/small-group-management-pages/raw-material-management-page/raw-material-management-page'
import SupplierRawMaterialTable from './supplier-raw-material-table/supplier-raw-material-table'

interface IQualification {
  suplierId?: any
  expDate?: any
  qualificationName?: any
  qualificationUrls?: any
}

interface IFormValues {
  suplierId?: any
  suplierName?: number
  suplierType?: any
  qualification?: IQualification[]
}

const SupplierManagementDialog = (props: { data: any, onDialogClose: any, isRawMaterial: boolean }) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()

  useEffect(() => {
    console.log(props.data)
    setInitFormValues(props.data)
  }, [props.data])

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'suplierName', label: 'Supplier Name', rules: [{required: true}], inputElement: <Input />},
    {name: 'suplierType', label: 'With Qualification', inputElement: <Switch />, otherProps: {valuePropName: 'checked'}}
  ]

  const onFormChange = async (changedValues: any, newValues: any, form: any) => {
    console.log(changedValues)
    console.log(newValues)
  }

  const onFormBlur = (form: any) => {
    if (!formRef) {
      setFormRef(form)
    }
  }

  const onConfirm = async () => {
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    if (formValues) {
      console.log(formValues)
      const requestValues = {
        ...formValues,
        suplierType: formValues.suplierType ? 1 : 0,
        suplierId: props.data?.suplierId,
      }
      console.log(requestValues)
      const result = await ApiRequest({
        urlInfoKey: urlKey.Supplier,
        type: urlType.Update,
        data: requestValues
      })
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }

  const getModalFooter = () => {
    return (
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
        <Button
          onClick={() => {
            props.onDialogClose()
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
      {props.isRawMaterial ? <SupplierRawMaterialTable supplierId={props.data?.suplierId} /> : <SupplierQualificationManagementTable supplierId={ props.data.suplierId } />}
      {getModalFooter()}
    </div>
  )
}

export default SupplierManagementDialog
