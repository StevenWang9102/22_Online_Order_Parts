import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, Row, Col } from "antd";
import { setCookie, getCookie } from 'react-use-cookie'
import { IOrderProduct, IOnlineOrderBody } from '../../interface/orderInterface'
import moment from 'moment'
import {
  FetchAllCustomersRequest,
  FetchAllEmployeeRequest,
  FetchAllOrderStatusRequest,
  FetchQuotationRequest,
  FetchAllCityRequest,
  FetchDeliverMethods,
  PostOnlineOrder,
} from "../../services/order-services";
import { Tabs } from "antd";
import EditableTable from './EditableTable'
import SweetAlertService from '../../services/lib/utils/sweet-alert-service'

const { TabPane } = Tabs;
const { TextArea } = Input;

const tailLayout = {
  wrapperCol: { offset: 5, span: 16 },
};

const tailLayout1 = {
  wrapperCol: { offset: 11, span: 12 },
};

type SizeType = Parameters<typeof Form>[0]["size"];

export const OrderOnline = ({
  form,
  activeKey,
  setActiveKey,
  fetchAllOrders,
  setCreateVisable,
  loginedUserInfo,
  createVisable,
}) => {

  const [customersList, setCustomers] = useState([]);
  const [emplyeeList, setEmployees] = useState([]);
  const [orderStatusList, setOrderStatus] = useState([]);
  const [productList, setProductList] = useState([]);
  const [spanSet, setSpanSet] = useState({ spanL: 5, spanR: 14 });
  const [tableDataSource, setTableSource] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const [cityList, setCityList] = useState([]);
  const [deliverMethods, setDeliverMethod] = useState([]);

  useEffect(() => {
    requestInitials();
  }, []);

  useEffect(() => {
    // base on  tab change, set different span.
    if (activeKey == "1") setSpanSet({ spanL: 12, spanR: 12 })
    if (activeKey == "2") setSpanSet({ spanL: 5, spanR: 12 })
  }, [activeKey])


  const requestInitials = () => {
    FetchAllCustomersRequest()
      .then((res) => {
        console.log("FetchAllCustomersRequest,res=", res.data.data);
        setCustomers(res.data.data);
      })
      .catch((err) => { });

    FetchAllEmployeeRequest()
      .then((res) => {
        console.log("FetchAllEmployeeRequest,res=", res.data.data);
        setEmployees(res.data.data);
      })
      .catch((err) => { });

    FetchAllOrderStatusRequest()
      .then((res) => {
        console.log("FetchAllOrderStatusRequest,res=", res.data.data);
        setOrderStatus(res.data.data);
      })
      .catch((err) => { });

    FetchAllCityRequest()
      .then((res) => {
        console.log("FetchAllCityRequest,res=", res.data.data);
        setCityList(res.data.data);
      })
      .catch((err) => { });

    FetchDeliverMethods()
      .then((res) => {
        console.log("FetchDeliverMethods,res=", res.data.data);
        setDeliverMethod(res.data.data);
      })
      .catch((err) => { });

    const customerId = getCookie('customerId')

    FetchQuotationRequest(customerId)
      .then((res) => {
        console.log("FetchQuotationRequest,res=", res.data.data);
        const quotation = res.data.data;
        if (quotation.length !== 0) {
          console.log("FetchQuotationRequest,quotation=", quotation);
          console.log("FetchQuotationRequest,quotationItem=", quotation[0].quotationItem);

          const quotationItem = quotation[0].quotationItem || []
          var total = 0
          var product: any = []

          // 计算TOTAL
          quotationItem.forEach((each: any, index: number) => {
            if (each.productId) total = total + each.price
            product.push({
              key: index,
              ...each,
            })
          });

          console.log("FetchQuotationRequest,total=", total);
          console.log("FetchQuotationRequest,product=", product);

          setProductList(product);
          setTotal(total)
        } else {
          setTotal(0)
          setProductList([]) // refresh component.
        }
      })
      .catch((err) => { });
  };

  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const onSubmitClicked = (formValues: any) => {
    console.log('onFinish787,values', formValues);
    console.log('onFinish787,productList', productList);
    console.log('onFinish787,tableDataSource', tableDataSource);

    const orderProduct: IOrderProduct | any = []
    var isMinOrder: any = []

    tableDataSource.forEach((each: any) => {
      console.log('tableDataSource,each', each);

      if(each.isChecked){
        if(each.quantity >= each.minOrderQuantity){
          orderProduct.push({
            "orderId": "string",
            "productId": each.productId,
            "quantity": parseInt(each.quantity),
            "unitPrice": 0,
            "price": parseFloat(each.price.slice(2)),
            "marginOfError": 0
          })
        } else {
          isMinOrder.push(false)
        }
      }
    })

    if(isMinOrder.includes(false)){
      SweetAlertService.errorMessage("Quantity should be larger than minimum quantity.")
    } else {
      postNewOnlineOrder(formValues,orderProduct)
    }
  }

  const postNewOnlineOrder=(formValues,orderProduct)=>{
    const customerId = parseInt(getCookie("customerId"))

    const newBody: IOnlineOrderBody = {
      "customerId": customerId,
      "totalPrice": total,
      "employeeId": 0,
      "priceInclgst": total * 0.85,
      "requiredDate": moment(),
      "deliveryName": formValues['contact name'] || '',
      "deliveryAddress": formValues['delivery address'],
      "postalCode": formValues.postCode || '',
      "orderDate": moment().add(14, 'days'),
      "comments": formValues.note || '',
      "deliveryAsap": 0,
      "orderStatusId": 2,
      "deliveryCityId": formValues['delivery city'],
      "deliveryMethodId": formValues['delivery method'],
      "orderProduct": orderProduct,
      "orderOption": [
        {
          "optionId": 0,
          "quantity": 0,
          "unitPrice": 0,
          "price": 0
        }
      ]
    }

    console.log('PostOnlineOrder,newBody=', newBody)

    PostOnlineOrder(newBody)
      .then(res => {
        fetchAllOrders()
        setCreateVisable(false)
        console.log('PostOnlineOrder,res=', res.data.data)
      }).catch(err => {
        SweetAlertService.errorMessage("Create order error！")
        setCreateVisable(false)
      })
  }

  console.log('total689',total);
  
  return (
    <Form
      form={form}
      labelCol={{ span: spanSet.spanL }}
      wrapperCol={{ span: spanSet.spanR }}
      layout='horizontal'
      onFinish={onSubmitClicked}
      initialValues={{
        "contact name": loginedUserInfo.contactPerson,
        "delivery method": loginedUserInfo.deliveryMethod && loginedUserInfo.deliveryMethod.deliveryMethodId,
        "delivery city": loginedUserInfo.city && loginedUserInfo.city.cityId,
        "delivery address": loginedUserInfo.address1,
        "postCode": loginedUserInfo.postalCode,
        size: componentSize
      }}
      onValuesChange={onFormLayoutChange}
      size={componentSize as SizeType}
      style={{ minHeight: 200 }}
    >

      <Tabs
        defaultActiveKey='1'
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        centered
      >

        {/* -------------------------- Product --------------------------*/}
        <TabPane tab='Basic Information' key='1'>
            {productList.length === 0 ? <span style={{ color: 'grey' }}>Please ask for a quotation first.</span> :
              <EditableTable
                productList={productList}
                tableDataSource={tableDataSource}
                setTableSource={setTableSource}
                setTotal={setTotal}
              />}

          <Row style={{margin: '20px 0px'}}>
            <Col span={12}>
              <Form.Item name="total" label='Total Price'>
                <div style={{color: 'red', fontWeight: 600}}>{`$ ${total.toFixed(2)}`}</div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="price" label='Price(Include gst)'>
                <div style={{color: 'red'}}>{`$ ${(total * 0.85).toFixed(2)}`}</div>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item {...tailLayout1}>
            <Button
              type='primary'
              style={{width: 70}}
              onClick={()=> setActiveKey('2')}
            >Next</Button>
          </Form.Item>
          
        </TabPane>

        {/* -------------------------- Delivery --------------------------*/}
        <TabPane tab='Delivery' key='2' style={{ maxWidth: 600, marginLeft: '20%' }}>
          <Form.Item name="contact name" label='Contact Name'>
            <Input />
          </Form.Item>

          <Form.Item name="delivery method" label='Delivery Method' rules={[{ required: true }]}>
            <Select >
              {deliverMethods.map((each: any) => (
                <Select.Option
                  value={each.deliveryMethodId}>{each.deliveryMethodName}</Select.Option>
              ))}
            </Select>
          </Form.Item>


          <Form.Item name="delivery city" label='Delivery City' rules={[{ required: true }]}>
            <Select >
              {cityList.map((each: any) => (
                <Select.Option value={each.cityId}>{each.cityName}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="delivery address" label='Delivery Address' rules={[{ required: true }]}>
            <Input  />
          </Form.Item>

          <Form.Item name="postCode" label='Postal Code'>
            <Input  />
          </Form.Item>

          <Form.Item name="note" label='Note'>
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" style={{marginRight: 10}}>
              Submit
              </Button>

              <Button onClick={()=>setActiveKey("1")}>
              Back
              </Button>
          </Form.Item>

        </TabPane>

      </Tabs>
    </Form>
  );
};

export default OrderOnline;
