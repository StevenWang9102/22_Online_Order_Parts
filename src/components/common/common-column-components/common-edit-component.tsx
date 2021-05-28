import React from 'react'
import { Form, Input } from 'antd'
import CommonEditSelectComponent from './common-edit-select-component'
import CommonEditImageComponent from './common-edit-image-component'

const { TextArea } = Input

interface CommonEditComponentPropsInterface {
  formItems: any
  restFormItems?: any
  propsFunction: any
}

export interface FormItemPropsInterface {
  label: string
  keyword: string
  value?: any
  type?: string
  required?: boolean
  disabled?: boolean
  selectionGetUrl?: string
  isNotShow?: boolean
  valueJoinArray?: any
  isOverrideSelectionOptions?: boolean
  exceptionOptionKey?: any
}

const CommonEditComponent = (props: CommonEditComponentPropsInterface): any => {
  const propsFn = props.propsFunction

  const inputFormItem = (formItem: FormItemPropsInterface, otherProps?: any) => {
    const inputProps = {
      allowClear: true,
      style: {width: '12rem'},
      disabled: formItem.disabled,
      onChange: (e: any) => updateRowData(formItem, otherProps?.type === 'number' ? parseInt(e.target.value, 10) : e.target.value),
      ...otherProps
    }
    return (
      <Input {...inputProps} />
    )
  }

  const selectFormItem = (formItem: FormItemPropsInterface) => {
    return (
      <CommonEditSelectComponent
        key={formItem.keyword}
        urlInfoKey={formItem.keyword}
        required={formItem.required}
        label={formItem.label}
        disabled={formItem.disabled}
        selectionGetUrl={formItem.selectionGetUrl}
        valueJoinArray={formItem.valueJoinArray}
        isOverrideSelectionOptions={formItem.isOverrideSelectionOptions}
        exceptionOptionKey={formItem.exceptionOptionKey}
        propsFn={propsFn}
      />
    )
  }

  const ImageFormItem = (FormItem: FormItemPropsInterface) => {
    return (
      <CommonEditImageComponent
        key={FormItem.keyword}
        formItems={FormItem}
        propsFn={propsFn}
      />
    )
  }

  const inputNumberFormItem = (formItem: FormItemPropsInterface) => {
    const inputNumberProps: any = {
      type: 'number',
      onKeyPress: (e: any) => {
        if (e.key === 'e' || e.key === '-') {
          e.preventDefault()
        }
      }
    }
    return inputFormItem(formItem, inputNumberProps)
  }

  const inputTextAreaFormItem = (formItem: FormItemPropsInterface) => {
    const onTextAreaChange: any = (e: any) => updateRowData(formItem, e.target.value)
    return <TextArea style={{width: '12rem'}} showCount autoSize maxLength={300} disabled={formItem.disabled} onChange={onTextAreaChange} />
  }

  const updateRowData = (formItem: FormItemPropsInterface, value: any) => {
    propsFn.onRowDataChange({
      ...propsFn.rowData,
      [formItem.keyword]: value
    })
  }

  const dateFormItem = (formItem: FormItemPropsInterface) => null

  const dateRangeFormItem = (formItem: FormItemPropsInterface) => null

  const getFormItem = (formItem: FormItemPropsInterface) => {
    switch (formItem.type) {
      case 'select':
        return selectFormItem(formItem)
      case 'inputNumber':
        return formatFormItem(formItem, inputNumberFormItem(formItem))
      case 'inputTextArea':
        return formatFormItem(formItem, inputTextAreaFormItem(formItem))
      case 'date':
        return formatFormItem(formItem, dateFormItem(formItem))
      case 'dateRange':
        return formatFormItem(formItem, dateRangeFormItem(formItem))
      case 'image':
        return ImageFormItem(formItem)
      default:
        return formatFormItem(formItem, inputFormItem(formItem))
    }
  }

  const formatFormItem = (formItem: FormItemPropsInterface, element: any) => {
    return (
      <Form.Item
        key={formItem.keyword}
        label={formItem.label}
        name={formItem.keyword}
        initialValue={formItem.value || ''}
        rules={[{ required: formItem.required, message: formItem.label + ' is required!' }]}
      >
        {element}
      </Form.Item>
    )
  }

  return (
    <div>
      <Form layout="vertical">
	      { props.formItems.map((formItem: FormItemPropsInterface) => !formItem.isNotShow ? getFormItem(formItem) : null) }
	      { props.restFormItems ? props.restFormItems.map((formItem: any) => formItem) : null }
      </Form>
    </div>
  )
}

export default CommonEditComponent
