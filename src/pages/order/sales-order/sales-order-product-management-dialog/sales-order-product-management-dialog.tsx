import React, { useEffect, useState } from 'react'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import CommonForm, { ItemElementPropsInterface } from '../../../../components/common/common-form/common-form'
import { Button, DatePicker, Divider, Input, InputNumber, Switch } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import moment from 'moment'
import { ApiRequest } from '../../../../services/api/api'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import DispatchOrderDetailsTable
  from '../../../warehouse/dispatch/dispatch-list/dispatch-order-details-table/dispatch-order-details-table'

interface IOrderProduct {
  orderProductId?: any
  orderId?: any
  productId?: any
  quantity?: any
  unitPrice?: any
  price?: any
  marginOfError?: any
}

interface IOrderOption {
  optionId?: any
  quantity?: any
  unitPrice?: any
  price?: any
}

interface IFormValues {
  orderId?: any
  customerId?: any
  employeeId?: any
  orderDate?: any
  requiredDate?: any
  orderNo?: any
  deliveryDate?: any
  deliveryMethodId?: any
  deliveryCityId?: any
  orderStatusId?: any
  deliveryAsap?: any
  comments?: any
  postalCode?: any
  deliveryAddress?: any
  deliveryName?: any
  paid?: any
  totalPrice?: number
  priceInclgst?: number
  orderProduct?: IOrderProduct[]
  orderOption?: IOrderOption[]
}

