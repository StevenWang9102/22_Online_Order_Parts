import React, { useEffect } from 'react'
import { Button, Col, Divider, Form, Row, Tooltip } from 'antd'
import { getRandomKey } from '../../../services/helpers'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

export interface ItemElementPropsInterface {
	name: string | any[]
	label?: string
	rules?: any[]
	inputElement?: any
	isWholeRowWidth?: boolean
	otherProps?: any
	isNotEditable?: boolean
}

export interface CommonFormPropsInterface {
	items: ItemElementPropsInterface[]
	onFormChange?: any
	onFormBlur?: (form: any) => void
	initFormValues?: any
}

export const validateMessages: any = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    min: '${label} must be greater than ${min}',
    max: '${label} must be less than ${max}',
	  range: '${label} must be between ${min} and ${max}',
  },
}

const CommonForm = (props: CommonFormPropsInterface) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (props.initFormValues) {
	    form.setFieldsValue(props.initFormValues)
	    props.onFormBlur && props.onFormBlur(form)
    }
  }, [props.initFormValues])

  const itemElement = (propsItemElement: ItemElementPropsInterface) => {
    const formItem = (
		  <Form.Item
			  {...propsItemElement.otherProps}
			  name={propsItemElement.name}
			  label={propsItemElement.label || (propsItemElement.name[0].toUpperCase() + propsItemElement.name.slice(1))}
			  rules={propsItemElement.rules || []}
		  >
			  {propsItemElement.inputElement}
		  </Form.Item>
	  )
    return propsItemElement.isWholeRowWidth ?
      <Col key={getRandomKey()} sm={24}>{formItem}</Col> :
      <Col key={getRandomKey()} lg={6} md={12} sm={24}>{formItem}</Col>
  }

  const itemListElement = (propsItemListElement: ItemElementPropsInterface[]) => {
    return (
      <div key={getRandomKey()} style={{width: '100%', padding: '1rem', margin: '0.6rem', border: '1px solid #9e9e9e', borderRadius: '0.8rem'}}>
		    <Form.List name={propsItemListElement[0].name[0]}>
			    {(fields, { add, remove }) => (
				    <>
					    {fields.map((field, index) => (
						    <div key={field.key}>
							    <Row gutter={24} align="middle">
	                  {
	                    propsItemListElement.map((row: ItemElementPropsInterface) => {
                        row.otherProps = {...row.otherProps, ...field, fieldKey: [field.fieldKey, row.name[1]]}
	                      row.name = [field.name, row.name[1]]
	                      return itemElement(row)
	                    })
	                  }
								    {
                      !propsItemListElement[0].isNotEditable &&
									    <Col key={getRandomKey()} xl={1}>
										    <Tooltip title="delete">
											    <Button type="primary" ghost shape="circle" onClick={() => remove(field.name)} icon={<DeleteOutlined />} />
										    </Tooltip>
									    </Col>
								    }
							    </Row>
							    {(fields.length - 1) === index ? null : <Divider style={{borderColor: '#9e9e9e'}} dashed />}
						    </div>
					    ))}
					    {
						    !propsItemListElement[0].isNotEditable &&
						    <Form.Item>
							    <Button type="primary" ghost onClick={() => add()} block icon={<PlusOutlined />}>
								    Add field
							    </Button>
						    </Form.Item>
					    }
				    </>
			    )}
		    </Form.List>
	    </div>
    )
  }

  return (
	  <Form
		  form={form}
		  scrollToFirstError={true}
		  wrapperCol={{span: 24}}
		  layout="vertical"
		  onValuesChange={(changedValues, values) => {
			  props.onFormChange(changedValues, values, form)
		  }}
		  validateMessages={validateMessages}
		  onBlur={() => props.onFormBlur && props.onFormBlur(form)}
	  >
		  <Row gutter={24}>
			  {
	        props.items.map((row: ItemElementPropsInterface | ItemElementPropsInterface[]) => {
					  if (row) {
						  if (!Array.isArray(row)) {
							  return itemElement(row)
						  } else {
							  return itemListElement(row)
						  }
					  }
			    })
			  }
		  </Row>
	  </Form>
  )
}

export default CommonForm
