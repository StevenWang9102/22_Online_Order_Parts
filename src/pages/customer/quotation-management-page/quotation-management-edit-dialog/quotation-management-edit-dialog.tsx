import React from 'react'
import CommonForm, { ItemElementPropsInterface } from '../../../../components/common/common-form/common-form'
import { Button, DatePicker, Input, InputNumber, Switch, Checkbox } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import { ApiRequest } from '../../../../services/api/api'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import { useEffect, useState } from 'react'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import moment from 'moment'

interface IQuotationItem {
	quotationItemId?: any
	quotationId?: any
	productId?: any
	price?: any
	baseProductId?: any
}

interface IQuotationOption {
	optionId?: any
	quotationId?: any
	quotationOptionItemId: any
	customizeOptionNotes: any
}

interface IFormValues {
	quotationId?: any
	draft?: any
	customerId?: any
	employeeId?: any
	effDate?: any
	expDate?: any
	quotationItem: IQuotationItem[]
	optionCheckboxGroup?: any
	optionCustomComment?: any
}

const QuotationManagementEditDialog = (props: { quotationData: any, onDialogClose: any, isNewQuotation: boolean }) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()
  // const [quotationItemChangedValueIndex, setQuotationItemChangedValueIndex] = useState<any>()

  // store selection options from apis request
  const [customerOptions, setCustomerOptions] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>()
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [productsOptions, setProductsOptions] = useState([])
  const [baseProductsOptions, setBaseProductsOptions] = useState([])
  const [quotationCommentOptions, setQuotationCommentOptions] = useState([])

  useEffect(() => {
    // console.log(props.quotationData)
	  let optionCustomComment = ''
	  const optionCheckboxGroup: any[] = []
	  if (props.quotationData?.quotationOption?.length) {
      props.quotationData.quotationOption.map((row: IQuotationOption) => {
        if (row.customizeOptionNotes) {
          optionCustomComment = row.customizeOptionNotes
			  }
        if (row.quotationOptionItemId) {
          optionCheckboxGroup.push(row.quotationOptionItemId)
			  }
		  })
	  }
    setInitFormValues({
      draft: 1,
      ...props.quotationData,
      effDate: props.quotationData?.effDate && moment(props.quotationData.effDate + '.000Z') || moment(),
      expDate: props.quotationData?.expDate && moment(props.quotationData.expDate + '.000Z'),
	    optionCheckboxGroup: optionCheckboxGroup,
	    optionCustomComment: optionCustomComment
    })
    if (props.quotationData?.customerId) {
      getSelectOptions('', 'Product/GetProductByCustomerId?id=' + props.quotationData?.customerId)
        .then(res => setProductsOptions(res))
    }
    getSelectOptions(urlKey.Customer).then(res => {
	    setCustomerOptions(res)
	    setSelectedCustomer(res.filter((row: any) => row.customerId === props.quotationData?.customerId)[0])
    })
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))
    getSelectOptions(urlKey.BaseProduct).then(res => setBaseProductsOptions(res))
    getSelectOptions(urlKey.QuotationOptionItem).then(res => {
	    setQuotationCommentOptions(res.map((row: any) => ({
		    label: row[urlKey.QuotationOptionItem + 'Name'],
		    value: row[urlKey.QuotationOptionItem + 'Id'],
	    })))
    })
  }, [props.quotationData])

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'customerId', label: 'Customer', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Customer, customerOptions, ['company', 'customerCode'])},
    {name: 'employeeId', label: 'Sales', inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], true)},
    {name: 'effDate', label: 'Quote Date', rules: [{required: true}], inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'expDate', label: 'Valid Date', rules: [{required: true}], inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'quotationNo', label: 'Quotation No', inputElement: <Input disabled={true} />},
    {name: 'draft', inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},
    [
      {name: ['quotationItem', 'productId'], label: 'Product', inputElement: commonFormSelect(urlKey.Product, productsOptions)},
      {name: ['quotationItem', 'baseProductId'], label: 'Base Product', inputElement: commonFormSelect(urlKey.BaseProduct, baseProductsOptions)},
      {name: ['quotationItem', 'price'], label: 'Price($)', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber />},
    ],
	  {name: 'optionCheckboxGroup', label: 'Quotation Comment Options', isWholeRowWidth: true, inputElement: <Checkbox.Group style={{display: 'flex', flexDirection: 'column'}} options={quotationCommentOptions} />},
	  {name: 'optionCustomComment', label: 'Additional Comment', isWholeRowWidth: true, inputElement: <Input.TextArea showCount={true} maxLength={150} autoSize={ true } />},
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => {
    // console.log(changedValues)
    // console.log(newValues)
    const changedValuesKey = Object.keys(changedValues)[0]
    let quotationItemChangedValueIndex = 0
    let quotationItemChangedValue: IQuotationItem
    switch (changedValuesKey) {
      case 'customerId':
        if (changedValues['customerId']) {
          setCustomerInfosToForm(changedValues['customerId'], newValues, form)
          return
        }
        break
      case 'quotationItem':
        quotationItemChangedValueIndex = changedValues['quotationItem'].length - 1
        // setQuotationItemChangedValueIndex(quotationItemChangedValueIndex)
        quotationItemChangedValue = changedValues['quotationItem'][quotationItemChangedValueIndex]
        // console.log(quotationItemChangedValue)
        if (quotationItemChangedValue && quotationItemChangedValue.productId && (Object.keys(quotationItemChangedValue).length === 1)) {
          setProductInfosToForm(quotationItemChangedValueIndex, newValues, form, quotationItemChangedValue?.productId, null)
          return
        }
	      if (quotationItemChangedValue && quotationItemChangedValue.baseProductId && (Object.keys(quotationItemChangedValue).length === 1)) {
		      setProductInfosToForm(quotationItemChangedValueIndex, newValues, form, null, quotationItemChangedValue?.baseProductId)
		      return
	      }
        break
    }
  }

  const setProductInfosToForm = async (index: any, newValues: any, form: any, productId: any, baseProductId: any) => {
    // console.log(index)
    // console.log(productId)
    const result = await ApiRequest({
      url: productId ? 'Product/GetProductById?id=' + productId + '&group1Id=' + selectedCustomer?.group1Id : 'BaseProduct/GetBaseProductById?id=' + baseProductId,
      method: 'get',
      isShowSpinner: true
    })
    if (result && newValues) {
      const productInfos = result.data.data
      const quotationItem: any = newValues.quotationItem || []
      quotationItem[index] = productId ? {
        productId: productInfos.productId,
	      baseProductId: null,
        price: productInfos.minPrice || 0
      } : {
        productId: null,
	      baseProductId: productInfos.baseProductId,
	      price: productInfos.price?.filter((row: any) => row.group1Id === selectedCustomer?.group1Id)[0]?.minPrice
      }
      const updatedValues = {
        ...newValues,
        quotationItem: quotationItem
      }
      form.setFieldsValue(updatedValues)
    }
  }

  const setCustomerInfosToForm = async (customerId: any, newValues: any, form: any) => {
    getSelectOptions('', 'Product/GetProductByCustomerId?id=' + customerId).then(res => setProductsOptions(res))
    const result = await ApiRequest({
      urlInfoKey: urlKey.Customer,
      type: urlType.GetById,
      dataId: customerId,
      isShowSpinner: false
    })
    if (result) {
      const customerInfos = result.data.data
	    setSelectedCustomer(customerInfos)
      const updatedValues = {
        ...newValues,
        quotationItem: [],
        customerId: customerInfos.customerId,
        employeeId: customerInfos.employeeId,
      }
      form.setFieldsValue(updatedValues)
    }
  }

  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
  }

  const setQuotaionOption = (formValues: IFormValues) => {
    const quotationOption = []
	  formValues.optionCheckboxGroup.map((row: any) => {
		  quotationOption.push({
			  quotationId: props.quotationData.quotationId,
			  quotationOptionItemId: row,
			  customizeOptionNotes: null
		  })
	  })
	  if (formValues.optionCustomComment) {
      quotationOption.push({
			  quotationId: props.quotationData.quotationId,
			  quotationOptionItemId: null,
			  customizeOptionNotes: formValues.optionCustomComment
		  })
	  }
	  return quotationOption
  }

  const onConfirm = async () => {
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    if (formValues) {
	    // console.log(formValues)
	    const quotationOption: IQuotationOption[] = setQuotaionOption(formValues)
      const requestValues = {
        ...formValues,
        quotationId: props.quotationData.quotationId,
	      draft: formValues.draft ? 1 : 0,
	      quotationOption: quotationOption,
        quotationItem: formValues.quotationItem?.map((row: IQuotationItem) => ({
          ...row,
          quotationId: props.quotationData.quotationId
        })),
      }
      // console.log(requestValues)
      let result
      if (props.isNewQuotation) {
        result = await ApiRequest({
          urlInfoKey: urlKey.Quotation,
          type: urlType.Create,
          data: requestValues
        })
      } else {
	      result = await ApiRequest({
		      urlInfoKey: urlKey.Quotation,
		      type: urlType.Update,
		      data: requestValues
	      })
	      if (result && !requestValues.draft) {
		      const updateStatusResult = await ApiRequest({
			      url: 'Quotation/UpdateQuotationDraftStatus?id=' + result.data.data,
			      method: 'put'
		      })
	      }
      }
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }

  return (
    <div style={ {width: '97%', margin: '0 auto 1rem'} }>
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
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

export default QuotationManagementEditDialog
