import React, { useEffect, useState } from 'react'
import CommonForm, { ItemElementPropsInterface } from '../../../../../../components/common/common-form/common-form'
import { Button } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../../../components/common/common-form/common-form-select'
import { ApiRequest } from '../../../../../../services/api/api'
import { urlKey } from '../../../../../../services/api/api-urls'
import SweetAlertService from '../../../../../../services/lib/utils/sweet-alert-service'
import WarehouseConfirmDialogTable from './warehouse-confirm-dialog-table/warehouse-confirm-dialog-table'

interface IFormValues {
  applyEmployeeId?: any
}

const WarehouseConfirmDialog = (props: {applicationId: any, rawMaterialId: any, onDialogClose: any}) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()

  // store selection options from apis request
  const [employeeOptions, setEmployeeOptions] = useState([])

  const [tableData, setTableData] = useState([])

  useEffect(() => {
    // console.log(props.orderData)
    setInitFormValues({})
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))
  }, [])

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'applyEmployeeId', label: 'Warehouse Employee', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'])},
  ]

  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
  }

  const onConfirm = async () => {
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    if (formValues) {
      if (!tableData?.length) {
        await SweetAlertService.errorMessage('Please set up table firstly!')
        return
      }
      const result = await ApiRequest({
        url: 'RawMaterialApplication/ProcessRawMaterialApplication?id=' + props.applicationId + '&warehouseEmployeeId=' + formValues.applyEmployeeId,
        method: 'put'
      })
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }

  const getTableRenderData = (data: any) => {
    setTableData(data)
  }

  return (
    <div style={ {width: '97%', margin: '0 auto 1rem'} }>
      <WarehouseConfirmDialogTable applicationId={props.applicationId} rawMaterialId={props.rawMaterialId} getRenderData={getTableRenderData} />
      <CommonForm items={formItems} onFormChange={() => null} onFormBlur={onFormBlur} initFormValues={initFormValues} />
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
    </div>
  )
}

export default WarehouseConfirmDialog