const SalesOrderProductManagementDialog = (props: { orderData: any, onDialogClose: any, dispatchData?: any, isNewOrder: boolean, isAwaitingDispatchPage?: boolean }) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()
  const [orderProductChangedValueIndex, setOrderProductChangedValueIndex] = useState<any>()
  const [orderOptionChangedValueIndex, setOrderOptionChangedValueIndex] = useState<any>()
  const [subtotal, setSubtotal] = useState(0)

  // store selection options from apis request
  const [customerOptions, setCustomerOptions] = useState([])
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [deliveryMethodOptions, setDeliveryMethodOptions] = useState([])
  const [orderStatusOptions, setOrderStatusOptions] = useState([])
  const [deliveryCityOptions, setDeliveryCityOptions] = useState([])
  const [productsOptions, setProductsOptions] = useState([])
  const [productOptionOptions, setProductOptionOptions] = useState([])
  const [addressOptions, setAddressOptions] = useState([])

  useEffect(() => {
    console.log(props.orderData)
    setInitFormValues({
      orderStatusId: 1,
      ...props.orderData,
      requiredDate: props.orderData.requiredDate && moment(props.orderData.requiredDate + '.000Z') || moment().add(2, 'weeks'),
      deliveryDate: props.orderData.deliveryDate && moment(props.orderData.deliveryDate + '.000Z'),
      orderDate: (props.orderData.orderDate && moment(props.orderData.orderDate + '.000Z')) || moment(),
    })
    if (props.orderData?.customerId) {
      setProducts(props.orderData.customerId)
      setAddress(props.orderData.customerId)
    }
    getSelectOptions(urlKey.Customer).then(res => setCustomerOptions(res))
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))
    getSelectOptions(urlKey.DeliveryMethod).then(res => setDeliveryMethodOptions(res))
    getSelectOptions(urlKey.OrderStatus).then(res => setOrderStatusOptions(res))
    getSelectOptions(urlKey.City).then(res => setDeliveryCityOptions(res))
    getSelectOptions(urlKey.ProductOption).then(res => setProductOptionOptions(res))
  }, [props.orderData])

  const setProducts = (id: any) => {
    getSelectOptions('', 'Product/GetProductByCustomerId?id=' + id)
      .then(res => setProductsOptions(res))
  }

  const setAddress = (id: any) => {
    getSelectOptions('', 'ExtraAddress/GetAllExtraAddress?customerId=' + id)
      .then(res => setAddressOptions(res))
  }

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'customerId', label: 'Customer', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Customer, customerOptions, ['company', 'customerCode'])},
    {name: 'employeeId', label: 'Sales', inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], true)},
    {name: 'orderDate', label: 'Order Date', rules: [{required: true}], inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'requiredDate', label: 'REQ Date', rules: [{required: true}], inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'orderNo', label: 'Order No', inputElement: <Input disabled={true} />},
    {name: 'orderStatusId', label: 'Order Status', inputElement: commonFormSelect(urlKey.OrderStatus, orderStatusOptions, [], true)},
    {name: 'deliveryMethodId', label: 'Delivery Method', inputElement: commonFormSelect(urlKey.DeliveryMethod, deliveryMethodOptions)},
    {name: 'deliveryName', label: 'Delivery Name', inputElement: <Input />},
    {name: 'deliveryCityId', label: 'Delivery City', inputElement: commonFormSelect(urlKey.City, deliveryCityOptions)},
    {name: 'deliveryAddress', label: 'Delivery Address', inputElement: commonFormSelect(urlKey.ExtraAddress, addressOptions, ['address'])},
    {name: 'postalCode', inputElement: <Input />},
    {name: 'deliveryDate', label: 'Delivery Date', inputElement: <DatePicker disabled={props.isNewOrder} format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'comments', label: 'Comment', inputElement: <Input.TextArea showCount={true} maxLength={150} autoSize={ true } />},
    {name: 'deliveryAsap', label: 'Delivery ASAP', inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},
    {name: 'paid', inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},
    !props.isAwaitingDispatchPage && [
      {name: ['orderProduct', 'productId'], isNotEditable: props.isAwaitingDispatchPage, label: 'Product', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Product, productsOptions)},
      {name: ['orderProduct', 'unitPrice'], label: 'Unit Price', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber disabled={true} />},
      {name: ['orderProduct', 'quantity'], label: 'Quantity', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber />},
      {name: ['orderProduct', 'price'], label: 'Price', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber disabled={true} />},
      {name: ['orderProduct', 'marginOfError'], label: 'Margin of Error', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber disabled={true} />},
    ],
    !props.isAwaitingDispatchPage && [
      {name: ['orderOption', 'optionId'], isNotEditable: props.isAwaitingDispatchPage, label: 'Product Option', rules: [{required: true}], inputElement: commonFormSelect(urlKey.ProductOption, productOptionOptions)},
      {name: ['orderOption', 'unitPrice'], label: 'Unit Price', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber disabled={true} />},
      {name: ['orderOption', 'quantity'], label: 'Quantity', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber />},
      {name: ['orderOption', 'price'], label: 'Price', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber disabled={true} />},
    ]
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => {
    setSubtotal(getSubtotal(form))
    // console.log(changedValues)
    // console.log(newValues)
    const changedValuesKey = Object.keys(changedValues)[0]
    let orderProductChangedValueIndex = 0
    let orderOptionChangedValueIndex = 0
    let orderProductChangedValue: IOrderProduct
    let orderOptionChangedValue: IOrderOption
    switch (changedValuesKey) {
      case 'customerId':
        if (changedValues['customerId']) {
          setCustomerInfosToForm(changedValues['customerId'], newValues, form)
          return
        }
        break
      case 'orderProduct':
        orderProductChangedValueIndex = changedValues['orderProduct'].length - 1
        setOrderProductChangedValueIndex(orderProductChangedValueIndex)
        orderProductChangedValue = changedValues['orderProduct'][orderProductChangedValueIndex]
        // console.log(orderProductChangedValue)
        if (orderProductChangedValue && orderProductChangedValue.productId && (Object.keys(orderProductChangedValue).length === 1)) {
          setProductInfosToForm(orderProductChangedValueIndex, orderProductChangedValue?.productId, newValues, form)
          return
        }
        break
      case 'orderOption':
        orderOptionChangedValueIndex = changedValues['orderOption'].length - 1
        setOrderOptionChangedValueIndex(orderOptionChangedValueIndex)
        orderOptionChangedValue = changedValues['orderOption'][orderOptionChangedValueIndex]
        // console.log(orderOptionChangedValue)
        if (orderOptionChangedValue && orderOptionChangedValue.optionId && (Object.keys(orderOptionChangedValue).length === 1)) {
          setProductOptionInfosToForm(orderOptionChangedValueIndex, orderOptionChangedValue?.optionId, newValues, form)
          return
        }
        break
    }
  }

  const orderProductChange = (form: any) => {
    const formNewestValues = form.getFieldsValue()
    form.setFieldsValue({
      ...formNewestValues,
      orderProduct: autoPrice(formNewestValues, 'orderProduct', orderProductChangedValueIndex),
      orderOption: autoPrice(formNewestValues, 'orderOption', orderOptionChangedValueIndex),
    })
  }

  const autoPrice = (formNewestValues: any, key: any, index: any) => {
    const orderKey: any = formNewestValues[key] || []
    // console.log(orderKey)
    const orderKeyChangedValue = orderKey[index]
    let changedFieldObj = {}
    if (orderKeyChangedValue?.unitPrice && orderKeyChangedValue?.quantity) {
      changedFieldObj = {price: orderKeyChangedValue.unitPrice * orderKeyChangedValue.quantity}
    }
    orderKey[index] = {...orderKeyChangedValue, ...changedFieldObj}
    return orderKey
  }

  const setProductOptionInfosToForm = async (index: any, optionId: any, newValues: any, form: any) => {
    // console.log(index)
    // console.log(productId)
    const result = await ApiRequest({
      urlInfoKey: urlKey.ProductOption,
      type: urlType.GetById,
      dataId: optionId,
      isShowSpinner: false
    })
    if (result && newValues) {
      const productOptionInfos = result.data.data
      const orderOption: any = newValues.orderOption || []
      console.log(orderOption[index])
      orderOption[index] = {
        ...orderOption[index],
        unitPrice: productOptionInfos.price || 0,
        price: orderOption[index].quantity * (productOptionInfos.price || 0),
      }
      console.log(orderOption[index])
      const updatedValues = {
        ...newValues,
        orderOption: orderOption
      }
      form.setFieldsValue(updatedValues)
    }
  }

  const setProductInfosToForm = async (index: any, productId: any, newValues: any, form: any) => {
    // console.log(index)
    // console.log(productId)
    const result = await ApiRequest({
      urlInfoKey: urlKey.Product,
      type: urlType.GetById,
      dataId: productId,
      isShowSpinner: false
    })
    if (result && newValues) {
      const productInfos = result.data.data
      const quotationResult = await ApiRequest({
        url: 'Quotation/GetQuotationByCustomerId?id=' + productInfos.customerId + '&draft=0',
        method: 'get',
        isShowSpinner: false
      })
      let unitPriceFromQuotation = 0
      if (quotationResult?.data?.data.length) {
        const quotationItem = quotationResult.data.data[0].quotationItem
        if (quotationItem?.length) {
          const productQuotationItem = quotationItem.filter((row: any) => row.productId === productId)
          if (productQuotationItem?.length) {
            unitPriceFromQuotation = productQuotationItem[0].price
          } else {
            await SweetAlertService.errorMessage('This product is not included in the Quotation.')
          }
        } else {
          await SweetAlertService.errorMessage('There is not any product item in the Quotation.')
        }
      } else {
        await SweetAlertService.errorMessage('There is not an active Quotation for this customer.')
      }
      const orderProduct: any = newValues.orderProduct || []
      orderProduct[index] = {
        productId: productInfos.productId,
        quantity: productInfos.minOrderQuantity || 0,
        unitPrice: unitPriceFromQuotation || 0,
        price: (unitPriceFromQuotation || 0) * (productInfos.minOrderQuantity || 0),
        marginOfError: productInfos.marginOfError || 0
      }
      const updatedValues = {
        ...newValues,
        orderProduct: orderProduct
      }
      form.setFieldsValue(updatedValues)
    }
  }

  const setCustomerInfosToForm = async (customerId: any, newValues: any, form: any) => {
    setProducts(customerId)
    setAddress(customerId)
    const result = await ApiRequest({
      urlInfoKey: urlKey.Customer,
      type: urlType.GetById,
      dataId: customerId,
      isShowSpinner: false
    })
    if (result) {
      const customerInfos = result.data.data
      const updatedValues = {
        ...newValues,
        orderProduct: [],
        customerId: customerInfos.customerId,
        employeeId: customerInfos.employeeId,
        deliveryMethodId: customerInfos.deliveryMethodId,
        deliveryCityId: customerInfos.cityId,
        postalCode: customerInfos.postalCode,
        deliveryName: customerInfos.contactPerson,
      }
      form.setFieldsValue(updatedValues)
    }
  }

  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
    orderProductChange(form)
    setSubtotal(getSubtotal(form))
    // console.log(subtotal)
  }

  const onConfirm = async () => {
    orderProductChange(formRef)
    const subtotalCurrent = getSubtotal(formRef)
    setSubtotal(subtotalCurrent)
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    if (formValues) {
      console.log(formValues)
      const requestValues = {
        ...formValues,
        orderId: props.orderData.orderId,
        paid: formValues.paid ? 1 : 0,
        deliveryAsap: formValues.deliveryAsap ? 1 : 0,
        deliveryAddress: typeof (formValues.deliveryAddress) === 'number' ? addressOptions.filter((row: any) => row.addressId === formValues.deliveryAddress)[0]['address'] : '',
        orderProduct: formValues.orderProduct?.map((row: IOrderProduct) => ({
          ...row,
          orderId: props.orderData.orderId
        })),
        priceInclgst: subtotalCurrent * 0.15,
        totalPrice: subtotalCurrent * 1.15,
        orderOption: formValues.orderOption
      }
      // console.log(requestValues)
      let result
      if (props.isNewOrder) {
        result = await ApiRequest({
          urlInfoKey: urlKey.SalesOrder,
          type: urlType.Create,
          data: requestValues
        })
      } else {
        const isUpdateFullApi: boolean = checkIfOrderProductChanged(formRef)
        result = await ApiRequest({
          url: isUpdateFullApi ? 'SalesOrder/UpdateFullOrder' : 'SalesOrder/UpdateOrder',
          method: 'put',
          data: requestValues
        })
      }
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }

  const checkIfOrderProductChanged = (form: any) => {
    const orderProductValues: IOrderProduct[] = form.getFieldsValue().orderProduct
    const orderProductOriginValues: IOrderProduct[] = props.orderData.orderProduct
    if ((!orderProductOriginValues || !orderProductOriginValues?.length) &&
      (!orderProductValues || !orderProductValues.length)) {
      return false
    }
    if (orderProductOriginValues?.length && orderProductValues?.length) {
      for (const row of orderProductOriginValues) {
        const newRow: IOrderProduct = orderProductValues.filter((item: IOrderProduct) => row?.orderProductId === item?.orderProductId)[0]
        if (!newRow || !(
          newRow.productId === row.productId &&
          newRow.price === row.price &&
          newRow.marginOfError === row.marginOfError &&
          newRow.unitPrice === row.unitPrice &&
          newRow.quantity === row.quantity
        )) {
          return true
        }
      }
      return false
    }
    return true
  }

  const getSubtotal = (form: any) => {
    const formValue = form.getFieldsValue()
    return (
      formValue.orderProduct?.reduce((a: number, c: IOrderProduct) => a + c?.price, 0) +
      formValue.orderOption?.reduce((a: number, c: IOrderOption) => a + c?.price, 0)
    ) || 0
  }

  const productPriceInfos = () => {
    return props.isAwaitingDispatchPage ? null : (
      <div style={{display: 'flex', justifyContent: 'flex-end', margin: '2rem auto', fontSize: '1rem'}}>
        <div style={{width: '14rem', textAlign: 'right'}}>
          <div>Subtotal: ${subtotal}</div>
          <div>GST: ${(subtotal * 0.15).toFixed(2)}</div>
          <Divider />
          <div>Total: ${(subtotal * 1.15).toFixed(2)}</div>
        </div>
      </div>
    )
  }

  const getModalFooter = () => {
    return props.isAwaitingDispatchPage ? null : (
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button
          onClick={() => {
            props.onDialogClose(false)
          }}
          style={{marginRight: '2rem'}}
        >Cancel</Button>
        <Button
          disabled={!formRef || (props.orderData.orderStatusId >= 10 && checkIfOrderProductChanged(formRef))}
          onClick={onConfirm}
          type="primary"
        >Confirm</Button>
      </div>
    )
  }

  return (
    <div style={ {width: '97%', margin: '0 auto 1rem'} }>
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
      {props.isAwaitingDispatchPage ? <DispatchOrderDetailsTable orderId={ initFormValues?.orderId } isDispatchUpdate={!!props.dispatchData} dispatchData={props.dispatchData} onDialogClose={props.onDialogClose} /> : null}
      {productPriceInfos()}
      {getModalFooter()}
    </div>
  )
}

export default SalesOrderProductManagementDialog
